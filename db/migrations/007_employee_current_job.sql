-- =========================================
-- CREATE VIEW: employee_current_job
-- Latest ACTIVE job per employee
-- =========================================
CREATE VIEW employee_current_job AS
SELECT 
    e.empno,
    e.lastname,
    e.firstname,
    j.jobDesc,
    d.deptName,
    jh.salary,
    jh.effDate
FROM employee e
JOIN jobHistory jh 
    ON e.empno = jh.empno
JOIN job j 
    ON j.jobCode = jh.jobCode
JOIN department d 
    ON d.deptCode = jh.deptCode
WHERE jh.record_status = 'ACTIVE'
AND jh.effDate = (
    SELECT MAX(jh2.effDate)
    FROM jobHistory jh2
    WHERE jh2.empno = e.empno
    AND jh2.record_status = 'ACTIVE'
);