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
      when target_role = 'ADMIN' then 1
      else 0
    end
  where umr.user_id = target_user_id
    and umr.right_id = 'ADM_USER';

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
