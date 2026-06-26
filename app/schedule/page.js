import { getSchedule, getTeams } from "@/lib/notion";
import { formatDate } from "@/lib/format";
import Empty from "@/components/Empty";

export const metadata = { title: "경기 일정 | 퍼시픽 리그" };
export const revalidate = 60;

const statusBadge = (s) => {
  if (s === "종료") return "badge-steel";
  if (s === "진행" || s === "진행중") return "badge-live";
  return "badge-ice";
};

function TeamLogo({ name, logos }) {
  const logo = logos[name];
  return (
    <span className="tlogo">
      {logo ? <img src={logo} alt={name} /> : <span>{name?.[0] ?? "?"}</span>}
    </span>
  );
}

export default async function SchedulePage() {
  const [schedule, teams] = await Promise.all([getSchedule(), getTeams()]);

  const teamLogos = {};
  teams.forEach((t) => {
    if (t.name) teamLogos[t.name] = t.logo || "";
  });

  return (
    <>
      <section className="page-title">
        <div className="container">
          <div className="eyebrow">MATCH SCHEDULE</div>
          <h1>경기 일정</h1>
          <p>퍼시픽 리그 2026 시즌 전체 경기 일정입니다.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {schedule.length === 0 ? (
            <Empty title="등록된 경기 일정이 없어요" desc="노션 ‘경기 일정’ DB에 경기를 추가하면 자동으로 표시됩니다." />
          ) : (
            <div className="grid grid-2">
              {schedule.map((m) => (
                <div className="card" key={m.id}>
                  <div className="match-meta">
                    <span className={`badge ${statusBadge(m.status)}`}>{m.status}</span>
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
    </>
  );
}
