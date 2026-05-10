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
