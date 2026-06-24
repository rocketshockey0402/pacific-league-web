"use client";

import { useState } from "react";
import Empty from "@/components/Empty";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function StandingsView({ standings = [], players = [] }) {
  const [tab, setTab] = useState("team"); // team | player
  const [sub, setSub] = useState("points"); // goals | assists | points

  // 개인 기록 정렬
  const key = sub === "goals" ? "goals" : sub === "assists" ? "assists" : "points";
  const sorted = [...players].sort(
    (a, b) => b[key] - a[key] || b.points - a.points || b.goals - a.goals
  );
  const unit = sub === "goals" ? "골" : sub === "assists" ? "도움" : "P";

  return (
    <>
      {/* 상단 탭: 팀 순위 / 개인 기록 */}
      <div className="seg">
        <button className={tab === "team" ? "active" : ""} onClick={() => setTab("team")}>
          팀 순위
        </button>
        <button className={tab === "player" ? "active" : ""} onClick={() => setTab("player")}>
          개인 기록
        </button>
      </div>

      {/* 팀 순위 */}
      {tab === "team" &&
        (standings.length === 0 ? (
          <Empty title="순위 데이터가 없습니다" desc="경기 결과를 입력하면 자동으로 계산됩니다." />
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
        ))}

      {/* 개인 기록 */}
      {tab === "player" && (
        <>
          <div className="subtabs">
            <button className={sub === "goals" ? "active" : ""} onClick={() => setSub("goals")}>득점 순위</button>
            <button className={sub === "assists" ? "active" : ""} onClick={() => setSub("assists")}>도움 순위</button>
            <button className={sub === "points" ? "active" : ""} onClick={() => setSub("points")}>포인트 순위</button>
          </div>

          {sorted.length === 0 ? (
            <Empty title="선수 기록이 없습니다" desc="노션 ‘선수 기록’ DB에 선수를 추가해 주세요." />
          ) : (
            <div className="card" style={{ padding: 6 }}>
              {sorted.map((pl, i) => (
                <div className="player-row" key={pl.id}>
                  <div className="rk">{i < 3 ? MEDALS[i] : i + 1}</div>
                  <div className="pinfo">
                    <div className="pname">{pl.name}</div>
                    <div className="pmeta">
                      {pl.number ? `No.${pl.number} · ` : ""}{pl.team}
                    </div>
                  </div>
                  <div className="pstat">
                    <div>
                      <span className="big">{pl[key]}</span>
                      <span className="unit">{unit}</span>
                    </div>
                    <div className="sub">
                      {sub === "goals" && `도움 ${pl.assists} · ${pl.points}P`}
                      {sub === "assists" && `득점 ${pl.goals} · ${pl.points}P`}
                      {sub === "points" && `${pl.goals}골 ${pl.assists}도움`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
