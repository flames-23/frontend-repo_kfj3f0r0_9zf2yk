import React from 'react';

export default function GameOverOverlay({ score, best, onRestart }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-black/70 p-6 text-center backdrop-blur">
        <h3 className="text-2xl font-bold">Game Over</h3>
        <p className="mt-2 text-sm text-gray-300">Tota Uda nhi paaya tu Zindagi me ky karega</p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
            Score: <span className="font-semibold text-white">{score}</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
            Best: <span className="font-semibold text-emerald-400">{best}</span>
          </div>
        </div>
        <button
          onClick={onRestart}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-black transition hover:bg-emerald-400"
        >
          Restart
        </button>
      </div>
    </div>
  );
}
