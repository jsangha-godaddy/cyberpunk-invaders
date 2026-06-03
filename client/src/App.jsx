import { useState, useCallback } from 'react';
import Game from './components/Game.jsx';
import ScoreForm from './components/ScoreForm.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Skyline from './components/Skyline.jsx';

export default function App() {
  const [view, setView] = useState('playing'); // 'playing' | 'gameover' | 'leaderboard'
  const [finalScore, setFinalScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  const handleGameOver = useCallback((score) => {
    setFinalScore(score);
    setView('gameover');
  }, []);

  function restartGame() {
    setGameKey(k => k + 1);
    setView('playing');
  }

  function handleScoreFormAction(action) {
    if (action === 'leaderboard') setView('leaderboard');
    else restartGame();
  }

  return (
    <div className="app">
      <div className="title">Cyberpunk Invaders</div>
      <div className="subtitle">// DEFEND THE GRID //</div>

      {view === 'leaderboard' ? (
        <Leaderboard onPlay={restartGame} />
      ) : (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Skyline />
          <Game key={gameKey} onGameOver={handleGameOver} />
          {view === 'gameover' && (
            <ScoreForm
              score={finalScore}
              onSubmit={handleScoreFormAction}
              onSkip={restartGame}
            />
          )}
        </div>
      )}

      {view === 'playing' && (
        <p className="controls-hint">
          ← → MOVE &nbsp;|&nbsp; SPACE FIRE &nbsp;|&nbsp;
          <span
            style={{ color: 'rgba(0,255,255,0.4)', cursor: 'pointer' }}
            onClick={() => setView('leaderboard')}
          >
            LEADERBOARD
          </span>
        </p>
      )}
    </div>
  );
}
