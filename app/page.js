import Link from "next/link";
import { getSchedule, getStandings, getNotices, getTeams } from "@/lib/notion";
import { formatDate, formatDateFull } from "@/lib/format";
import Empty from "@/components/Empty";

// 노션 데이터를 60초마다 새로 불러옵니다. (운영진이 노션을 수정하면 곧 반영)
export const revalidate = 60;

export default async function HomePage() {
  const [schedule, standings, notices, teams] = await Promise.all([
    getSchedule(),
    getStandings(),
    getNotices(),
    getTeams(),
  ]);

  const upcoming = schedule.filter((m) => m.status !== "종료").slice(0, 3);
  const topStandings = standings.slice(0, 6);
  const latestNotices = notices.slice(0, 3);

  return (
    <>
      {/* ── 히어로 ── */}
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

      {/* ── 다가오는 경기 ── */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>다가오는 경기</h2>
              <div className="desc">가장 가까운 경기 일정입니다.</div>
            </div>
            <Link href="/schedule" className="more">전체 일정 →</Link>
          </div>

          {upcoming.length === 0 ? (
            <Empty title="등록된 경기 일정이 없어요" desc="노션 ‘경기 일정’ DB에 경기를 추가해 주세요." />
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
                    <span className="team home">{m.home || "TBD"}</span>
                    <span className="vs">VS</span>
                    <span className="team">{m.away || "TBD"}</span>
                  </div>
                  <div style={{ textAlign: "center", marginTop: 14, color: "var(--steel-400)", fontSize: 12.5 }}>
                    📍 {m.place}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 순위표 미리보기 ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2>순위표</h2>
              <div className="desc">시즌 누적 성적</div>
            </div>
            <Link href="/standings" className="more">전체 순위 →</Link>
          </div>

          {topStandings.length === 0 ? (
            <Empty title="순위 데이터가 없어요" desc="노션 ‘순위표’ DB에 팀 성적을 추가해 주세요." />
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
                      <td className="team-name">{t.team}</td>
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

      {/* ── 공지 + 참가팀 요약 ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-2">
            <div>
              <div className="section-head">
                <h2>공지사항</h2>
                <Link href="/notices" className="more">더보기 →</Link>
              </div>
              {latestNotices.length === 0 ? (
                <Empty title="등록된 공지가 없어요" />
              ) : (
                <div className="card" style={{ padding: 6 }}>
                  {latestNotices.map((n) => (
                    <div className="notice-item" key={n.id}>
                      <span className="when">{formatDateFull(n.date)}</span>
                      <div>
                        <h3>
                          {n.pinned && <span className="badge badge-accent" style={{ marginRight: 6 }}>고정</span>}
                          {n.title}
                        </h3>
                        {n.content && <p>{n.content.slice(0, 70)}{n.content.length > 70 ? "…" : ""}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="section-head">
                <h2>참가팀</h2>
                <Link href="/teams" className="more">팀 소개 →</Link>
              </div>
              {teams.length === 0 ? (
                <Empty title="등록된 팀이 없어요" />
              ) : (
                <div className="grid grid-3">
                  {teams.slice(0, 6).map((t) => (
                    <div className="card team-card" key={t.id} style={{ padding: 16 }}>
                      <div className="logo">
                        {t.logo ? <img src={t.logo} alt={t.name} /> : (t.name?.[0] ?? "?")}
                      </div>
                      <h3 style={{ fontSize: 15 }}>{t.name}</h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
