import React from 'react';

export default function Scoreboard({ score, best }) {
  return (
    <div className="flex items-center justify-center gap-4 text-sm text-gray-300">
      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
        Current: <span className="font-semibold text-white">{score}</span>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
        Best: <span className="font-semibold text-emerald-400">{best}</span>
      </div>
    </div>
  );
}
