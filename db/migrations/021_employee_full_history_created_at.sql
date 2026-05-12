-- =========================================
-- Update employee_full_history to include created_at
-- =========================================

create or replace view employee_full_history as
select
  e.empno,
  e.firstname,
  e.lastname,
  jh.effdate,
  jh.salary,
  jh.jobcode,
  j.jobdesc,
  jh.deptcode,
  d.deptname,
  jh.record_status,
  jh.stamp,
  jh.created_at
from jobhistory jh
join employee e
  on e.empno = jh.empno
left join job j
  on j.jobcode = jh.jobcode
left join department d
  on d.deptcode = jh.deptcode
where e.record_status = 'ACTIVE'
  and jh.record_status = 'ACTIVE'
order by e.empno, jh.effdate desc, jh.created_at desc;
