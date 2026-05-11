create or replace function public.admin_set_user_role(target_user_id text, target_role varchar)
returns table (
  userid text,
  username varchar,
  email varchar,
  user_type varchar,
  record_status varchar,
  stamp varchar
)
language plpgsql
security definer
set search_path to ''
as $$
declare
  stamp_value text;
begin
  if not private.is_superadmin_actor() then
    raise exception 'Only SUPERADMIN can change user roles.';
  end if;

  if target_role not in ('ADMIN', 'USER') then
    raise exception 'Invalid target role: %', target_role;
  end if;

  if exists (
    select 1
    from public."user" u
    where u.userid = target_user_id
      and u.user_type = 'SUPERADMIN'
  ) then
    raise exception 'SUPERADMIN accounts cannot be modified';
  end if;

  if exists (
    select 1
    from public."user" u
    where u.userid = target_user_id
      and u.record_status <> 'ACTIVE'
  ) then
    raise exception 'Only ACTIVE users can have roles changed';
  end if;

  update public.usermodule_rights umr
  set right_value =
    case
      when target_role = 'ADMIN' and umr.right_id in (
        'EMP_VIEW',
        'EMP_VIEW_ALL',
        'EMP_ADD',
        'EMP_EDIT',
        'JH_VIEW',
        'JH_ADD',
        'JH_EDIT',
        'JOB_VIEW',
        'JOB_ADD',
        'JOB_EDIT',
        'DEPT_VIEW',
        'DEPT_ADD',
        'DEPT_EDIT',
        'ADM_USER',
        'SYS_INTEGRITY'
      ) then 1
      when target_role = 'USER' and umr.right_id in (
        'EMP_VIEW',
        'JH_VIEW',
        'JOB_VIEW',
        'DEPT_VIEW'
      ) then 1
      else 0
    end
  where umr.user_id = target_user_id;

  stamp_value := to_char(now(), 'YYYY-MM-DD HH24:MI:SS');

  perform private.insert_activity_log(
    'USER',
    target_user_id,
    'ROLE_CHANGE',
    'USER ROLE_CHANGE ' || target_user_id || ' -> ' || target_role,
    jsonb_build_object('target_role', target_role)
  );

  return query
  update public."user" u
  set
    user_type = target_role,
    stamp = stamp_value
  where u.userid = target_user_id
  returning
    u.userid,
    u.username,
    u.email,
    u.user_type,
    u.record_status,
    u.stamp;
end;
$$;
