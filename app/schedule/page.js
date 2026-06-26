import { getSchedule, getTeams } from "@/lib/notion";
import { formatDate } from "@/lib/format";
import Empty from "@/components/Empty";

export const metadata = { title: "경기 일정 | 퍼시픽 리그" };
export const revalidate = 60;

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

  const groups = {};
  schedule.forEach((m) => {
    const key = m.date || "미정";
    (groups[key] = groups[key] || []).push(m);
  });
  const dates = Object.keys(groups).sort((a, b) => a.localeCompare(b));

  return (
    <>
      <section className="page-title">
        <div className="container">
          <div className="eyebrow">MATCH SCHEDULE</div>
          <h1>경기 일정</h1>
          <p>퍼시픽 리그 2026 시즌 · 매주 일요일 진행</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {schedule.length === 0 ? (
            <Empty title="등록된 경기 일정이 없어요" desc="노션 ‘경기 일정’ DB에 경기를 추가하면 자동으로 표시됩니다." />
          ) : (
            dates.map((d) => (
              <div className="fix-group" key={d}>
                <div className="fix-date">{d === "미정" ? "일정 미정" : formatDate(d)}</div>
                <div className="fix-list">
                  {groups[d].map((m) => (
                    <div className="fix-row" key={m.id}>
                      <div className="fix-team home">
                        <span className="fix-name">{m.home || "TBD"}</span>
                        <TeamLogo name={m.home} logos={teamLogos} />
                      </div>
                      <div className="fix-center">
                        <div className="fix-time">{m.time || "시간 미정"}</div>
                        <div className="fix-status">{m.status}</div>
                      </div>
                      <div className="fix-team away">
                        <TeamLogo name={m.away} logos={teamLogos} />
                        <span className="fix-name">{m.away || "TBD"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
