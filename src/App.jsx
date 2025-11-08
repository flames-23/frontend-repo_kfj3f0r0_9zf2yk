import React, { useMemo, useState } from 'react';
import StartScreen from './components/StartScreen.jsx';
import GameCanvas from './components/GameCanvas.jsx';
import Scoreboard from './components/Scoreboard.jsx';
import GameOverOverlay from './components/GameOverOverlay.jsx';

function App() {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    const saved = localStorage.getItem('tota_best');
    return saved ? parseInt(saved, 10) : 0;
    // eslint-disable-next-line
  });
  const [gameOver, setGameOver] = useState(false);
  const [startSignal, setStartSignal] = useState(0); // bump to trigger start/reset in canvas

  const leaderboard = useMemo(() => {
    const raw = localStorage.getItem('tota_leaderboard');
    return raw ? JSON.parse(raw) : [];
  }, [gameOver]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setStarted(true);
    setStartSignal((s) => s + 1);
  };

  const handleScore = (s) => {
    setScore(s);
  };

  const handleGameOver = (finalScore) => {
    setGameOver(true);
    // best
    const newBest = Math.max(best, finalScore);
    setBest(newBest);
    localStorage.setItem('tota_best', String(newBest));
    // leaderboard (top 5)
    const raw = localStorage.getItem('tota_leaderboard');
    const list = raw ? JSON.parse(raw) : [];
    list.push({ score: finalScore, at: Date.now() });
    list.sort((a, b) => b.score - a.score);
    const trimmed = list.slice(0, 5);
    localStorage.setItem('tota_leaderboard', JSON.stringify(trimmed));
  };

  const restart = () => {
    startGame();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="px-6 py-5 flex items-center justify-between">
          <div className="text-lg font-semibold">TOTA UDA 🐦</div>
          <div className="text-xs text-gray-400">Tap • Click • Space to flap</div>
        </header>

        {!started && (
          <>
            <StartScreen onStart={startGame} />
            {leaderboard && leaderboard.length > 0 && (
              <section className="px-6 pb-10">
                <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="font-semibold">Top Scores</h3>
                  <ol className="mt-3 space-y-2 text-sm text-gray-300">
                    {leaderboard.map((e, i) => (
                      <li key={e.at} className="flex items-center justify-between">
                        <span className="text-gray-400">#{i + 1}</span>
                        <span className="font-semibold text-white">{e.score}</span>
                        <span className="text-gray-500">{new Date(e.at).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            )}
          </>
        )}

        {started && (
          <section className="px-6 pb-12 space-y-4">
            <Scoreboard score={score} best={best} />
            <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden border border-white/10 bg-[#0b1220]">
              <GameCanvas onScore={handleScore} onGameOver={handleGameOver} startSignal={startSignal} />
              {gameOver && (
                <GameOverOverlay score={score} best={best} onRestart={restart} />)
              }
            </div>
          </section>
        )}

        <footer className="px-6 py-10 text-center text-xs text-gray-500">
          Built for fun — good luck and have a great run!
        </footer>
      </div>
    </div>
  );
}

export default App;
