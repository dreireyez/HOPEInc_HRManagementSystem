-- =========================================
-- ENABLE RLS
-- =========================================
ALTER TABLE employee ENABLE ROW LEVEL SECURITY;

-- =========================================
-- SELECT POLICY
-- USER → only ACTIVE
-- ADMIN/SUPERADMIN → all
-- =========================================
CREATE POLICY employee_select_policy
ON employee
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM "user" u
    WHERE u.userId = auth.uid()
    AND (
      u.user_type IN ('ADMIN', 'SUPERADMIN')
      OR (u.user_type = 'USER' AND employee.record_status = 'ACTIVE')
    )
  )
);

-- =========================================
-- INSERT POLICY (EMP_ADD)
-- =========================================
CREATE POLICY employee_insert_policy
ON employee
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM UserModule_Rights umr
    WHERE umr.userId = auth.uid()
    AND umr.right_id = 'EMP_ADD'
    AND umr.right_value = 1
  )
);

-- =========================================
-- UPDATE POLICY (EMP_EDIT)
-- =========================================
CREATE POLICY employee_update_edit_policy
ON employee
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM UserModule_Rights umr
    WHERE umr.userId = auth.uid()
    AND umr.right_id = 'EMP_EDIT'
    AND umr.right_value = 1
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM UserModule_Rights umr
    WHERE umr.userId = auth.uid()
    AND umr.right_id = 'EMP_EDIT'
    AND umr.right_value = 1
  )
);

-- =========================================
-- UPDATE POLICY (EMP_DEL → deactivate)
-- =========================================
CREATE POLICY employee_update_deactivate_policy
ON employee
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM UserModule_Rights umr
    WHERE umr.userId = auth.uid()
    AND umr.right_id = 'EMP_DEL'
    AND umr.right_value = 1
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM UserModule_Rights umr
    WHERE umr.userId = auth.uid()
    AND umr.right_id = 'EMP_DEL'
    AND umr.right_value = 1
  )
);

-- =========================================
-- UPDATE POLICY (RECOVER → ADMIN/SUPERADMIN only)
-- =========================================
CREATE POLICY employee_update_recover_policy
ON employee
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM "user" u
    WHERE u.userId = auth.uid()
    AND u.user_type IN ('ADMIN', 'SUPERADMIN')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM "user" u
    WHERE u.userId = auth.uid()
    AND u.user_type IN ('ADMIN', 'SUPERADMIN')
  )
);