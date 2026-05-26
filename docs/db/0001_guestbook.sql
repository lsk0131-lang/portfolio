-- ============================================================================
-- 0001 — guestbook 테이블 + RLS 정책
-- 적용: Supabase Dashboard → SQL Editor 또는 psql 로 실행
-- ============================================================================

create extension if not exists pgcrypto;

create table if not exists public.guestbook (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(trim(name))     between 1 and 40),
  message    text not null check (char_length(trim(message))  between 1 and 1000),
  created_at timestamptz not null default now()
);

create index if not exists guestbook_created_at_idx
  on public.guestbook (created_at desc);

alter table public.guestbook enable row level security;

-- 누구나 글 읽기 가능
drop policy if exists "guestbook_select_public" on public.guestbook;
create policy "guestbook_select_public"
  on public.guestbook
  for select
  to anon, authenticated
  using (true);

-- 누구나 글 작성 가능 (수정/삭제는 정책 없음 → 차단)
drop policy if exists "guestbook_insert_public" on public.guestbook;
create policy "guestbook_insert_public"
  on public.guestbook
  for insert
  to anon, authenticated
  with check (
    char_length(trim(name))    between 1 and 40
    and char_length(trim(message)) between 1 and 1000
  );
