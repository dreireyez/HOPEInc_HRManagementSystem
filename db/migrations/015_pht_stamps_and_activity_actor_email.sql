create or replace function private.current_pht_stamp()
returns text
language sql
security definer
set search_path to ''
as $$
  select to_char(timezone('Asia/Manila', now()), 'YYYY-MM-DD HH24:MI:SS') || ' PHT';
$$;

revoke all on function private.current_pht_stamp() from public, anon, authenticated;

drop function if exists public.admin_list_activity_logs();

create or replace function public.admin_list_activity_logs()
returns table (
  id bigint,
  created_at timestamptz,
  actor_user_id text,
  actor_email varchar,
  actor_role varchar,
  entity_type varchar,
  entity_id text,
  action_type varchar,
  summary text,
  metadata jsonb
)
language plpgsql
security definer
set search_path to ''
as $$
begin
  if not private.is_admin_actor() then
    raise exception 'Only ADMIN and SUPERADMIN can view activity logs.';
  end if;

  return query
  select
    log.id,
    log.created_at,
    log.actor_user_id,
    actor.email as actor_email,
    log.actor_role,
    log.entity_type,
    log.entity_id,
    log.action_type,
    log.summary,
    log.metadata
  from public.activity_logs log
  left join public."user" actor
    on actor.userid = log.actor_user_id
  order by log.created_at desc, log.id desc;
end;
$$;

revoke all on function public.admin_list_activity_logs() from public, anon;
grant execute on function public.admin_list_activity_logs() to authenticated;

create or replace function public.admin_set_user_status(target_user_id text, target_status varchar)
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
  actor_id text;
  actor_role varchar;
begin
  if not private.is_admin_actor() then
    raise exception 'Only ADMIN and SUPERADMIN can modify users.';
  end if;

  if target_status not in ('ACTIVE', 'INACTIVE') then
    raise exception 'Invalid target status: %', target_status;
  end if;

  actor_id := (select auth.uid())::text;

  select u.user_type
  into actor_role
  from public."user" u
  where u.userid = actor_id;

  if exists (
    select 1
    from public."user" u
    where u.userid = target_user_id
      and u.user_type = 'SUPERADMIN'
  ) then
    raise exception 'SUPERADMIN accounts cannot be modified';
  end if;

  if actor_role = 'ADMIN' then
    if actor_id = target_user_id then
      raise exception 'ADMIN cannot modify their own account status';
    end if;

    if exists (
      select 1
      from public."user" u
      where u.userid = target_user_id
        and u.user_type <> 'USER'
    ) then
      raise exception 'ADMIN can only modify USER account status';
    end if;
  end if;

  perform private.insert_activity_log(
    'USER',
    target_user_id,
    case when target_status = 'ACTIVE' then 'ACTIVATE_USER' else 'DEACTIVATE_USER' end,
    'USER ' || case when target_status = 'ACTIVE' then 'ACTIVATE_USER' else 'DEACTIVATE_USER' end || ' ' || target_user_id,
    jsonb_build_object('target_status', target_status)
  );

  return query
  update public."user" u
  set
    record_status = target_status,
    stamp = private.current_pht_stamp()
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

revoke all on function public.admin_set_user_status(text, varchar) from public, anon;
grant execute on function public.admin_set_user_status(text, varchar) to authenticated;

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
    stamp = private.current_pht_stamp()
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

revoke all on function public.admin_set_user_role(text, varchar) from public, anon;
grant execute on function public.admin_set_user_role(text, varchar) to authenticated;

create or replace function public.log_hr_activity()
returns trigger
language plpgsql
security definer
set search_path to ''
as $$
declare
  entity_type_value varchar(30);
  entity_id_value text;
  action_value varchar(30);
  old_status_value text;
  new_status_value text;
begin
  old_status_value := case when TG_OP = 'INSERT' then null else OLD.record_status end;
  new_status_value := NEW.record_status;
  entity_type_value := case TG_TABLE_NAME
    when 'employee' then 'EMPLOYEE'
    when 'job' then 'JOB'
    when 'department' then 'DEPARTMENT'
    when 'jobhistory' then 'JOB_HISTORY'
    else upper(TG_TABLE_NAME)
  end;

  if TG_TABLE_NAME = 'employee' then
    entity_id_value := coalesce(NEW.empno, OLD.empno)::text;
  elsif TG_TABLE_NAME = 'job' then
    entity_id_value := coalesce(NEW.jobcode, OLD.jobcode)::text;
  elsif TG_TABLE_NAME = 'department' then
    entity_id_value := coalesce(NEW.deptcode, OLD.deptcode)::text;
  elsif TG_TABLE_NAME = 'jobhistory' then
    entity_id_value := concat_ws(':', coalesce(NEW.empno, OLD.empno), coalesce(NEW.jobcode, OLD.jobcode), coalesce(NEW.effdate, OLD.effdate));
  else
    entity_id_value := 'UNKNOWN';
  end if;

  if TG_OP = 'INSERT' then
    action_value := 'ADD';
  elsif coalesce(old_status_value, 'ACTIVE') <> 'INACTIVE' and new_status_value = 'INACTIVE' then
    action_value := 'DEACTIVATE';
  elsif old_status_value = 'INACTIVE' and new_status_value = 'ACTIVE' then
    action_value := 'RECOVER';
  else
    action_value := 'EDIT';
  end if;

  NEW.stamp := private.current_pht_stamp();

  perform private.insert_activity_log(
    entity_type_value,
    entity_id_value,
    action_value,
    entity_type_value || ' ' || action_value || ' ' || entity_id_value,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'old_record_status', old_status_value,
      'new_record_status', new_status_value
    )
  );

  return NEW;
end;
$$;
