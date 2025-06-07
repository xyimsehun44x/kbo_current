import React, { useState, useEffect } from "react";

export default function App() {
  const [boxScore, setBoxScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    fetch("/usethisdata.csv")
      .then((r) => r.text())
      .then((text) => {
        const lines = text.trim().split(/\r?\n/);
        const headers = lines[0].replace(/^\uFEFF/, "").split(",");
        const rows = lines.slice(1).map((ln) => {
          const cols = ln.split(",");
          return headers.reduce((o, h, i) => {
            o[h.trim()] = (cols[i] || "").trim();
            return o;
          }, {});
        });
        if (!rows.length) return setLoading(false);

        const awayName = rows[0].away_alias;
        const homeName = rows[0].home_alias;
        const awayRuns = Array(9).fill(0);
        const homeRuns = Array(9).fill(0);

        rows.forEach((r) => {
          const idx = Number(r.inning) - 1;
          const runs = Number(r.runs_scored) || 0;
          if (r.away_alias === awayName) awayRuns[idx] += runs;
          else if (r.home_alias === homeName) homeRuns[idx] += runs;
        });

        setBoxScore({
          away: {
            team: awayName,
            byInning: awayRuns,
            total: awayRuns.reduce((a, b) => a + b, 0),
          },
          home: {
            team: homeName,
            byInning: homeRuns,
            total: homeRuns.reduce((a, b) => a + b, 0),
          },
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const renderTable = () => {
    if (loading) return <div style={{ padding: 12 }}>Loading…</div>;
    if (!boxScore) return <div style={{ padding: 12 }}>데이터 없음</div>;

    const innings = [...Array(9).keys()].map((i) => i + 1);

    // logos live in public/
    const logoMap = {
      Lotte: "/lotte.jpg",
      Kiwoom: "/kiwoom.jpg",
    };

    return (
      <>
        {/* Score header */}
        <div className="score-header">
          <div className="team-block">
            <img
              src={logoMap[boxScore.away.team] || "/kiwoom.jpg"}
              alt={boxScore.away.team}
              className="team-logo-small"
            />
            <span className="team-name-small">{boxScore.away.team}</span>
          </div>
          <div className="score-total">{boxScore.away.total}</div>
          <div className="score-total">{boxScore.home.total}</div>
          <div className="team-block">
            <span className="team-name-small">{boxScore.home.team}</span>
            <img
              src={logoMap[boxScore.home.team] || "/lotte.jpg"}
              alt={boxScore.home.team}
              className="team-logo-small"
            />
          </div>
        </div>

        {/* Inning-by-inning table */}
        <table>
          <thead>
            <tr>
              <th></th>
              {innings.map((n) => (
                <th key={n}>{n}</th>
              ))}
              <th>R</th>
            </tr>
          </thead>
          <tbody>
            {["away", "home"].map((side) => {
              const t = boxScore[side];
              return (
                <tr key={side}>
                  <td
                    style={{
                      textAlign: "right",
                      paddingLeft: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {t.team}
                  </td>
                  {t.byInning.map((r, i) => (
                    <td key={i}>{r || "-"}</td>
                  ))}
                  <td>{t.total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <>
      {/* baseball icon toggle */}
      <div
        className={`overlay-toggle${showOverlay ? " active" : ""}`}
        onClick={() => setShowOverlay((v) => !v)}
        title="Toggle broadcast overlay"
      />

      {/* full overlay */}
      <div className={`full-overlay${showOverlay ? " active" : ""}`}>
        <div className="innings-footer">{renderTable()}</div>
        <div className="player-panel">
          <h3>Player Matchup</h3>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ textAlign: "center" }}>
              <img src="/upload.jpg" alt="Hitter" width={80} />
              <br />
              <small>타자: 김강현</small>
            </div>
            <div style={{ textAlign: "center" }}>
              <img src="/upload.jpg" alt="Pitcher" width={80} />
              <br />
              <small>투수: 김도영</small>
            </div>
          </div>
          <h4>Pitch Chart &uarr;</h4>
          <img
            src="/thumbs/highlights.png"
            alt="Pitch chart"
            style={{ width: "100%", borderRadius: 4 }}
          />
          <p style={{ marginTop: 12, fontSize: 12, color: "#ccc" }}>
            스트라이크 존 그래픽 예시—실제 데이터로 교체하세요.
          </p>
        </div>
      </div>
    </>
  );
}
