# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

이슬기 (카카오 기업PR 리더) 의 개인 포트폴리오 웹사이트입니다. **Next.js 15 App Router + React 19 + TypeScript** 로 작성되어 있으며, 방명록 (Guestbook) 은 **Supabase** 에 저장됩니다.

PR 직군에 맞게 다음과 같이 구성되어 있습니다:
- **Career / Education** 섹션 (개발자 템플릿의 Projects 자리)
- **Skills** 는 기술 스택이 아닌 업무 역량 (언론홍보 / 위기관리 / 보도자료 / 온라인홍보)
- **Guestbook** — Supabase 로 익명 방명록 저장/조회
- **Contact** — 이메일 한 줄

## 저장소 구조

- `app/`
  - `layout.tsx` — 루트 레이아웃 (`<html>` / `<body>`, 사이트 헤더, 푸터, FOUC 방지 inline 스크립트)
  - `page.tsx` — 메인 페이지 (Hero / About / Skills / Career / Education / Guestbook / Contact 섹션)
  - `globals.css` — 디자인 토큰 및 모든 컴포넌트 스타일 (CSS 변수 기반)
  - `components/`
    - `SiteHeader.tsx` — 네비게이션, 햄버거 메뉴, 테마 토글 (client)
    - `ScrollReveal.tsx` — `.reveal` 요소 IntersectionObserver 페이드인 (client)
    - `Guestbook.tsx` — 방명록 리스트 (server, Supabase 조회)
    - `GuestbookForm.tsx` — 방명록 작성 폼 (client, Supabase insert)
- `utils/supabase/` — Supabase 클라이언트 헬퍼
  - `server.ts` — server component 용 (`cookies()` 사용)
  - `client.ts` — browser 용
  - `middleware.ts` — 세션 쿠키 갱신용
- `middleware.ts` — Next.js 루트 미들웨어 (세션 리프레시)
- `supabase/schema.sql` — `guestbook` 테이블 + RLS 정책. Supabase Dashboard 에서 1회 실행
- `.env.local.example` — 환경변수 템플릿
- `package.json`, `tsconfig.json`, `next.config.ts`

## 환경변수 설정

```bash
cp .env.local.example .env.local
# .env.local 에 Supabase URL 과 publishable (anon) key 채우기
```

값은 Supabase Dashboard → Project Settings → API 에서 확인할 수 있습니다. `.env.local` 은 `.gitignore` 에 포함되어 커밋되지 않습니다.

## 로컬 실행

```bash
npm install              # 최초 1회
npm run dev              # http://localhost:3000
```

## Supabase 초기 설정

1. Supabase 프로젝트 생성
2. Dashboard → SQL Editor 에서 [supabase/schema.sql](supabase/schema.sql) 실행 → `guestbook` 테이블 + RLS 정책 생성
3. `.env.local` 에 URL / publishable key 입력
4. `npm run dev` 으로 동작 확인 — 방명록 작성/조회가 됩니다

RLS 정책:
- **SELECT**: 누구나 가능
- **INSERT**: 누구나 가능 (이름 1~40자, 메시지 1~1000자 길이 제한)
- **UPDATE / DELETE**: 정책 없음 → 차단

## 빌드 / 배포

```bash
npm run build && npm run start
```

배포는 **Vercel** 권장 (Next.js 미들웨어/SSR 지원). 환경변수 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) 는 Vercel Project Settings 에서도 동일하게 설정해야 합니다.

> 정적 (GitHub Pages) 배포는 더 이상 지원되지 않습니다 — 미들웨어와 서버 컴포넌트가 Node 런타임을 요구합니다.

## 디자인 토큰

색상, 폰트, 간격 등 디자인 변수는 [app/globals.css](app/globals.css) 상단 `:root` 블록에 정의되어 있습니다. 테마를 조정하려면 해당 변수만 수정하면 됩니다.

## 콘텐츠 업데이트 가이드

모든 정적 콘텐츠는 [app/page.tsx](app/page.tsx) 에 있습니다.

- **Hero (이름·직무·태그라인)**: `<section id="hero">` 영역
  - 이름 뒤 "입니다." 처럼 톤을 다르게 붙이고 싶을 땐 `<span className="hero__name-suffix">…</span>` 으로 감싸면 위쪽 인사말과 동일한 muted 톤으로 표시됨
- **About (자기소개)**: `<section id="about">` 의 `<p>` 텍스트 수정 (문단 추가 시 `<p>` 한 번 더 사용)
- **Skills (업무 역량)**: `<section id="skills">` 의 `<li className="skill-tag">` 항목 추가/삭제
- **Career (경력)**: `<section id="career">` 의 `<li className="career__item">` 복제 후 `.career__period` / `.career__company` / `.career__role` 수정 — 최신순으로 위에서부터 나열
- **Education (학력)**: `<section id="education">` 의 `<li className="education__item">` 복제 후 `.education__period` / `.education__school` / `.education__degree` 수정 — 최신순으로 위에서부터 나열
- **Contact (연락처)**: `<section id="contact">` 의 `<ul className="contact-list">` 안 `<li>` 수정
- **Guestbook (방명록)**: 코드 수정 불필요 — Supabase 의 `guestbook` 테이블에 직접 쌓임
