import { useEffect, useState } from 'react';

export default function Leaderboard({ onPlay }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/scores')
      .then(r => r.json())
      .then(data => { setScores(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="leaderboard">
      <h2>Top Operators</h2>
      {loading ? (
        <p className="empty-state">LOADING...</p>
      ) : scores.length === 0 ? (
        <p className="empty-state">NO SCORES YET. BE THE FIRST.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th className="rank-col">#</th>
              <th>Operator</th>
              <th className="score-col">Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr key={i}>
                <td className="rank-col">{i + 1}</td>
                <td>{s.name}</td>
                <td className="score-col">{s.score.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button className="btn" onClick={onPlay}>Play Again</button>
      </div>
    </div>
  );
}
