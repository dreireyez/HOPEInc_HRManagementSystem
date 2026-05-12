-- =========================================
-- MIGRATION 012: sepdate auto-soft-delete + cascade rename + new stamp formats
-- =========================================
-- Per product spec, the stamp column stays varchar(60). Strings sized to fit:
--   "DEACTIVATED <8> <YYYY-MM-DDTHH:MM:SSZ>"  -> 41 chars
--   "REACTIVATED <8> <ts>"                   -> 41 chars
--   "CASCADE-DEL <empno> <ts>"               -> up to 47 chars
--   "CASCADE-RECOVER <empno> <ts>"           -> up to 51 chars
-- Do NOT alter the stamp column.
-- =========================================

-- =========================================
-- STEP 1: Replace cascade trigger with renamed function and new stamp format
-- =========================================
DROP TRIGGER IF EXISTS employee_status_cascade ON employee;
DROP FUNCTION IF EXISTS cascade_employee_status();
DROP FUNCTION IF EXISTS cascade_employee_soft_delete();

CREATE FUNCTION cascade_employee_soft_delete()
RETURNS TRIGGER AS $$
DECLARE
  ts text := to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"');
BEGIN
  IF NEW.record_status = 'INACTIVE' AND OLD.record_status = 'ACTIVE' THEN
    UPDATE jobhistory
    SET record_status = 'INACTIVE',
        stamp = 'CASCADE-DEL ' || NEW.empno || ' ' || ts
    WHERE empno = NEW.empno;
  END IF;

  IF NEW.record_status = 'ACTIVE' AND OLD.record_status = 'INACTIVE' THEN
    UPDATE jobhistory
    SET record_status = 'ACTIVE',
        stamp = 'CASCADE-RECOVER ' || NEW.empno || ' ' || ts
    WHERE empno = NEW.empno;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employee_status_cascade
AFTER UPDATE ON employee
FOR EACH ROW
WHEN (OLD.record_status IS DISTINCT FROM NEW.record_status)
EXECUTE FUNCTION cascade_employee_soft_delete();

-- =========================================
-- STEP 2: BEFORE-UPDATE trigger: setting sepdate flips the row to INACTIVE
-- This is defense-in-depth alongside the service layer (employeeService.js).
-- The cascade above will then fire on the AFTER-UPDATE pass.
-- =========================================
DROP TRIGGER IF EXISTS sepdate_softdelete ON employee;
DROP FUNCTION IF EXISTS sepdate_triggers_softdelete();

CREATE FUNCTION sepdate_triggers_softdelete()
RETURNS TRIGGER AS $$
DECLARE
  ts text := to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"');
  actor text := substr(COALESCE(current_setting('app.current_user', true), 'system'), 1, 8);
BEGIN
  IF NEW.sepdate IS NOT NULL
     AND OLD.sepdate IS NULL
     AND COALESCE(NEW.record_status, 'ACTIVE') = 'ACTIVE' THEN
    NEW.record_status := 'INACTIVE';
    NEW.stamp := 'DEACTIVATED ' || actor || ' ' || ts;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sepdate_softdelete
BEFORE UPDATE ON employee
FOR EACH ROW
EXECUTE FUNCTION sepdate_triggers_softdelete();
