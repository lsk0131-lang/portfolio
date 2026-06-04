-- ============================================================================
-- 0003 — Supabase Auth 기반 관리자 권한 + career / education 쓰기 RLS 정책
-- 적용: Supabase Dashboard → SQL Editor 또는 psql 로 실행
-- 의존: 0001_guestbook.sql, 0002_career_education.sql
-- ============================================================================

-- ============================================================================
-- admins: 관리자 이메일 화이트리스트
-- ============================================================================
create table if not exists public.admins (
  email      text primary key,
  note       text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- 로그인한 사용자가 자기 자신이 관리자인지만 확인할 수 있도록 허용
drop policy if exists "admins_select_self" on public.admins;
create policy "admins_select_self"
  on public.admins
  for select
  to authenticated
  using (email = (auth.jwt() ->> 'email'));

-- ============================================================================
-- is_admin(): JWT 의 email 이 admins 테이블에 있는지 확인
-- security definer 로 admins RLS 우회 (함수 안에서만)
-- ============================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins
    where email = (auth.jwt() ->> 'email')
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ============================================================================
-- career 쓰기 정책 (관리자만)
-- ============================================================================
drop policy if exists "career_insert_admin" on public.career;
create policy "career_insert_admin"
  on public.career
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "career_update_admin" on public.career;
create policy "career_update_admin"
  on public.career
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "career_delete_admin" on public.career;
create policy "career_delete_admin"
  on public.career
  for delete
  to authenticated
  using (public.is_admin());

-- ============================================================================
-- education 쓰기 정책 (관리자만)
-- ============================================================================
drop policy if exists "education_insert_admin" on public.education;
create policy "education_insert_admin"
  on public.education
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "education_update_admin" on public.education;
create policy "education_update_admin"
  on public.education
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "education_delete_admin" on public.education;
create policy "education_delete_admin"
  on public.education
  for delete
  to authenticated
  using (public.is_admin());

-- ============================================================================
-- 시드: 사이트 소유자 (lsk0131@gmail.com)
-- ============================================================================
insert into public.admins (email, note) values
  ('lsk0131@gmail.com', 'site owner')
on conflict (email) do nothing;
