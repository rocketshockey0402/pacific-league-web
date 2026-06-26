// 날짜를 보기 좋은 한국어 형식으로 변환 (예: 8월 16일 (토))
const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEK[d.getDay()]})`;
}

export function formatDateFull(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
