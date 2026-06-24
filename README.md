# 퍼시픽 리그 (PACIFIC LEAGUE) 홈페이지

김포 아이스링크 성인 취미 아이스하키 리그 공식 홈페이지.
**Next.js + Notion API + Vercel** 구조로, 운영진이 노션만 수정하면 홈페이지에 자동 반영됩니다.

## 기술 스택
- Next.js 14 (App Router)
- @notionhq/client (Notion API)
- Vercel 배포 / 모바일 반응형
- 민감정보(API Key 등)는 전부 환경변수로만 관리

## 메뉴 구성
HOME · 대회 소개 · 경기 일정 · 경기 결과 · 순위표 · 참가팀 · 공지사항

## 폴더 구조
```
pacific-league-web/
├─ app/
│  ├─ layout.js          공통 레이아웃 (헤더/푸터)
│  ├─ globals.css        디자인 시스템 (네이비/아이스블루)
│  ├─ page.js            HOME
│  ├─ about/page.js      대회 소개
│  ├─ schedule/page.js   경기 일정
│  ├─ results/page.js    경기 결과
│  ├─ standings/page.js  순위표
│  ├─ teams/page.js      참가팀
│  └─ notices/page.js    공지사항
├─ components/           Header / Footer / Empty
├─ lib/
│  ├─ notion.js          노션 데이터 조회 (5개 DB)
│  └─ format.js          날짜 포맷 도우미
└─ .env.example          환경변수 예시
```

## 빠른 시작
```bash
# 1) .env.example 을 .env.local 로 복사하고 값 입력
# 2) 설치 & 실행
npm install
npm run dev   # http://localhost:3000
```

## 환경변수
`.env.example` 참고. 6개 값 필요:
`NOTION_API_KEY`, `NOTION_SCHEDULE_DATA_SOURCE_ID`, `NOTION_RESULTS_DATA_SOURCE_ID`,
`NOTION_STANDINGS_DATA_SOURCE_ID`, `NOTION_TEAMS_DATA_SOURCE_ID`, `NOTION_NOTICES_DATA_SOURCE_ID`

## 자세한 안내
- 노션 DB 만드는 법 → `../01_노션_DB_설계_가이드.md`
- 배포 & 운영 → `../02_배포_운영_매뉴얼.md`

> 노션 연결 전이거나 데이터가 없어도 사이트는 정상 작동하며, 각 페이지에 "준비 중" 안내가 표시됩니다.
