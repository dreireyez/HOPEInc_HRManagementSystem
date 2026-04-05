-- =========================================
-- AUTH TABLE
-- =========================================
CREATE TABLE "user" (
  userId UUID PRIMARY KEY,
  username VARCHAR(50),
  user_type VARCHAR(20) CHECK (user_type IN ('SUPERADMIN','ADMIN','USER')),
  record_status VARCHAR(10) DEFAULT 'INACTIVE',
  stamp TEXT
);

-- =========================================
-- MODULE TABLE
-- =========================================
CREATE TABLE module (
  module_id VARCHAR(10) PRIMARY KEY,
  module_name VARCHAR(50),
  record_status VARCHAR(10),
  stamp TEXT
);

-- =========================================
-- RIGHTS TABLE
-- =========================================
CREATE TABLE rights (
  right_id VARCHAR(20) PRIMARY KEY,
  right_name VARCHAR(100),
  right_value INT,
  module_id VARCHAR(10),
  record_status VARCHAR(10),
  stamp TEXT,
  FOREIGN KEY (module_id) REFERENCES module(module_id)
);

-- =========================================
-- USER MODULE TABLE
-- =========================================
CREATE TABLE user_module (
  userId UUID,
  module_id VARCHAR(10),
  rights_value INT,
  PRIMARY KEY (userId, module_id),
  FOREIGN KEY (userId) REFERENCES "user"(userId),
  FOREIGN KEY (module_id) REFERENCES module(module_id)
);

-- =========================================
-- USER MODULE RIGHTS TABLE
-- =========================================
CREATE TABLE UserModule_Rights (
  userId UUID,
  right_id VARCHAR(20),
  right_value INT,
  PRIMARY KEY (userId, right_id),
  FOREIGN KEY (userId) REFERENCES "user"(userId),
  FOREIGN KEY (right_id) REFERENCES rights(right_id)
);

-- =========================================
-- SEED MODULES
-- =========================================
INSERT INTO module VALUES ('Emp_Mod', 'Employee Module', 'ACTIVE', 'SEEDED');
INSERT INTO module VALUES ('JH_Mod', 'Job History Module', 'ACTIVE', 'SEEDED');
INSERT INTO module VALUES ('Job_Mod', 'Job Module', 'ACTIVE', 'SEEDED');
INSERT INTO module VALUES ('Dept_Mod', 'Department Module', 'ACTIVE', 'SEEDED');
INSERT INTO module VALUES ('Adm_Mod', 'Admin Module', 'ACTIVE', 'SEEDED');

-- =========================================
-- SEED RIGHTS (17 TOTAL)
-- =========================================

-- EMPLOYEE
INSERT INTO rights VALUES ('EMP_VIEW','View Employees',1,'Emp_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('EMP_ADD','Add Employee',1,'Emp_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('EMP_EDIT','Edit Employee',1,'Emp_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('EMP_DEL','Soft Delete Employee',1,'Emp_Mod','ACTIVE','SEEDED');

-- JOB HISTORY
INSERT INTO rights VALUES ('JH_VIEW','View Job History',1,'JH_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('JH_ADD','Add Job History',1,'JH_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('JH_EDIT','Edit Job History',1,'JH_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('JH_DEL','Soft Delete Job History',1,'JH_Mod','ACTIVE','SEEDED');

-- JOB
INSERT INTO rights VALUES ('JOB_VIEW','View Jobs',1,'Job_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('JOB_ADD','Add Job',1,'Job_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('JOB_EDIT','Edit Job',1,'Job_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('JOB_DEL','Soft Delete Job',1,'Job_Mod','ACTIVE','SEEDED');

-- DEPARTMENT
INSERT INTO rights VALUES ('DEPT_VIEW','View Departments',1,'Dept_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('DEPT_ADD','Add Department',1,'Dept_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('DEPT_EDIT','Edit Department',1,'Dept_Mod','ACTIVE','SEEDED');
INSERT INTO rights VALUES ('DEPT_DEL','Soft Delete Department',1,'Dept_Mod','ACTIVE','SEEDED');

-- ADMIN
INSERT INTO rights VALUES ('ADM_USER','Admin Activate User',1,'Adm_Mod','ACTIVE','SEEDED');