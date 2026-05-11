create schema if not exists private;

create or replace function private.is_admin_actor()
returns boolean
language sql
security definer
set search_path to ''
as $$
  select exists (
    select 1
    from public."user" actor
    where actor.userid = (select auth.uid())::text
      and actor.user_type in ('ADMIN', 'SUPERADMIN')
      and actor.record_status = 'ACTIVE'
  );
$$;

revoke all on function private.is_admin_actor() from public, anon, authenticated;

create or replace function public.admin_list_users()
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
  if not private.is_admin_actor() then
    raise exception 'Only ADMIN and SUPERADMIN can view user management.';
  end if;

  return query
  select
    u.userid,
    u.username,
    u.email,
    u.user_type,
    u.record_status,
    u.stamp
  from public."user" u
  order by
    case u.record_status when 'INACTIVE' then 0 else 1 end,
    case u.user_type when 'SUPERADMIN' then 0 when 'ADMIN' then 1 else 2 end,
    u.username nulls last,
    u.email nulls last;
end;
$$;

revoke all on function public.admin_list_users() from public, anon;
grant execute on function public.admin_list_users() to authenticated;

create or replace function public.admin_list_activity_logs()
returns table (
  id bigint,
  created_at timestamptz,
  actor_user_id text,
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
    log.actor_role,
    log.entity_type,
    log.entity_id,
    log.action_type,
    log.summary,
    log.metadata
  from public.activity_logs log
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
  actor_role_value varchar;
  action_type_value varchar;
  stamp_value text;
begin
  if not private.is_admin_actor() then
    raise exception 'Only ADMIN and SUPERADMIN can modify users.';
  end if;

  if target_status not in ('ACTIVE', 'INACTIVE') then
    raise exception 'Invalid target status: %', target_status;
  end if;

  if exists (
    select 1
    from public."user" u
    where u.userid = target_user_id
      and u.user_type = 'SUPERADMIN'
  ) then
    raise exception 'SUPERADMIN accounts cannot be modified';
  end if;

  actor_role_value := private.current_actor_role();
  action_type_value := case when target_status = 'ACTIVE' then 'ACTIVATE_USER' else 'DEACTIVATE_USER' end;
  stamp_value := to_char(now(), 'YYYY-MM-DD HH24:MI:SS');

  perform private.insert_activity_log(
    'USER',
    target_user_id,
    action_type_value,
    'USER ' || action_type_value || ' ' || target_user_id,
    jsonb_build_object('target_status', target_status)
  );

  return query
  update public."user" u
  set
    record_status = target_status,
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

revoke all on function public.admin_set_user_status(text, varchar) from public, anon;
grant execute on function public.admin_set_user_status(text, varchar) to authenticated;
