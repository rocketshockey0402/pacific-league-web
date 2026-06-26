import { getResults } from "@/lib/notion";
import { formatDate } from "@/lib/format";
import Empty from "@/components/Empty";

export const metadata = { title: "경기 결과 | 퍼시픽 리그" };
export const revalidate = 60;

export default async function ResultsPage() {
  const results = await getResults();

  return (
    <>
      <section className="page-title">
        <div className="container">
          <div className="eyebrow">MATCH RESULTS</div>
          <h1>경기 결과</h1>
          <p>종료된 경기의 스코어와 기록입니다.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {results.length === 0 ? (
            <Empty title="등록된 경기 결과가 없어요" desc="노션 ‘경기 결과’ DB에 결과를 입력하면 자동으로 표시됩니다." />
          ) : (
            <div className="grid grid-2">
              {results.map((m) => {
                const homeWin = m.homeScore > m.awayScore;
                const awayWin = m.awayScore > m.homeScore;
                return (
                  <div className="card" key={m.id}>
                    <div className="match-meta">
                      {m.round && <span className="badge badge-ice">{m.round}</span>}
                      <span>{formatDate(m.date)}</span>
                      {m.mvp && <span className="badge badge-accent">MVP {m.mvp}</span>}
                    </div>
                    <div className="match">
                      <span className="team home">{m.home || "TBD"}</span>
                      <span className="score">
                        <span className={homeWin ? "win" : ""}>{m.homeScore}</span>
                        <span style={{ color: "var(--steel-500)", margin: "0 6px" }}>:</span>
                        <span className={awayWin ? "win" : ""}>{m.awayScore}</span>
                      </span>
                      <span className="team">{m.away || "TBD"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
