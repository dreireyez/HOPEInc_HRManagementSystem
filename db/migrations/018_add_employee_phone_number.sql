-- Add phone_number to employee and seed deterministic mock values.

alter table public.employee
add column if not exists phone_number text;

update public.employee
set phone_number = '+639' || lpad(
  ((abs(('x' || substr(md5(coalesce(empno, '') || coalesce(firstname, '') || coalesce(lastname, '')), 1, 8))::bit(32)::int) % 1000000000))::text,
  9,
  '0'
)
where (phone_number is null or btrim(phone_number) = '' or position('#' in phone_number) > 0)
  and (coalesce(firstname, '') <> '' or coalesce(lastname, '') <> '');
