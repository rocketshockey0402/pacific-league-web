import { getStandings, getPlayers } from "@/lib/notion";
import StandingsView from "./StandingsView";

export const metadata = { title: "순위 | 퍼시픽 리그" };
export const revalidate = 60;

export default async function StandingsPage() {
  const [standings, players] = await Promise.all([getStandings(), getPlayers()]);

  return (
    <>
      <section className="page-title">
        <div className="container">
          <div className="eyebrow">STANDINGS</div>
          <h1>순위</h1>
          <p>팀 순위와 선수 개인 기록을 한눈에. 경기 결과를 입력하면 자동으로 갱신됩니다.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <StandingsView standings={standings} players={players} />
        </div>
      </section>
    </>
  );
}
