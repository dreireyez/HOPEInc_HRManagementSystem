-- =========================================
-- VIEW 1: headcount_by_dept
-- Count of ACTIVE employees per department
-- based on latest ACTIVE jobHistory
-- =========================================
CREATE VIEW headcount_by_dept AS
SELECT 
    d.deptCode,
    d.deptName,
    COUNT(*) AS headcount
FROM department d
JOIN jobHistory jh 
    ON d.deptCode = jh.deptCode
JOIN employee e 
    ON e.empno = jh.empno
WHERE jh.record_status = 'ACTIVE'
AND e.record_status = 'ACTIVE'
AND jh.effDate = (
    SELECT MAX(jh2.effDate)
    FROM jobHistory jh2
    WHERE jh2.empno = jh.empno
    AND jh2.record_status = 'ACTIVE'
)
GROUP BY d.deptCode, d.deptName;

-- =========================================
-- VIEW 2: salary_summary_by_job
-- MIN, MAX, AVG salary per jobCode
-- from ACTIVE jobHistory
-- =========================================
CREATE VIEW salary_summary_by_job AS
SELECT 
    j.jobCode,
    j.jobDesc,
    MIN(jh.salary) AS min_salary,
    MAX(jh.salary) AS max_salary,
    AVG(jh.salary) AS avg_salary
FROM job j
JOIN jobHistory jh 
    ON j.jobCode = jh.jobCode
WHERE jh.record_status = 'ACTIVE'
GROUP BY j.jobCode, j.jobDesc;