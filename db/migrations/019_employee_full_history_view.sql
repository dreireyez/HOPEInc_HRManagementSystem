-- =========================================
-- VIEW: employee_full_history
-- Full job history with job and department details
-- Uses ACTIVE HR rows only for report consumption
-- =========================================
CREATE OR REPLACE VIEW employee_full_history AS
SELECT
  e.empno,
  e.firstname,
  e.lastname,
  e.record_status AS employee_status,
  jh.jobcode,
  j.jobdesc,
  jh.deptcode,
  d.deptname,
  jh.effdate,
  jh.salary,
  jh.record_status AS jobhistory_status
FROM jobHistory jh
JOIN employee e
  ON e.empno = jh.empno
LEFT JOIN job j
  ON j.jobcode = jh.jobcode
LEFT JOIN department d
  ON d.deptcode = jh.deptcode
WHERE jh.record_status = 'ACTIVE'
  AND e.record_status = 'ACTIVE';
