alter table public.employee
add column if not exists email text;

alter table public.employee
add column if not exists phone_number text;

create or replace function public.create_employee_with_initial_assignment(
  p_empno varchar,
  p_firstname varchar,
  p_lastname varchar,
  p_gender char(1),
  p_jobcode varchar,
  p_deptcode varchar,
  p_effdate date,
  p_email text default null,
  p_phone_number text default null,
  p_hiredate date default null,
  p_birthdate date default null,
  p_salary numeric default null
)
returns table (
  empno varchar,
  firstname varchar,
  lastname varchar,
  gender char(1),
  email text,
  phone_number text,
  hiredate date,
  birthdate date,
  record_status varchar,
  stamp text
)
language plpgsql
security definer
set search_path to ''
as $$
declare
  v_stamp text;
begin
  if p_empno is null or btrim(p_empno) = '' then
    raise exception 'Employee number is required.';
  end if;

  if char_length(btrim(p_empno)) > 5 then
    raise exception 'Employee number must be 5 characters or fewer.';
  end if;

  if p_firstname is null or btrim(p_firstname) = '' then
    raise exception 'First name is required.';
  end if;

  if p_lastname is null or btrim(p_lastname) = '' then
    raise exception 'Last name is required.';
  end if;

  if p_jobcode is null or btrim(p_jobcode) = '' then
    raise exception 'Initial job is required.';
  end if;

  if p_deptcode is null or btrim(p_deptcode) = '' then
    raise exception 'Initial department is required.';
  end if;

  if p_effdate is null then
    raise exception 'Initial effective date is required.';
  end if;

  v_stamp := coalesce(private.current_pht_stamp(), to_char(timezone('Asia/Manila', now()), 'YYYY-MM-DD HH24:MI:SS') || ' PHT');

  insert into public.employee (
    empno,
    firstname,
    lastname,
    gender,
    email,
    phone_number,
    hiredate,
    birthdate,
    record_status,
    stamp
  )
  values (
    p_empno,
    p_firstname,
    p_lastname,
    p_gender,
    p_email,
    p_phone_number,
    p_hiredate,
    p_birthdate,
    'ACTIVE',
    v_stamp
  );

  insert into public.jobhistory (
    empno,
    jobcode,
    deptcode,
    effdate,
    salary,
    record_status
  )
  values (
    p_empno,
    p_jobcode,
    p_deptcode,
    p_effdate,
    p_salary,
    'ACTIVE'
  );

  return query
  select
    e.empno::varchar,
    e.firstname::varchar,
    e.lastname::varchar,
    e.gender::char(1),
    e.email::text,
    e.phone_number::text,
    e.hiredate::date,
    e.birthdate::date,
    e.record_status::varchar,
    e.stamp::text
  from public.employee e
  where e.empno = p_empno;
end;
$$;

revoke all on function public.create_employee_with_initial_assignment(varchar, varchar, varchar, char, varchar, varchar, date, text, text, date, date, numeric) from public, anon;
grant execute on function public.create_employee_with_initial_assignment(varchar, varchar, varchar, char, varchar, varchar, date, text, text, date, date, numeric) to authenticated;
