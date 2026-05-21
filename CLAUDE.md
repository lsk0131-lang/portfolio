# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

개인 포트폴리오 웹사이트입니다. 순수 HTML/CSS/JavaScript로 작성된 정적 단일 페이지 사이트이며, 빌드 시스템 없이 그대로 배포 가능합니다.

## 저장소 구조

- `index.html` — 시맨틱 마크업으로 작성된 단일 페이지 (Hero / About / Skills / Projects / Contact)
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

- 이름, 직업, 자기소개: [index.html](index.html) 의 `.hero`, `.about` 섹션
- 기술 스택 추가/삭제: `.skills` 영역의 `<li class="skill-tag">` 항목 편집
- 프로젝트 카드: `.projects` 영역의 `<article class="project-card">` 복제 후 내용 수정
  - 썸네일은 CSS 그라데이션 (`thumb--1`, `thumb--2`, `thumb--3`). 실제 이미지로 교체하려면 [styles.css](styles.css) 의 해당 클래스에 `background-image: url(...)` 추가
- 연락처: `.contact-list` 영역의 이메일/GitHub/LinkedIn 링크 수정
