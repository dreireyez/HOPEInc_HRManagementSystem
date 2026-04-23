-- =========================================
-- FUNCTION: cascade employee status
-- =========================================
CREATE OR REPLACE FUNCTION cascade_employee_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If employee is deactivated
  IF NEW.record_status = 'INACTIVE' THEN
    UPDATE jobHistory
    SET record_status = 'INACTIVE'
    WHERE empno = NEW.empno;
  END IF;

  -- If employee is restored
  IF NEW.record_status = 'ACTIVE' THEN
    UPDATE jobHistory
    SET record_status = 'ACTIVE'
    WHERE empno = NEW.empno;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- DROP OLD TRIGGER (SAFE)
-- =========================================
DROP TRIGGER IF EXISTS employee_status_cascade ON employee;

-- =========================================
-- CREATE TRIGGER
-- =========================================
CREATE TRIGGER employee_status_cascade
AFTER UPDATE ON employee
FOR EACH ROW
WHEN (OLD.record_status IS DISTINCT FROM NEW.record_status)
EXECUTE FUNCTION cascade_employee_status();