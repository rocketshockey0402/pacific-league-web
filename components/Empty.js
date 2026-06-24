// 노션에 아직 데이터가 없거나 연결 전일 때 보여주는 안내 박스
export default function Empty({ title = "아직 등록된 내용이 없어요", desc }) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      <span>{desc || "노션 데이터베이스에 내용을 추가하면 이곳에 자동으로 표시됩니다."}</span>
    </div>
  );
}
