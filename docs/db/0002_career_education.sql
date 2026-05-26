-- ============================================================================
-- 0002 — career / education 테이블 + RLS 정책 + 시드 데이터
-- 적용: Supabase Dashboard → SQL Editor 또는 psql 로 실행
-- 의존: 0001_guestbook.sql (pgcrypto 확장)
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================================================================
-- career
-- ============================================================================
create table if not exists public.career (
  id         uuid primary key default gen_random_uuid(),
  company    text not null check (char_length(trim(company)) between 1 and 100),
  role       text not null check (char_length(trim(role))    between 1 and 100),
  started_on date not null,
  ended_on   date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint career_period_valid check (ended_on is null or ended_on >= started_on)
);

create index if not exists career_started_on_idx
  on public.career (started_on desc);

alter table public.career enable row level security;

drop policy if exists "career_select_public" on public.career;
create policy "career_select_public"
  on public.career
  for select
  to anon, authenticated
  using (true);
-- insert / update / delete: 정책 없음 → 차단 (Supabase Studio 또는 service_role 로만 편집)

-- ============================================================================
-- education
-- ============================================================================
create table if not exists public.education (
  id         uuid primary key default gen_random_uuid(),
  school     text not null check (char_length(trim(school)) between 1 and 100),
  degree     text not null check (char_length(trim(degree)) between 1 and 100),
  started_on date not null,
  ended_on   date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint education_period_valid check (ended_on is null or ended_on >= started_on)
);

create index if not exists education_started_on_idx
  on public.education (started_on desc);

alter table public.education enable row level security;

drop policy if exists "education_select_public" on public.education;
create policy "education_select_public"
  on public.education
  for select
  to anon, authenticated
  using (true);
-- insert / update / delete: 정책 없음 → 차단

-- ============================================================================
-- updated_at 자동 갱신 트리거
-- ============================================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists career_touch_updated_at on public.career;
create trigger career_touch_updated_at
  before update on public.career
  for each row execute function public.touch_updated_at();

drop trigger if exists education_touch_updated_at on public.education;
create trigger education_touch_updated_at
  before update on public.education
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- 시드 데이터 (현재 사이트에 노출되어 있던 내용을 동일하게 이관)
-- ON CONFLICT 처리가 없으므로, 재실행 시 중복 방지를 위해 먼저 비움
-- ============================================================================
truncate table public.career, public.education;

insert into public.career (company, role, started_on, ended_on) values
  ('카카오',          '기업PR 리더',                 date '2008-10-01', null),
  ('다음커뮤니케이션', '기업커뮤니케이션팀 매니저',     date '2006-02-01', date '2008-03-31');

insert into public.education (school, degree, started_on, ended_on) values
  ('연세대학교 언론홍보대학원', '광고PR · 석사',  date '2024-03-01', date '2026-08-31'),
  ('덕성여자대학교',           '스페인어과 · 학사', date '2001-03-01', date '2006-02-28');
