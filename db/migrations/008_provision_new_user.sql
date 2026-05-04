-- =========================================
-- MIGRATION: Automatic User Provisioning
-- =========================================
-- This migration creates a trigger that automatically provisions user records
-- when new auth.users entries are created (for both OAuth and manual signups).
-- Users are auto-provisioned with ACTIVE status and default module rights.

-- =========================================
-- FUNCTION: provision_new_user
-- =========================================
-- Automatically creates a user record and assigns default module rights
-- when a new entry is created in auth.users (on signup)
-- SECURITY DEFINER allows the function to run with elevated permissions
CREATE OR REPLACE FUNCTION public.provision_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- 1. Create user record in public."user" table
  INSERT INTO public."user" (userId, record_status, stamp)
  VALUES (NEW.id, 'ACTIVE', NOW()::TEXT)
  ON CONFLICT (userId) DO NOTHING;

  -- 2. Assign default module rights to new user
  -- Insert a default VIEW right for each module (if rights table exists)
  INSERT INTO public.UserModule_Rights (userId, right_id, right_value)
  SELECT NEW.id, right_id, 1
  FROM public.rights
  WHERE right_id IN ('EMP_VIEW', 'JOB_VIEW', 'DEPT_VIEW')
  ON CONFLICT (userId, right_id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail - allow signup to complete
  RAISE NOTICE 'Error in provision_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- =========================================
-- TRIGGER: trigger_auth_user_created
-- =========================================
-- Executes when new auth.users record is created during signup
DROP TRIGGER IF EXISTS trigger_auth_user_created ON auth.users;

CREATE TRIGGER trigger_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION provision_new_user();

-- =========================================
-- NOTE: This trigger fires after user registration (both OAuth and manual)
-- Users are immediately set to ACTIVE status.
-- Admins can later change status to INACTIVE if needed.
-- =========================================
