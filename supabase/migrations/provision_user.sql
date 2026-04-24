-- 1. Create the function that handles the provisioning
CREATE OR REPLACE FUNCTION public.provision_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into the 'user' table (M4 Requirement: creates USER/INACTIVE row)
  INSERT INTO public.user (userid, record_status, user_type)
  VALUES (new.id, 'INACTIVE', 'USER');

  -- Insert default rights (M4 Requirement: 17 rights rows, VIEW only = 1, others = 0)
  -- Example for Employee Module
  INSERT INTO public.user_module_rights (userid, module_name, right_code, is_allowed)
  VALUES 
    (new.id, 'Employees', 'EMP_VIEW', true),
    (new.id, 'Employees', 'EMP_ADD', false),
    (new.id, 'Employees', 'EMP_EDIT', false),
    (new.id, 'Employees', 'EMP_DEL', false),
    
    (new.id, 'Job History', 'JH_VIEW', true),
    (new.id, 'Job History', 'JH_ADD', false),
    (new.id, 'Job History', 'JH_EDIT', false),
    (new.id, 'Job History', 'JH_DEL', false),

    (new.id, 'Jobs', 'JOB_VIEW', true),
    (new.id, 'Jobs', 'JOB_ADD', false),
    (new.id, 'Jobs', 'JOB_EDIT', false),
    (new.id, 'Jobs', 'JOB_DEL', false),

    (new.id, 'Departments', 'DEPT_VIEW', true),
    (new.id, 'Departments', 'DEPT_ADD', false),
    (new.id, 'Departments', 'DEPT_EDIT', false),
    (new.id, 'Departments', 'DEPT_DEL', false),

    (new.id, 'Admin', 'ADM_VIEW', false);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger that fires on auth.users INSERT
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.provision_new_user();