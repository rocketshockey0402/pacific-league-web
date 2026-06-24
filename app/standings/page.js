import { getStandings } from "@/lib/notion";
import Empty from "@/components/Empty";

export const metadata = { title: "순위표 | 퍼시픽 리그" };
export const revalidate = 60;

export default async function StandingsPage() {
  const standings = await getStandings();

  return (
    <>
      <section className="page-title">
        <div className="container">
          <div className="eyebrow">STANDINGS</div>
          <h1>순위표</h1>
          <p>경기 결과를 입력하면 자동으로 계산됩니다. (승점 → 득실차 → 득점 순)</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {standings.length === 0 ? (
            <Empty title="순위 데이터가 없어요" desc="노션 ‘순위표’ DB에 팀 성적을 추가하면 자동으로 표시됩니다." />
          ) : (
            <div className="table-wrap">
              <table className="standings">
                <thead>
                  <tr>
                    <th>순위</th>
                    <th style={{ textAlign: "left" }}>팀</th>
                    <th>경기</th><th>승</th><th>무</th><th>패</th>
                    <th>득점</th><th>실점</th><th>득실</th><th>승점</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((t, i) => (
                    <tr key={t.id} className={i === 0 ? "top" : ""}>
                      <td><span className="rank-badge">{i + 1}</span></td>
                      <td className="team-name">{t.team}</td>
                      <td>{t.played}</td><td>{t.win}</td><td>{t.draw}</td><td>{t.loss}</td>
                      <td>{t.gf}</td><td>{t.ga}</td>
                      <td>{t.diff > 0 ? `+${t.diff}` : t.diff}</td>
                      <td className="pts">{t.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p style={{ color: "var(--steel-500)", fontSize: 12.5, marginTop: 14 }}>
            경기 · 승 · 무 · 패 · 득점 · 실점 · 득실 · 승점
          </p>
        </div>
      </section>
    </>
  );
}
