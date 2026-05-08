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

  return query
  update public."user" u
  set
    record_status = target_status,
    stamp = 'ADMIN-STATUS ' || target_status || ' ' || now()::text
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
