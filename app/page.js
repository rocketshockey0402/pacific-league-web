import Link from "next/link";
import { getSchedule, getStandings, getResults, getTeams } from "@/lib/notion";
import { formatDate } from "@/lib/format";
import Empty from "@/components/Empty";

export const revalidate = 60;

function TeamLogo({ name, logos }) {
  const logo = logos[name];
  return (
    <span className="tlogo">
      {logo ? <img src={logo} alt={name} /> : <span>{name?.[0] ?? "?"}</span>}
    </span>
  );
}

export default async function HomePage() {
  const [schedule, standings, results, teams] = await Promise.all([
    getSchedule(),
    getStandings(),
    getResults(),
    getTeams(),
  ]);

  const teamLogos = {};
  teams.forEach((t) => {
    if (t.name) teamLogos[t.name] = t.logo || "";
  });

  const upcoming = schedule.filter((m) => m.status !== "종료").slice(0, 3);
  const recent = results.slice(0, 3);
  const topStandings = standings.slice(0, 6);

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="eyebrow">KIMPO ICE RINK · 2026 SEASON</span>
          <h1>
            얼음 위의 진검승부,
            <br />
            <span className="grad">퍼시픽 리그</span>
          </h1>
          <p className="lead">
            김포 아이스링크에서 펼쳐지는 성인 취미 아이스하키 리그.
            6개 팀이 8월부터 10월까지 시즌을 함께 달립니다.
          </p>
          <div className="hero-cta">
            <Link href="/schedule" className="btn btn-primary">경기 일정 보기</Link>
            <Link href="/standings" className="btn btn-ghost">순위표 확인</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="section-head">
            <div><h2>📅 다음 경기</h2></div>
            <Link href="/schedule" className="more">전체 일정 →</Link>
          </div>
          {upcoming.length === 0 ? (
            <Empty title="예정된 경기가 없습니다" desc="노션 ‘경기 일정’ DB에 경기를 추가해 주세요." />
          ) : (
            <div className="grid grid-3">
              {upcoming.map((m) => (
                <div className="card" key={m.id}>
                  <div className="match-meta">
                    {m.round && <span className="badge badge-ice">{m.round}</span>}
                    <span>{formatDate(m.date)}</span>
                    {m.time && <span>· {m.time}</span>}
                  </div>
                  <div className="match">
                    <span className="team home">
                      {m.home || "TBD"}<TeamLogo name={m.home} logos={teamLogos} />
                    </span>
                    <span className="vs">VS</span>
                    <span className="team">
                      <TeamLogo name={m.away} logos={teamLogos} />{m.away || "TBD"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div><h2>🏆 최근 결과</h2></div>
            <Link href="/results" className="more">전체 결과 →</Link>
          </div>
          {recent.length === 0 ? (
            <Empty title="등록된 경기 결과가 없습니다" desc="노션 ‘경기 결과’ DB에 결과를 입력해 주세요." />
          ) : (
            <div className="grid grid-3">
              {recent.map((m) => {
                const homeWin = m.homeScore > m.awayScore;
                const awayWin = m.awayScore > m.homeScore;
                return (
                  <div className="card" key={m.id}>
                    <div className="match-meta">
                      {m.round && <span className="badge badge-ice">{m.round}</span>}
                      <span>{formatDate(m.date)}</span>
                      <span className="badge badge-steel">종료</span>
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

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div><h2>📊 리그 순위</h2></div>
            <Link href="/standings" className="more">전체 순위 →</Link>
          </div>
          {topStandings.length === 0 ? (
            <Empty title="순위 데이터가 없습니다" desc="경기 결과를 입력하면 자동으로 계산됩니다." />
          ) : (
            <div className="table-wrap">
              <table className="standings">
                <thead>
                  <tr>
                    <th>순위</th><th style={{ textAlign: "left" }}>팀</th>
                    <th>경기</th><th>승</th><th>무</th><th>패</th><th>득실</th><th>승점</th>
                  </tr>
                </thead>
                <tbody>
                  {topStandings.map((t, i) => (
                    <tr key={t.id} className={i === 0 ? "top" : ""}>
                      <td><span className="rank-badge">{i + 1}</span></td>
                      <td className="team-name">
                        <span className="tcell">
                          <TeamLogo name={t.team} logos={teamLogos} />{t.team}
                        </span>
                      </td>
                      <td>{t.played}</td><td>{t.win}</td><td>{t.draw}</td><td>{t.loss}</td>
                      <td>{t.diff > 0 ? `+${t.diff}` : t.diff}</td>
                      <td className="pts">{t.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
