-- =========================================
-- VERIFY TABLE COUNTS
-- =========================================
SELECT 'employee' AS table_name, COUNT(*) AS total FROM employee
UNION ALL
SELECT 'department', COUNT(*) FROM department
UNION ALL
SELECT 'job', COUNT(*) FROM job
UNION ALL
SELECT 'jobHistory', COUNT(*) FROM jobHistory;

-- NOTE:
-- employee: 32 (based on provided dataset)
-- department: 8
-- job: 14
-- jobHistory: 54

-- =========================================
-- VERIFY MODULES
-- =========================================
SELECT COUNT(*) AS module_count FROM module;
-- EXPECTED: 5

-- =========================================
-- VERIFY RIGHTS
-- =========================================
SELECT COUNT(*) AS rights_count FROM rights;
-- EXPECTED: 17

-- =========================================
-- VERIFY RIGHTS PER MODULE
-- =========================================
SELECT module_id, COUNT(*) AS total_rights
FROM rights
GROUP BY module_id;

-- EXPECTED:
-- Emp_Mod  = 4
-- JH_Mod   = 4
-- Job_Mod  = 4
-- Dept_Mod = 4
-- Adm_Mod  = 1

-- =========================================
-- VERIFY NO NULL VALUES
-- =========================================
SELECT * FROM rights WHERE right_value IS NULL;
SELECT * FROM rights WHERE stamp IS NULL;
SELECT * FROM module WHERE stamp IS NULL;

-- EXPECTED: 0 rows

-- =========================================
-- VERIFY FOREIGN KEY INTEGRITY
-- =========================================

-- JobHistory → Employee
SELECT *
FROM jobHistory
WHERE empno NOT IN (SELECT empno FROM employee);

-- JobHistory → Job
SELECT *
FROM jobHistory
WHERE jobCode NOT IN (SELECT jobCode FROM job);

-- JobHistory → Department
SELECT *
FROM jobHistory
WHERE deptCode NOT IN (SELECT deptCode FROM department);

-- EXPECTED: 0 rows

-- =========================================
-- SAMPLE JOIN CHECK
-- =========================================
SELECT e.empno, e.lastname, j.jobDesc, d.deptName
FROM employee e
JOIN jobHistory jh ON e.empno = jh.empno
JOIN job j ON j.jobCode = jh.jobCode
JOIN department d ON d.deptCode = jh.deptCode
LIMIT 10;