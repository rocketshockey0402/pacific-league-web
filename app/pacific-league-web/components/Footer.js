export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          <div>
            <strong style={{ color: "var(--text)", letterSpacing: "0.04em" }}>
              퍼시픽 리그 · PACIFIC LEAGUE
            </strong>
            <div>김포 아이스링크 · 성인 취미 아이스하키 리그</div>
          </div>
          <div>© {year} PACIFIC LEAGUE. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
