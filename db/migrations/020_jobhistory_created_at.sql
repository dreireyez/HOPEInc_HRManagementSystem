-- =========================================
-- Add created_at to jobhistory and update employee_current_job tie-breaker
-- =========================================

alter table public.jobhistory
add column if not exists created_at timestamptz not null default now();

update public.jobhistory
set created_at = now()
where created_at is null;

create or replace view employee_current_job
  (empno, lastname, firstname, gender, hiredate, sepdate, jobcode, jobdesc, salary, deptcode, deptname, currenteffdate)
as
select
  e.empno,
  e.lastname,
  e.firstname,
  e.gender,
  e.hiredate,
  e.sepdate,
  jh.jobcode,
  j.jobdesc,
  jh.salary,
  jh.deptcode,
  d.deptname,
  jh.effdate as currenteffdate
from employee e
join jobhistory jh
  on e.empno = jh.empno
join job j
  on j.jobcode = jh.jobcode
join department d
  on d.deptcode = jh.deptcode
where e.record_status = 'ACTIVE'
  and jh.record_status = 'ACTIVE'
  and (jh.empno, jh.effdate, jh.created_at) = (
    select jh2.empno, jh2.effdate, jh2.created_at
    from jobhistory jh2
    where jh2.empno = e.empno
      and jh2.record_status = 'ACTIVE'
    order by jh2.effdate desc, jh2.created_at desc
    limit 1
  );
