-- =========================================
-- MIGRATION 013: Idempotent rights backfill (safety re-run of 011)
-- =========================================
-- Re-asserts the canonical rights assignment for the three roles. Safe to
-- run repeatedly. Uses ON CONFLICT DO UPDATE so existing rows are corrected,
-- not just inserted.
--
-- Per spec:
--   SUPERADMIN -> all 19 rights = 1
--   ADMIN      -> VIEW + VIEW_ALL + ADD + EDIT + ADM_USER = 1, DEL = 0
--   USER       -> the four *_VIEW rights = 1, all others = 0
-- =========================================

-- SUPERADMIN
INSERT INTO UserModule_Rights (userId, right_id, right_value)
SELECT u.userId, r.right_id, 1
FROM "user" u
CROSS JOIN rights r
WHERE u.user_type = 'SUPERADMIN'
ON CONFLICT (userId, right_id) DO UPDATE SET right_value = 1;

-- ADMIN
INSERT INTO UserModule_Rights (userId, right_id, right_value)
SELECT u.userId, r.right_id,
  CASE
    WHEN r.right_id IN (
      'EMP_VIEW','EMP_VIEW_ALL','EMP_ADD','EMP_EDIT',
      'JH_VIEW','JH_ADD','JH_EDIT',
      'JOB_VIEW','JOB_ADD','JOB_EDIT',
      'DEPT_VIEW','DEPT_ADD','DEPT_EDIT',
      'ADM_USER'
    ) THEN 1
    ELSE 0
  END
FROM "user" u
CROSS JOIN rights r
WHERE u.user_type = 'ADMIN'
ON CONFLICT (userId, right_id) DO UPDATE SET right_value = EXCLUDED.right_value;

-- USER (HR Staff): all four *_VIEW rights ON, everything else OFF
INSERT INTO UserModule_Rights (userId, right_id, right_value)
SELECT u.userId, r.right_id,
  CASE WHEN r.right_id IN ('EMP_VIEW','JH_VIEW','JOB_VIEW','DEPT_VIEW') THEN 1 ELSE 0 END
FROM "user" u
CROSS JOIN rights r
WHERE u.user_type = 'USER'
ON CONFLICT (userId, right_id) DO UPDATE SET right_value = EXCLUDED.right_value;

-- Backstop: any null role becomes USER
UPDATE "user" SET user_type = 'USER' WHERE user_type IS NULL;
