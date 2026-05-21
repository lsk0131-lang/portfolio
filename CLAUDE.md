# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

이슬기 (카카오 기업PR 리더) 의 개인 포트폴리오 웹사이트입니다. 순수 HTML/CSS/JavaScript로 작성된 정적 단일 페이지이며, 빌드 시스템 없이 그대로 배포 가능합니다.

개발자 포트폴리오 템플릿을 바탕으로 PR 직군에 맞게 다음과 같이 조정되어 있습니다:
- **Projects → Career** 섹션으로 교체 (경력 타임라인)
- **Skills** 는 기술 스택이 아닌 업무 역량(언론홍보 / 위기관리 / 보도자료 / 온라인홍보)
- **Contact** 는 이메일 한 줄 (GitHub/LinkedIn 없음)

## 저장소 구조

- `index.html` — 시맨틱 마크업으로 작성된 단일 페이지 (Hero / About / Skills / Career / Contact)
- `styles.css` — 밝은 미니멀 테마 스타일시트. CSS 변수 기반 디자인 토큰 사용
- `script.js` — 인터랙션 로직 (햄버거 메뉴 토글 / 헤더 스크롤 상태 / IntersectionObserver 페이드인)
- `README.md` — 프로젝트 소개
- `hello.txt` — 초기 커밋 메모

## 로컬 실행

빌드 도구 없이 정적 파일이므로 두 가지 방법 중 편한 쪽을 사용합니다.

```bash
# 1) 가장 간단: 브라우저에서 파일 직접 열기
open index.html

# 2) 권장: 로컬 HTTP 서버 (캐싱/CORS 문제 없이 실제 배포 환경과 동일)
python3 -m http.server 8000
# → http://localhost:8000 접속
```

## 배포

GitHub Pages로 바로 배포 가능합니다.

- Repository Settings → Pages → Source: `main` 브랜치 / `/ (root)` 선택
- 모든 경로가 상대 경로이므로 추가 설정 불필요

## 디자인 토큰

색상, 폰트, 간격 등 디자인 변수는 [styles.css](styles.css) 상단 `:root` 블록에 정의되어 있습니다. 테마를 조정하려면 해당 변수만 수정하면 됩니다.

## 콘텐츠 업데이트 가이드

- **Hero (이름·직무·태그라인)**: [index.html](index.html) 의 `.hero` 섹션
  - 이름 뒤 "입니다." 처럼 톤을 다르게 붙이고 싶을 땐 `<span class="hero__name-suffix">…</span>` 으로 감싸면 위쪽 인사말과 동일한 muted 톤으로 표시됨
- **About (자기소개)**: `.about` 영역의 `<p>` 텍스트 수정 (문단 추가 시 `<p>` 한 번 더 사용)
- **Skills (업무 역량)**: `.skills` 영역의 `<li class="skill-tag">` 항목 추가/삭제
- **Career (경력)**: `.career` 영역의 `<li class="career__item">` 복제 후 `.career__period` / `.career__company` / `.career__role` 텍스트 수정 — 최신순으로 위에서부터 나열
- **Contact (연락처)**: `.contact-list` 영역의 `<li>` 추가/수정. 각 항목은 `.contact-list__label` (라벨) 과 `.contact-list__value` (값) 의 두 줄 구조
