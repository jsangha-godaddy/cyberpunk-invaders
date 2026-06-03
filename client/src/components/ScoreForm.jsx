import { useState } from 'react';

export default function ScoreForm({ score, onSubmit, onSkip }) {
  const [name, setName] = useState('');
  const [rank, setRank] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), score }),
      });
      const data = await res.json();
      setRank(data);
    } catch {
      // server offline — skip silently
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Game Over</h2>
        <div className="score-display">{score.toLocaleString()}</div>

        {rank ? (
          <>
            <p className="rank-message">
              YOU RANKED #{rank.rank} OF {rank.total} OPERATORS
            </p>
            <button className="btn" onClick={() => onSubmit('leaderboard')}>View Leaderboard</button>
            <button className="btn magenta" onClick={() => onSubmit('play')}>Play Again</button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              autoFocus
              maxLength={20}
              placeholder="ENTER YOUR NAME"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <div>
              <button className="btn" type="submit" disabled={submitting || !name.trim()}>
                {submitting ? 'UPLOADING...' : 'SUBMIT SCORE'}
              </button>
              <button className="btn magenta" type="button" onClick={onSkip}>
                Skip
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
