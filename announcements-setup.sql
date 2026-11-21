-- Run ONCE in your existing Supabase SQL Editor.
-- Uses the existing public.admin_users table with your admin UID.
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(title) between 1 and 100),
  message text not null check (length(message) between 1 and 1000),
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.announcements enable row level security;
grant select on public.announcements to anon, authenticated;
grant insert, delete on public.announcements to authenticated;
-- Idempotent: safe to rerun, without modifying existing announcements.
drop policy if exists "public reads published announcements" on public.announcements;
create policy "public reads published announcements" on public.announcements
 for select to anon, authenticated using (published = true);
drop policy if exists "admins create announcements" on public.announcements;
create policy "admins create announcements" on public.announcements
 for insert to authenticated with check (
   exists(select 1 from public.admin_users where user_id = (select auth.uid()))
 );
drop policy if exists "admins delete announcements" on public.announcements;
create policy "admins delete announcements" on public.announcements
 for delete to authenticated using (
   exists(select 1 from public.admin_users where user_id = (select auth.uid()))
 );
