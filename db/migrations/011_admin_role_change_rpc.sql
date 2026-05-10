create or replace function private.is_superadmin_actor()
returns boolean
language sql
security definer
set search_path to ''
as $$
  select exists (
    select 1
    from public."user" actor
    where actor.userid = (select auth.uid())::text
      and actor.user_type = 'SUPERADMIN'
      and actor.record_status = 'ACTIVE'
  );
$$;

revoke all on function private.is_superadmin_actor() from public, anon, authenticated;

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

  return query
  update public."user" u
  set
    user_type = target_role,
    stamp = 'SUPERADMIN-ROLE ' || target_role || ' ' || now()::text
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
