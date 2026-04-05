--CORE HR TABLES

CREATE TABLE employee (
empno VARCHAR(5) PRIMARY KEY,
lastname VARCHAR(15),
firstname VARCHAR(15),
gender CHAR(1) CHECK (gender IN ('M','F')),
birthdate DATE,
hiredate DATE,
sepDate DATE,
record_status VARCHAR(10) DEFAULT 'ACTIVE',
stamp TEXT
);

CREATE TABLE department (
deptCode VARCHAR(3) PRIMARY KEY,
deptName VARCHAR(20),
record_status VARCHAR(10) DEFAULT 'ACTIVE',
stamp TEXT
);

CREATE TABLE job (
jobCode VARCHAR(4) PRIMARY KEY,
jobDesc VARCHAR(20),
record_status VARCHAR(10) DEFAULT 'ACTIVE',
stamp TEXT
);

CREATE TABLE jobHistory (
empNo VARCHAR(5),
jobCode VARCHAR(4),
effDate DATE,
salary DECIMAL(10,2) CHECK (salary >= 0),
deptCode VARCHAR(3),
record_status VARCHAR(10) DEFAULT 'ACTIVE',
stamp TEXT,

PRIMARY KEY (empNo, jobCode, effDate),
FOREIGN KEY (empNo) REFERENCES employee(empno),
FOREIGN KEY (jobCode) REFERENCES job(jobCode),
FOREIGN KEY (deptCode) REFERENCES department(deptCode)

);
