import { getTeams } from "@/lib/notion";
import Empty from "@/components/Empty";

export const metadata = { title: "참가팀 | 퍼시픽 리그" };
export const revalidate = 60;

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <>
      <section className="page-title">
        <div className="container">
          <div className="eyebrow">TEAMS</div>
          <h1>참가팀</h1>
          <p>2026 시즌 퍼시픽 리그에 참가하는 팀들을 소개합니다.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {teams.length === 0 ? (
            <Empty title="등록된 팀이 없어요" desc="노션 ‘참가팀’ DB에 팀을 추가하면 자동으로 표시됩니다." />
          ) : (
            <div className="grid grid-3">
              {teams.map((t) => (
                <div className="card team-card" key={t.id}>
                  <div className="logo">
                    {t.logo ? <img src={t.logo} alt={t.name} /> : (t.name?.[0] ?? "?")}
                  </div>
                  <h3>{t.name}</h3>
                  {t.instagram && (
                    <a
                      href={t.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="badge badge-ice"
                      style={{ marginTop: 12, display: "inline-block" }}
                    >
                      @ 인스타그램
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
