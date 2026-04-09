-- =========================================
-- ENABLE RLS
-- =========================================
ALTER TABLE job ENABLE ROW LEVEL SECURITY;
ALTER TABLE department ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobHistory ENABLE ROW LEVEL SECURITY;

-- =========================================
-- SELECT POLICY (COMMON LOGIC)
-- USER → ACTIVE only
-- ADMIN/SUPERADMIN → all
-- =========================================

-- JOB
CREATE POLICY job_select_policy
ON job
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "user" u
    WHERE u.userId = auth.uid()
    AND (
      u.user_type IN ('ADMIN','SUPERADMIN')
      OR (u.user_type = 'USER' AND job.record_status = 'ACTIVE')
    )
  )
);

-- DEPARTMENT
CREATE POLICY department_select_policy
ON department
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "user" u
    WHERE u.userId = auth.uid()
    AND (
      u.user_type IN ('ADMIN','SUPERADMIN')
      OR (u.user_type = 'USER' AND department.record_status = 'ACTIVE')
    )
  )
);

-- JOB HISTORY
CREATE POLICY jobhistory_select_policy
ON jobHistory
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "user" u
    WHERE u.userId = auth.uid()
    AND (
      u.user_type IN ('ADMIN','SUPERADMIN')
      OR (u.user_type = 'USER' AND jobHistory.record_status = 'ACTIVE')
    )
  )
);

-- =========================================
-- INSERT POLICIES
-- =========================================

-- JOB (JOB_ADD)
CREATE POLICY job_insert_policy
ON job
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM UserModule_Rights
    WHERE userId = auth.uid()
    AND right_id = 'JOB_ADD'
    AND right_value = 1
  )
);

-- DEPARTMENT (DEPT_ADD)
CREATE POLICY department_insert_policy
ON department
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM UserModule_Rights
    WHERE userId = auth.uid()
    AND right_id = 'DEPT_ADD'
    AND right_value = 1
  )
);

-- JOB HISTORY (JH_ADD)
CREATE POLICY jobhistory_insert_policy
ON jobHistory
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM UserModule_Rights
    WHERE userId = auth.uid()
    AND right_id = 'JH_ADD'
    AND right_value = 1
  )
);

-- =========================================
-- UPDATE (EDIT)
-- =========================================

-- JOB (JOB_EDIT)
CREATE POLICY job_update_edit_policy
ON job
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM UserModule_Rights
    WHERE userId = auth.uid()
    AND right_id = 'JOB_EDIT'
    AND right_value = 1
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM UserModule_Rights
    WHERE userId = auth.uid()
    AND right_id = 'JOB_EDIT'
    AND right_value = 1
  )
);

-- DEPARTMENT (DEPT_EDIT)
CREATE POLICY department_update_edit_policy
ON department
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM UserModule_Rights
    WHERE userId = auth.uid()
    AND right_id = 'DEPT_EDIT'
    AND right_value = 1
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM UserModule_Rights
    WHERE userId = auth.uid()
    AND right_id = 'DEPT_EDIT'
    AND right_value = 1
  )
);

-- JOB HISTORY (JH_EDIT)
CREATE POLICY jobhistory_update_edit_policy
ON jobHistory
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM UserModule_Rights
    WHERE userId = auth.uid()
    AND right_id = 'JH_EDIT'
    AND right_value = 1
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM UserModule_Rights
    WHERE userId = auth.uid()
    AND right_id = 'JH_EDIT'
    AND right_value = 1
  )
);

-- =========================================
-- UPDATE (DELETE / DEACTIVATE)
-- =========================================

-- JOB (JOB_DEL)
CREATE POLICY job_update_delete_policy
ON job
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM UserModule_Rights
    WHERE userId = auth.uid()
    AND right_id = 'JOB_DEL'
    AND right_value = 1
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM UserModule_Rights
    WHERE userId = auth.uid()
    AND right_id = 'JOB_DEL'
    AND right_value = 1
  )
);

-- DEPARTMENT (DEPT_DEL)
CREATE POLICY department_update_delete_policy
ON department
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM UserModule_Rights
    WHERE userId = auth.uid()
    AND right_id = 'DEPT_DEL'
    AND right_value = 1
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM UserModule_Rights
    WHERE userId = auth.uid()
    AND right_id = 'DEPT_DEL'
    AND right_value = 1
  )
);

-- JOB HISTORY (JH_DEL)
CREATE POLICY jobhistory_update_delete_policy
ON jobHistory
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM UserModule_Rights
    WHERE userId = auth.uid()
    AND right_id = 'JH_DEL'
    AND right_value = 1
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM UserModule_Rights
    WHERE userId = auth.uid()
    AND right_id = 'JH_DEL'
    AND right_value = 1
  )
);

-- =========================================
-- UPDATE (RECOVER)
-- ADMIN / SUPERADMIN ONLY
-- =========================================

-- JOB
CREATE POLICY job_update_recover_policy
ON job
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "user"
    WHERE userId = auth.uid()
    AND user_type IN ('ADMIN','SUPERADMIN')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "user"
    WHERE userId = auth.uid()
    AND user_type IN ('ADMIN','SUPERADMIN')
  )
);

-- DEPARTMENT
CREATE POLICY department_update_recover_policy
ON department
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "user"
    WHERE userId = auth.uid()
    AND user_type IN ('ADMIN','SUPERADMIN')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "user"
    WHERE userId = auth.uid()
    AND user_type IN ('ADMIN','SUPERADMIN')
  )
);

-- JOB HISTORY
CREATE POLICY jobhistory_update_recover_policy
ON jobHistory
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "user"
    WHERE userId = auth.uid()
    AND user_type IN ('ADMIN','SUPERADMIN')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "user"
    WHERE userId = auth.uid()
    AND user_type IN ('ADMIN','SUPERADMIN')
  )
);