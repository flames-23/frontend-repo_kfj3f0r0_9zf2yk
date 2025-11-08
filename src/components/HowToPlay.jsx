import React from 'react';

export default function HowToPlay() {
  return (
    <section className="px-6 py-10 md:py-14">
      <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
        <h2 className="text-xl font-semibold">How to play</h2>
        <ul className="mt-4 space-y-2 text-gray-300 list-disc list-inside">
          <li>Press Space, click, or tap to flap upwards.</li>
          <li>Avoid the pipes. Touching a pipe or the ground ends the game.</li>
          <li>Survive as long as you can to increase your score.</li>
        </ul>
      </div>
    </section>
  );
}
