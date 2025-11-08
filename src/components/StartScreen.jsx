import React from 'react';

export default function StartScreen({ onStart }) {
  return (
    <section className="min-h-[70vh] flex items-center justify-center text-center px-6">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-cyan-400 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
          TOTA UDA 🐦
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-300">
          Tap, click, or press Space to help Tota fly through the pipes. Smooth, colorful, and mobile-friendly.
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
