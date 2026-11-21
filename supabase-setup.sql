-- Run in Supabase SQL Editor. The publishable key is safe to use in frontend; NEVER use service_role/secret keys there.
-- First create an admin user in Authentication > Users, then replace YOUR_AUTH_USER_UUID below.
create table if not exists public.admin_users (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admin_users enable row level security;
create policy "admin sees self" on public.admin_users for select to authenticated using (user_id=auth.uid());
-- Replace with a real UUID from Authentication > Users (do not leave the placeholder).
-- insert into public.admin_users(user_id) values ('YOUR_AUTH_USER_UUID');

create table if not exists public.app_state (
 id text primary key,
 content jsonb not null default '{}'::jsonb
);
alter table public.app_state enable row level security;
create policy "everyone reads cards" on public.app_state for select to anon,authenticated using (true);
create policy "admins edit cards" on public.app_state for update to authenticated
 using (exists(select 1 from public.admin_users where user_id=auth.uid()))
 with check (exists(select 1 from public.admin_users where user_id=auth.uid()));
create policy "admins insert cards" on public.app_state for insert to authenticated
 with check (exists(select 1 from public.admin_users where user_id=auth.uid()));
-- Create the shared default data row. The website automatically shows starter cards if content is empty.
insert into public.app_state(id,content) values ('main','{}'::jsonb) on conflict(id) do nothing;

-- Bucket 'skin-pack' already exists. Public read is enabled through the bucket visibility.
create policy "only admins upload to skin-pack" on storage.objects
 for insert to authenticated
 with check (bucket_id='skin-pack' and exists(select 1 from public.admin_users where user_id=auth.uid()));
create policy "only admins replace skin-pack" on storage.objects
 for update to authenticated
 using (bucket_id='skin-pack' and exists(select 1 from public.admin_users where user_id=auth.uid()))
 with check (bucket_id='skin-pack' and exists(select 1 from public.admin_users where user_id=auth.uid()));
create policy "only admins delete from skin-pack" on storage.objects
 for delete to authenticated
 using (bucket_id='skin-pack' and exists(select 1 from public.admin_users where user_id=auth.uid()));
