import React from 'react';
import Spline from '@splinetool/react-spline';

export default function StartScreen({ onStart }) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-6">
      {/* 3D Spline background */}
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/8fw9Z-c-rqW3nWBN/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        {/* soft gradient for readability; let clicks pass through */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
          <span className="bg-gradient-to-br from-emerald-300 via-cyan-300 to-sky-200 bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(16,185,129,0.35)]">
            Lucky The Racer
          </span>
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg text-white/90">
          Help Tota fly through the pillars. Tap, click, or press Space to flap.
        </p>
        <div className="mt-6 md:mt-8 flex items-center justify-center gap-3">
          <button
            onClick={onStart}
            className="px-6 py-3 md:px-7 md:py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 active:scale-[0.99] transition text-black font-semibold shadow-lg shadow-emerald-500/20"
          >
            Play
          </button>
        </div>
      </div>
    </section>
  );
}
