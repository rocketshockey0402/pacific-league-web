export const metadata = { title: "대회 소개 | 퍼시픽 리그" };

const info = [
  { k: "대회명", v: "퍼시픽 리그 (PACIFIC LEAGUE)", tbd: false },
  { k: "장소", v: "김포 아이스링크", tbd: false },
  { k: "대회 기간", v: "2026년 8월 ~ 10월", tbd: false },
  { k: "참가 규모", v: "총 6개 팀", tbd: false },
  { k: "팀당 인원", v: "확인 필요", tbd: true },
  { k: "참가비", v: "확인 필요", tbd: true },
  { k: "경기 방식", v: "확인 필요", tbd: true },
  { k: "요일 / 시간대", v: "확인 필요", tbd: true },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-title">
        <div className="container">
          <div className="eyebrow">ABOUT THE LEAGUE</div>
          <h1>대회 소개</h1>
          <p>성인 취미 아이스하키 팀들이 정기적으로 경기하며 경쟁과 교류를 함께 즐기는 리그.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card" style={{ marginBottom: 28 }}>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.9, color: "var(--text-dim)" }}>
              <strong style={{ color: "var(--white)" }}>퍼시픽 리그</strong>는 김포 아이스링크에서
              열리는 성인 취미 아이스하키 대회입니다. 단순한 친선 경기를 넘어, 실제 스포츠 리그처럼
              일정·순위·기록이 관리되는 정식 리그를 지향합니다. 태평양의 파도처럼 거침없는 속도감과
              팀 간의 진지한 경쟁, 그리고 빙판 위에서 만나는 동료애 — 그 모든 것을 한 시즌에 담았습니다.
            </p>
          </div>

          <div className="section-head"><h2>대회 개요</h2></div>
          <div className="info-grid">
            {info.map((it) => (
              <div className="item" key={it.k}>
                <div className="k">{it.k}</div>
                <div className={`v${it.tbd ? " tbd" : ""}`}>{it.v}</div>
              </div>
            ))}
          </div>

          <div className="section-head" style={{ marginTop: 40 }}><h2>리그가 추구하는 것</h2></div>
          <div className="grid grid-3">
            <div className="card">
              <div className="badge badge-ice" style={{ marginBottom: 10 }}>경쟁</div>
              <p style={{ margin: 0, color: "var(--text-dim)", fontSize: 14 }}>
                매 경기 승점이 쌓이고 순위가 갈립니다. 가벼운 게임이 아닌, 진짜 리그의 긴장감.
              </p>
            </div>
            <div className="card">
              <div className="badge badge-ice" style={{ marginBottom: 10 }}>교류</div>
              <p style={{ margin: 0, color: "var(--text-dim)", fontSize: 14 }}>
                여러 팀이 한 시즌을 함께 보내며 아이스하키를 사랑하는 사람들과 연결됩니다.
              </p>
            </div>
            <div className="card">
              <div className="badge badge-ice" style={{ marginBottom: 10 }}>기록</div>
              <p style={{ margin: 0, color: "var(--text-dim)", fontSize: 14 }}>
                모든 경기 결과와 순위가 기록되고 공개됩니다. 내 팀의 시즌이 데이터로 남습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
