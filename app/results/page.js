import { getResults, getTeams } from "@/lib/notion";
import { formatDate } from "@/lib/format";
import Empty from "@/components/Empty";

export const metadata = { title: "경기 결과 | 퍼시픽 리그" };
export const revalidate = 60;

export default async function ResultsPage() {
  const [results, teams] = await Promise.all([getResults(), getTeams()]);

  const teamLogos = {};
  teams.forEach((t) => {
    if (t.name) teamLogos[t.name] = t.logo || "";
  });

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
                    <div className="result-match">
                      <div className="rteam">
                        <div className="rlogo">
                          {teamLogos[m.home] ? <img src={teamLogos[m.home]} alt={m.home} /> : (m.home?.[0] ?? "?")}
                        </div>
                        <div className="rname">{m.home || "TBD"}</div>
                        <div className={`rscore ${homeWin ? "win" : ""}`}>{m.homeScore}</div>
                      </div>
                      <div className="rcolon">:</div>
                      <div className="rteam">
                        <div className="rlogo">
                          {teamLogos[m.away] ? <img src={teamLogos[m.away]} alt={m.away} /> : (m.away?.[0] ?? "?")}
                        </div>
                        <div className="rname">{m.away || "TBD"}</div>
                        <div className={`rscore ${awayWin ? "win" : ""}`}>{m.awayScore}</div>
                      </div>
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
