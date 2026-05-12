-- Backfill mock employee emails using firstname+lastname@hope.com.
-- Normalization: lowercase, remove non-letters.

update public.employee
set email = lower(regexp_replace(coalesce(firstname, '') || coalesce(lastname, ''), '[^A-Za-z]', '', 'g')) || '@hope.com'
where (email is null or btrim(email) = '')
  and (coalesce(firstname, '') <> '' or coalesce(lastname, '') <> '');
