# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

이슬기 (카카오 기업PR 리더) 의 개인 포트폴리오 웹사이트입니다. **Next.js 15 App Router + React 19 + TypeScript** 로 작성되어 있으며, **Career / Education / Guestbook** 콘텐츠는 모두 **Supabase** 에 저장됩니다.

PR 직군에 맞게 다음과 같이 구성되어 있습니다:
- **Career / Education** 섹션 (개발자 템플릿의 Projects 자리) — DB 기반
- **Skills** 는 기술 스택이 아닌 업무 역량 (언론홍보 / 위기관리 / 보도자료 / 온라인홍보)
- **Guestbook** — Supabase 로 익명 방명록 저장/조회
- **Contact** — 이메일 한 줄

## 저장소 구조

- `app/`
  - `layout.tsx` — 루트 레이아웃 (`<html>` / `<body>`, 사이트 헤더, 푸터, FOUC 방지 inline 스크립트, admin 상태 SSR fetch)
  - `page.tsx` — 메인 페이지 (Hero / About / Skills / Career / Education / Guestbook / Contact 섹션)
  - `globals.css` — 디자인 토큰 및 모든 컴포넌트 스타일 (CSS 변수 기반)
  - `components/`
    - `SiteHeader.tsx` — 네비게이션, 햄버거 메뉴, 테마 토글, 로그인/로그아웃 (client, isAdmin/email prop 으로 분기)
    - `SectionHeader.tsx` — 섹션 타이틀 + 관리자용 "추가" 버튼 (server)
    - `ScrollReveal.tsx` — `.reveal` 요소 IntersectionObserver 페이드인 (client)
    - `Career.tsx` / `Education.tsx` — 경력/학력 리스트 + 관리자용 수정/삭제 버튼 (server)
    - `DeleteEntryButton.tsx` — career/education 삭제 (client, confirm + server action)
    - `Guestbook.tsx` — 방명록 리스트 (server, Supabase 조회)
    - `GuestbookForm.tsx` — 방명록 작성 폼 (client, Supabase insert)
  - `login/` — `/login` (server page + client form)
  - `auth/callback/route.ts` — 매직 링크 콜백 (`code → session` 교환)
  - `auth/signout/route.ts` — POST 시 세션 종료
  - `admin/` — 관리자 보호 영역 (`layout.tsx` 에서 비관리자 차단)
    - `page.tsx` — 대시보드
    - `actions.ts` — career/education CRUD 서버 액션 (`createEntry`, `updateEntry`, `deleteEntry`)
    - `EntityForm.tsx` — 추가/수정 공용 폼 (client, server action 호출)
    - `career/new/`, `career/[id]/edit/`, `education/new/`, `education/[id]/edit/` — 각 폼 페이지
- `utils/`
  - `supabase/server.ts` / `client.ts` / `middleware.ts` — Supabase 클라이언트 헬퍼
  - `admin.ts` — `getAdminStatus()` (현재 사용자 이메일과 `public.admins` 매칭 여부 판정)
- `middleware.ts` — Next.js 루트 미들웨어 (세션 리프레시)
- `docs/db/` — **DB 스키마/마이그레이션 단일 진실 공급원 (Single Source of Truth)**
  - `erd.md` — Mermaid ERD + 테이블 설명
  - `0001_guestbook.sql`, `0002_career_education.sql`, `0003_admin_auth.sql` — 적용 순서대로 정렬된 마이그레이션 파일
- `.env.local.example` — 환경변수 템플릿
- `package.json`, `tsconfig.json`, `next.config.ts`

## DB 작업 워크플로우 (🚨 중요)

이 프로젝트의 **DB 스키마 정보는 항상 [docs/db/](docs/db/) 에서 시작**합니다. 새 테이블 추가, 컬럼 변경, RLS 정책 수정 등 모든 DB 작업은 다음 순서를 따릅니다.

1. **현황 파악**: [docs/db/erd.md](docs/db/erd.md) 의 Mermaid ERD 와 각 테이블 설명을 먼저 읽어 현재 스키마를 이해합니다. SQL 파일을 직접 보고 싶으면 `docs/db/` 안의 번호순 SQL 을 참고합니다.
2. **변경 설계**: ERD 의 표시 형식 규칙 / RLS 정책 패턴 (SELECT public, 쓰기는 정책 없음 = 차단) 을 따릅니다. 예외가 필요하면 명시적으로 이유를 남깁니다.
3. **마이그레이션 작성**: 다음 번호의 `NNNN_<설명>.sql` 파일을 `docs/db/` 에 추가합니다. 기존 파일은 절대 수정하지 않습니다 (이미 적용된 이력). 멱등성을 위해 `create … if not exists`, `drop policy if exists` 등을 사용합니다.
4. **ERD 갱신**: 같은 PR 에서 [docs/db/erd.md](docs/db/erd.md) 도 함께 업데이트 — Mermaid 블록 + 테이블별 설명 + 마이그레이션 파일 링크.
5. **적용**: psql 또는 Supabase Dashboard → SQL Editor 로 새 SQL 파일 실행.
   ```bash
   PGPASSWORD='<DB비밀번호>' /opt/homebrew/opt/libpq/bin/psql \
     -h aws-1-ap-northeast-2.pooler.supabase.com -p 6543 \
     -U postgres.<project-ref> -d postgres \
     -v ON_ERROR_STOP=1 -f docs/db/NNNN_<설명>.sql
   ```
6. **컴포넌트 연결**: 새 테이블을 UI 에 노출할 때는 `app/components/` 에 server component 를 만들고 [utils/supabase/server.ts](utils/supabase/server.ts) 의 `createClient` 로 조회합니다. 실패 시 graceful 처리 (Career.tsx / Education.tsx / Guestbook.tsx 패턴 참고).

> 절대 ad-hoc 으로 Supabase Studio 만 사용해서 스키마를 바꾸지 마세요 — `docs/db/` 와 실제 DB 가 불일치하면 다른 환경 (Vercel preview, 다른 머신) 에서 재현 불가합니다.

## 인증 / 관리자 권한

이 사이트는 **Supabase Auth 의 이메일 매직 링크** 로 관리자만 로그인합니다. 일반 방문자는 로그인 없이 모든 콘텐츠를 읽을 수 있고, **관리자만** `/admin` 진입과 career/education 의 추가·수정·삭제가 가능합니다.

**계층 구조**

1. `public.admins` 테이블에 등록된 이메일이 관리자입니다.
2. Supabase Auth 로 그 이메일로 로그인하면 `public.is_admin()` 이 `true` 가 되어 RLS 정책이 쓰기를 허용합니다.
3. Next.js 측에서는 [utils/admin.ts](utils/admin.ts) 의 `getAdminStatus()` 가 세션 user → admins 조회 → `{ isAdmin, email }` 을 반환. 이 값이 [app/admin/layout.tsx](app/admin/layout.tsx) 의 보호 게이트와 공개 사이트의 컨트롤 노출 여부를 결정합니다.

**로그인 흐름**

1. `/login` → 이메일 입력 → `supabase.auth.signInWithOtp({ email, emailRedirectTo: <origin>/auth/callback?next=/admin })`
2. 받은 메일의 매직 링크 클릭 → `/auth/callback?code=...` → `exchangeCodeForSession(code)` → `/admin` 으로 리다이렉트
3. 관리자가 아닌 이메일로 로그인하면 `/login?error=not-admin` 으로 돌아옴
4. 로그아웃: 사이트 헤더의 "로그아웃" 또는 `/auth/signout` 으로 POST

**🚨 Supabase Dashboard 설정 (수동, 1회)**

이 흐름이 동작하려면 Supabase Dashboard 의 **Authentication → URL Configuration** 에서 아래 URL 들을 **Redirect URLs** 에 추가해야 합니다.

- 로컬 개발 (현재 포트 8080): `http://localhost:8080/**`
- 배포 환경 URL: `https://<your-vercel-domain>/**`

추가하지 않으면 매직 링크 클릭 시 Supabase 가 redirect 를 거부합니다.

**관리자 추가/제거**

새 관리자는 `public.admins` 에 한 줄 추가하면 됩니다 (Supabase Studio 또는 새 마이그레이션). 코드 변경 불필요.

## 환경변수 설정

```bash
cp .env.local.example .env.local
# .env.local 에 Supabase URL 과 publishable (anon) key 채우기
```

값은 Supabase Dashboard → Project Settings → API 에서 확인할 수 있습니다. `.env.local` 은 `.gitignore` 에 포함되어 커밋되지 않습니다.

## 로컬 실행

```bash
npm install              # 최초 1회
npm run dev              # 기본 http://localhost:3000, 포트 변경: npm run dev -- -p 8080
```

## Supabase 초기 설정 (신규 환경)

1. Supabase 프로젝트 생성
2. `docs/db/` 의 `0001_*.sql`, `0002_*.sql` … 을 **번호순으로 모두 실행** (Dashboard → SQL Editor 또는 psql)
3. `.env.local` 에 URL / publishable key 입력
4. `npm run dev` 으로 동작 확인

## 빌드 / 배포

```bash
npm run build && npm run start
```

배포는 **Vercel** 권장 (Next.js 미들웨어/SSR 지원). 환경변수 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) 는 Vercel Project Settings 에서도 동일하게 설정해야 합니다.

> 정적 (GitHub Pages) 배포는 더 이상 지원되지 않습니다 — 미들웨어와 서버 컴포넌트가 Node 런타임을 요구합니다.

## 디자인 토큰

색상, 폰트, 간격 등 디자인 변수는 [app/globals.css](app/globals.css) 상단 `:root` 블록에 정의되어 있습니다. 테마를 조정하려면 해당 변수만 수정하면 됩니다.

## 콘텐츠 업데이트 가이드

콘텐츠는 두 곳에 나뉩니다.

**(A) 정적 콘텐츠 — [app/page.tsx](app/page.tsx) 직접 편집**
- **Hero (이름·직무·태그라인)**: `<section id="hero">` 영역
  - 이름 뒤 "입니다." 처럼 톤을 다르게 붙이고 싶을 땐 `<span className="hero__name-suffix">…</span>` 으로 감싸면 위쪽 인사말과 동일한 muted 톤으로 표시됨
- **About (자기소개)**: `<section id="about">` 의 `<p>` 텍스트 수정 (문단 추가 시 `<p>` 한 번 더 사용)
- **Skills (업무 역량)**: `<section id="skills">` 의 `<li className="skill-tag">` 항목 추가/삭제
- **Contact (연락처)**: `<section id="contact">` 의 `<ul className="contact-list">` 안 `<li>` 수정

**(B) DB 콘텐츠 — `/admin` UI 또는 Supabase Studio 로 편집**
- **Career (경력)**: `public.career` 테이블. `started_on` 필수, `ended_on` NULL = 현재.
- **Education (학력)**: `public.education` 테이블. `started_on` 필수, `ended_on` NULL = 재학중. 일=01 권장.
- **Guestbook (방명록)**: `public.guestbook`. 사용자가 사이트 폼에서 직접 작성.

관리자로 로그인하면 공개 사이트의 Career/Education 섹션에서 직접 "+ 추가" / "수정" / "삭제" 버튼을 사용할 수 있습니다 — `/admin` 대시보드 또는 항목별 인라인 버튼 양쪽 다 가능. 일반 방문자에게는 버튼이 보이지 않습니다.

DB 콘텐츠의 **컬럼/제약/RLS** 를 바꾸려면 위 **DB 작업 워크플로우** 를 따라 새 마이그레이션을 추가하세요.
