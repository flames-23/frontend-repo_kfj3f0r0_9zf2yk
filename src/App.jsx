import React, { useState } from 'react';
import Hero from './components/Hero.jsx';
import HowToPlay from './components/HowToPlay.jsx';
import GameCanvas from './components/GameCanvas.jsx';
import Scoreboard from './components/Scoreboard.jsx';

function App() {
  const [showGame, setShowGame] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const startGame = () => {
    setShowGame(true);
  };

  const handleScore = (s) => {
    setScore(s);
    if (s > best) setBest(s);
  };

  const handleGameOver = (finalScore) => {
    if (finalScore > best) setBest(finalScore);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="px-6 py-5 flex items-center justify-between">
          <div className="text-lg font-semibold">Flappy Tota</div>
          <div className="text-xs text-gray-400">Tap • Click • Space to flap</div>
        </header>

        {!showGame && <Hero onStart={startGame} />}

        <section className="px-6 pb-12 space-y-6">
          <Scoreboard score={score} best={best} />
          <GameCanvas onScore={handleScore} onGameOver={handleGameOver} />
        </section>

        <HowToPlay />

        <footer className="px-6 py-10 text-center text-xs text-gray-500">
          Built for fun — good luck and have a great run!
        </footer>
      </div>
    </div>
  );
}

export default App;
