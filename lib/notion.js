import { Client } from "@notionhq/client";
import { POINTS, AUTO_STANDINGS } from "./config";

// ──────────────────────────────────────────────
//  노션 클라이언트 초기화
//  API Key 는 환경변수(NOTION_API_KEY)에서만 읽습니다.
//  코드 어디에도 키를 직접 적지 마세요.
// ──────────────────────────────────────────────
const notionKey = process.env.NOTION_API_KEY;
const notion = notionKey ? new Client({ auth: notionKey }) : null;

// 노션 연결이 안 되어 있어도 사이트가 깨지지 않도록 안전하게 비어있는 값을 돌려줍니다.
const isReady = (dbId) => Boolean(notion && dbId);

// ──────────────────────────────────────────────
//  노션 속성 값을 쉽게 꺼내는 도우미 함수들
// ──────────────────────────────────────────────
const getText = (prop) => {
  if (!prop) return "";
  if (prop.type === "title") return prop.title?.map((t) => t.plain_text).join("") ?? "";
  if (prop.type === "rich_text") return prop.rich_text?.map((t) => t.plain_text).join("") ?? "";
  if (prop.type === "select") return prop.select?.name ?? "";
  if (prop.type === "url") return prop.url ?? "";
  if (prop.type === "phone_number") return prop.phone_number ?? "";
  if (prop.type === "email") return prop.email ?? "";
  return "";
};

const getNumber = (prop) => {
  if (!prop) return 0;
  if (prop.type === "number") return prop.number ?? 0;
  if (prop.type === "formula" && prop.formula?.type === "number") return prop.formula.number ?? 0;
  return 0;
};

const getDate = (prop) => {
  if (!prop || prop.type !== "date") return null;
  return prop.date?.start ?? null;
};

const getCheckbox = (prop) => (prop?.type === "checkbox" ? Boolean(prop.checkbox) : false);

const getFileUrl = (prop) => {
  if (!prop) return "";
  if (prop.type === "files" && prop.files?.length) {
    const f = prop.files[0];
    return f.type === "external" ? f.external?.url ?? "" : f.file?.url ?? "";
  }
  if (prop.type === "url") return prop.url ?? "";
  return "";
};

// 여러 속성 이름 중 존재하는 첫 번째 것을 찾아 줍니다. (운영진이 컬럼명을 살짝 다르게 써도 동작)
const pick = (props, names) => {
  for (const n of names) {
    if (props[n] !== undefined) return props[n];
  }
  return undefined;
};

async function queryDatabase(dbId, options = {}) {
  if (!isReady(dbId)) return [];
  try {
    const res = await notion.databases.query({ database_id: dbId, ...options });
    return res.results ?? [];
  } catch (err) {
    console.error("[Notion] 데이터 조회 실패:", err?.message || err);
    return [];
  }
}

// ──────────────────────────────────────────────
//  1. 경기 일정
// ──────────────────────────────────────────────
export async function getSchedule() {
  const rows = await queryDatabase(process.env.NOTION_SCHEDULE_DATA_SOURCE_ID);
  return rows
    .map((row) => {
      const p = row.properties;
      return {
        id: row.id,
        title: getText(pick(p, ["경기명", "제목", "경기", "Name"])),
        date: getDate(pick(p, ["날짜", "일자", "Date"])),
        time: getText(pick(p, ["시간", "Time"])),
        home: getText(pick(p, ["홈팀", "Home"])),
        away: getText(pick(p, ["원정팀", "어웨이", "Away"])),
        place: getText(pick(p, ["장소", "Place"])) || "김포 아이스링크",
        round: getText(pick(p, ["라운드", "Round", "주차"])),
        status: getText(pick(p, ["상태", "Status"])) || "예정",
      };
    })
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
}

// ──────────────────────────────────────────────
//  2. 경기 결과
// ──────────────────────────────────────────────
export async function getResults() {
  const rows = await queryDatabase(process.env.NOTION_RESULTS_DATA_SOURCE_ID);
  return rows
    .map((row) => {
      const p = row.properties;
      return {
        id: row.id,
        title: getText(pick(p, ["경기명", "제목", "경기", "Name"])),
        date: getDate(pick(p, ["날짜", "일자", "Date"])),
        home: getText(pick(p, ["홈팀", "Home"])),
        homeScore: getNumber(pick(p, ["홈팀 점수", "홈점수", "홈 스코어", "HomeScore"])),
        away: getText(pick(p, ["원정팀", "어웨이", "Away"])),
        awayScore: getNumber(pick(p, ["원정팀 점수", "원정점수", "원정 스코어", "AwayScore"])),
        round: getText(pick(p, ["라운드", "Round", "주차"])),
        mvp: getText(pick(p, ["MVP", "mvp"])),
      };
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || "")); // 최신 경기 먼저
}

// ──────────────────────────────────────────────
//  3-1. 경기 결과로 순위 자동 계산
//      운영진은 '경기 결과' DB에 점수만 입력하면 됩니다.
//      참가팀 DB가 있으면, 아직 경기를 안 한 팀도 0으로 표시합니다.
// ──────────────────────────────────────────────
export async function computeStandings() {
  const [results, teamRows] = await Promise.all([getResults(), getTeams()]);

  const registered = teamRows.map((t) => t.name).filter(Boolean);
  const useRegistered = registered.length > 0;

  const table = new Map();
  const make = (name) => ({
    id: name, team: name, played: 0, win: 0, draw: 0, loss: 0,
    points: 0, gf: 0, ga: 0, diff: 0,
  });

  // 참가팀 DB에 등록된 팀만 순위표에 노출 (이름이 안 맞는 옛 팀명은 제외)
  if (useRegistered) registered.forEach((n) => table.set(n, make(n)));

  results.forEach((m) => {
    if (!m.home || !m.away) return;

    if (useRegistered) {
      // 등록된 두 팀 사이의 경기만 집계 (옛 이름 경기는 무시)
      if (!table.has(m.home) || !table.has(m.away)) return;
    } else {
      // 참가팀 DB가 비어있으면 경기 결과로부터 팀을 만든다 (예비 동작)
      if (!table.has(m.home)) table.set(m.home, make(m.home));
      if (!table.has(m.away)) table.set(m.away, make(m.away));
    }
    const h = table.get(m.home);
    const a = table.get(m.away);

    h.played++; a.played++;
    h.gf += m.homeScore; h.ga += m.awayScore;
    a.gf += m.awayScore; a.ga += m.homeScore;

    if (m.homeScore > m.awayScore) {
      h.win++; a.loss++; h.points += POINTS.win; a.points += POINTS.loss;
    } else if (m.homeScore < m.awayScore) {
      a.win++; h.loss++; a.points += POINTS.win; h.points += POINTS.loss;
    } else {
      h.draw++; a.draw++; h.points += POINTS.draw; a.points += POINTS.draw;
    }
  });

  const teams = Array.from(table.values()).map((t) => ({ ...t, diff: t.gf - t.ga }));
  return teams.sort(
    (a, b) => b.points - a.points || b.diff - a.diff || b.gf - a.gf || a.team.localeCompare(b.team)
  );
}

// ──────────────────────────────────────────────
//  3-2. 순위표 (자동 계산 또는 노션 직접 입력)
// ──────────────────────────────────────────────
export async function getStandings() {
  if (AUTO_STANDINGS) return computeStandings();

  const rows = await queryDatabase(process.env.NOTION_STANDINGS_DATA_SOURCE_ID);
  const teams = rows.map((row) => {
    const p = row.properties;
    const gf = getNumber(pick(p, ["득점", "GF"]));
    const ga = getNumber(pick(p, ["실점", "GA"]));
    return {
      id: row.id,
      team: getText(pick(p, ["팀명", "팀", "Team", "Name"])),
      rank: getNumber(pick(p, ["순위", "Rank"])),
      played: getNumber(pick(p, ["경기수", "경기", "GP"])),
      win: getNumber(pick(p, ["승", "Win"])),
      draw: getNumber(pick(p, ["무", "Draw"])),
      loss: getNumber(pick(p, ["패", "Loss"])),
      points: getNumber(pick(p, ["승점", "포인트", "Points", "Pts"])),
      gf,
      ga,
      diff: getNumber(pick(p, ["득실차", "득실", "Diff"])) || gf - ga,
    };
  });
  // 순위 컬럼이 비어있으면 승점 → 득실차 → 득점 순으로 자동 정렬
  const hasRank = teams.some((t) => t.rank > 0);
  if (hasRank) return teams.sort((a, b) => a.rank - b.rank);
  return teams.sort((a, b) => b.points - a.points || b.diff - a.diff || b.gf - a.gf);
}

// ──────────────────────────────────────────────
//  4. 참가팀
// ──────────────────────────────────────────────
export async function getTeams() {
  const rows = await queryDatabase(process.env.NOTION_TEAMS_DATA_SOURCE_ID);
  return rows.map((row) => {
    const p = row.properties;
    return {
      id: row.id,
      name: getText(pick(p, ["팀명", "팀", "Team", "Name"])),
      logo: getFileUrl(pick(p, ["로고", "Logo", "엠블럼"])),
      intro: getText(pick(p, ["소개", "팀소개", "Intro", "설명"])),
      captain: getText(pick(p, ["주장", "Captain"])),
      base: getText(pick(p, ["연고", "창단", "Base", "지역"])),
      instagram: getText(pick(p, ["인스타", "인스타그램", "Instagram", "SNS"])),
    };
  });
}

// ──────────────────────────────────────────────
//  5. 공지사항
// ──────────────────────────────────────────────
export async function getNotices() {
  const rows = await queryDatabase(process.env.NOTION_NOTICES_DATA_SOURCE_ID);
  return rows
    .map((row) => {
      const p = row.properties;
      return {
        id: row.id,
        title: getText(pick(p, ["제목", "공지", "Title", "Name"])),
        date: getDate(pick(p, ["작성일", "날짜", "Date"])),
        category: getText(pick(p, ["분류", "카테고리", "Category"])) || "일반",
        content: getText(pick(p, ["내용", "본문", "Content"])),
        pinned: getCheckbox(pick(p, ["고정", "Pinned", "상단고정"])),
      };
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1; // 고정 공지 먼저
      return (b.date || "").localeCompare(a.date || "");
    });
}

// ──────────────────────────────────────────────
//  6. 선수 기록 (개인 순위)
//      포인트(P)는 득점+도움으로 자동 계산합니다.
// ──────────────────────────────────────────────
export async function getPlayers() {
  const rows = await queryDatabase(process.env.NOTION_PLAYERS_DATA_SOURCE_ID);
  return rows.map((row) => {
    const p = row.properties;
    const goals = getNumber(pick(p, ["득점", "골", "Goals", "G"]));
    const assists = getNumber(pick(p, ["도움", "어시스트", "Assists", "A"]));
    return {
      id: row.id,
      name: getText(pick(p, ["선수명", "선수", "이름", "Name"])),
      number: getNumber(pick(p, ["등번호", "번호", "No", "Number"])),
      team: getText(pick(p, ["팀", "팀명", "Team"])),
      played: getNumber(pick(p, ["경기수", "경기", "GP"])),
      goals,
      assists,
      points: getNumber(pick(p, ["포인트", "Points", "P"])) || goals + assists,
    };
  });
}

// ──────────────────────────────────────────────
//  7. 영상 (유튜브 하이라이트)
//      유튜브 링크에서 영상 ID를 뽑아 임베드에 사용합니다.
// ──────────────────────────────────────────────
function youtubeId(url) {
  if (!url) return "";
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : "";
}

export async function getVideos() {
  const rows = await queryDatabase(process.env.NOTION_VIDEOS_DATA_SOURCE_ID);
  return rows
    .map((row) => {
      const p = row.properties;
      const url = getText(pick(p, ["영상 링크", "링크", "URL", "url"]));
      return {
        id: row.id,
        title: getText(pick(p, ["제목", "title", "Name"])),
        url,
        youtubeId: youtubeId(url),
        date: getDate(pick(p, ["날짜", "Date"])),
        desc: getText(pick(p, ["설명", "내용", "Desc"])),
      };
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || "")); // 최신 영상 먼저
}

// 노션 연결 여부 (페이지에서 안내 문구를 보여줄 때 사용)
export const notionConnected = Boolean(notionKey);
