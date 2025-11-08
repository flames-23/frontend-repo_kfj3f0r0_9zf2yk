import React from 'react';

export default function Hero({ onStart }) {
  return (
    <section className="min-h-[70vh] flex items-center justify-center text-center px-6">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
          Flappy Tota
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-400">
          Ready to play a quick game? Tap, click, or press space to flap. Dodge the pipes and go for a high score.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={onStart}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] transition text-black font-semibold shadow-lg shadow-emerald-500/20"
          >
            Play
          </button>
        </div>
      </div>
    </section>
  );
}
