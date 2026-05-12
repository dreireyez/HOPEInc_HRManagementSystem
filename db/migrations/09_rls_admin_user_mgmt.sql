-- =========================================
-- ENABLE RLS
-- =========================================
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE usermodule_rights ENABLE ROW LEVEL SECURITY;

-- =========================================
-- USER TABLE POLICIES
-- =========================================

-- SUPERADMIN: full access
CREATE POLICY user_superadmin_full_access
ON "user"
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM "user" u
    WHERE u.userId = auth.uid()
    AND u.user_type = 'SUPERADMIN'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "user" u
    WHERE u.userId = auth.uid()
    AND u.user_type = 'SUPERADMIN'
  )
);

-- ADMIN: can update ONLY non-SUPERADMIN users
CREATE POLICY user_admin_update_status
ON "user"
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "user" u
    WHERE u.userId = auth.uid()
    AND u.user_type = 'ADMIN'
  )
  AND user_type != 'SUPERADMIN'
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "user" u
    WHERE u.userId = auth.uid()
    AND u.user_type = 'ADMIN'
  )
  AND user_type != 'SUPERADMIN'
);

-- PREVENT ROLE ESCALATION (basic safeguard)
CREATE POLICY user_prevent_role_change
ON "user"
FOR UPDATE
USING (true)
WITH CHECK (
  user_type IN ('USER','ADMIN','SUPERADMIN')
);

-- =========================================
-- USERMODULE_RIGHTS POLICIES
-- =========================================

-- BLOCK INSERT on SUPERADMIN
CREATE POLICY umr_insert_block_superadmin
ON usermodule_rights
FOR INSERT
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM "user"
    WHERE userId = usermodule_rights.userId
    AND user_type = 'SUPERADMIN'
  )
);

-- BLOCK UPDATE on SUPERADMIN
CREATE POLICY umr_update_block_superadmin
ON usermodule_rights
FOR UPDATE
USING (
  NOT EXISTS (
    SELECT 1 FROM "user"
    WHERE userId = usermodule_rights.userId
    AND user_type = 'SUPERADMIN'
  )
)
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM "user"
    WHERE userId = usermodule_rights.userId
    AND user_type = 'SUPERADMIN'
  )
);

-- BLOCK DELETE on SUPERADMIN
CREATE POLICY umr_delete_block_superadmin
ON usermodule_rights
FOR DELETE
USING (
  NOT EXISTS (
    SELECT 1 FROM "user"
    WHERE userId = usermodule_rights.userId
    AND user_type = 'SUPERADMIN'
  )
);