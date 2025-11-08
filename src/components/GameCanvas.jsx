import React, { useEffect, useRef } from 'react';

// Flappy-style canvas game with sounds and start/reset via prop
export default function GameCanvas({ onGameOver, onScore, startSignal }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let animationId;
    let lastTime = 0;

    // Game constants
    const gravity = 0.5;
    const flapStrength = -8.6;
    const pipeGap = 180; // widened gap for easier passage
    const pipeWidth = 64;
    const pipeSpeed = 2.35;

    // Sound effects (base64 tiny wavs)
    const flapAudio = new Audio(
      'data:audio/wav;base64,UklGRmSJAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YSCJAAAgAAD/AACAgICQkJCQkJCQkJCUlJSUlJSUlJSUlJSUlJSUlJSUkpKSkpKSkpKSkpKSkpKSkpKSkoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA='
    );
    const hitAudio = new Audio(
      'data:audio/wav;base64,UklGRmSJAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YSBJAAAgAAD/AAAQEBAQEBATExMTExMTExMSEhISEhISEhISDg4ODg4ODg4ODw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw=='
    );

    // World
    const bird = { x: 90, y: 180, r: 14, vy: 0 };
    let pipes = [];
    let score = 0;
    let gameOver = false;
    let bgOffset = 0;

    function reset() {
      pipes = [];
      score = 0;
      gameOver = false;
      bird.y = 180;
      bird.vy = 0;
      bgOffset = 0;
      spawnPipe();
      spawnPipe();
      onScore?.(0);
    }

    function spawnPipe() {
      const topHeight = 40 + Math.random() * 180; // 40..220
      pipes.push({ x: canvas.width + 40, top: topHeight, bottom: topHeight + pipeGap, passed: false });
    }

    function flap() {
      if (gameOver) return;
      bird.vy = flapStrength;
      try { flapAudio.currentTime = 0; flapAudio.play(); } catch {}
    }

    function collide() {
      // Ground/ceiling
      if (bird.y + bird.r >= canvas.height - 24 || bird.y - bird.r <= 0) return true;
      // Pipes
      for (const p of pipes) {
        const inX = bird.x + bird.r > p.x && bird.x - bird.r < p.x + pipeWidth;
        const inY = bird.y - bird.r < p.top || bird.y + bird.r > p.bottom;
        if (inX && inY) return true;
      }
      return false;
    }

    function drawBackground() {
      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#7dd3fc');
      grad.addColorStop(1, '#60a5fa');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Scrolling clouds and hills
      const speed = pipeSpeed * 0.6;
      bgOffset = (bgOffset + speed) % canvas.width;

      // Clouds
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      for (let i = -1; i < 3; i++) {
        const x = i * 240 - bgOffset * 0.6;
        cloud(x, 60);
        cloud(x + 120, 90);
      }

      // Hills
      ctx.fillStyle = '#34d399';
      for (let i = -1; i < 3; i++) {
        const baseX = i * 320 - bgOffset;
        hill(baseX, canvas.height - 40, 180, 18);
        hill(baseX + 160, canvas.height - 42, 120, 14);
      }

      // Ground strip
      ctx.fillStyle = '#059669';
      ctx.fillRect(0, canvas.height - 24, canvas.width, 24);
    }

    function cloud(x, y) {
      ctx.beginPath();
      ctx.arc(x + 20, y, 12, 0, Math.PI * 2);
      ctx.arc(x + 36, y + 6, 14, 0, Math.PI * 2);
      ctx.arc(x + 52, y - 2, 10, 0, Math.PI * 2);
      ctx.arc(x + 68, y + 4, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    function hill(x, y, w, h) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + w / 2, y - h, x + w, y);
      ctx.lineTo(x + w, y + 24);
      ctx.lineTo(x, y + 24);
      ctx.closePath();
      ctx.fill();
    }

    function drawBird() {
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(Math.min(Math.max(bird.vy / 20, -0.4), 0.6));
      // body
      ctx.beginPath();
      ctx.arc(0, 0, bird.r, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      // wing
      ctx.beginPath();
      ctx.arc(-4, 0, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#fde68a';
      ctx.fill();
      // eye
      ctx.beginPath();
      ctx.arc(6, -6, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#111827';
      ctx.fill();
      // beak
      ctx.beginPath();
      ctx.moveTo(bird.r, 0);
      ctx.lineTo(bird.r + 8, 4);
      ctx.lineTo(bird.r, 6);
      ctx.closePath();
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.restore();
    }

    function drawPipes() {
      // pipe gradient
      const pipeGrad = ctx.createLinearGradient(0, 0, pipeWidth, 0);
      pipeGrad.addColorStop(0, '#10b981');
      pipeGrad.addColorStop(1, '#22d3ee');
      ctx.fillStyle = pipeGrad;
      for (const p of pipes) {
        // Top pipe
        ctx.fillRect(p.x, 0, pipeWidth, p.top);
        // Bottom pipe
        ctx.fillRect(p.x, p.bottom, pipeWidth, canvas.height - p.bottom - 24);
      }
    }

    function drawScore() {
      ctx.fillStyle = 'white';
      ctx.font = 'bold 22px Inter, system-ui, -apple-system, Segoe UI, Roboto';
      ctx.fillText(`Score: ${score}`, 16, 30);
    }

    function update() {
      // Bird physics
      bird.vy += gravity;
      bird.y += bird.vy;

      // Move pipes
      for (const p of pipes) {
        p.x -= pipeSpeed;
        if (!p.passed && p.x + pipeWidth < bird.x - bird.r) {
          p.passed = true;
          score += 1;
          onScore?.(score);
        }
      }

      // Remove off-screen, add new
      if (pipes.length && pipes[0].x + pipeWidth < -10) pipes.shift();
      if (!pipes.length || pipes[pipes.length - 1].x < canvas.width - 220) {
        spawnPipe();
      }

      // Collision
      if (collide()) {
        try { hitAudio.currentTime = 0; hitAudio.play(); } catch {}
        gameOver = true;
      }
    }

    function loop(ts) {
      const dt = ts - lastTime; // dt not currently used but kept for potential effects
      lastTime = ts;
      drawBackground();
      if (!gameOver) update();
      drawPipes();
      drawBird();
      drawScore();

      if (gameOver) {
        cancelAnimationFrame(animationId);
        onGameOver?.(score);
        return;
      }

      animationId = requestAnimationFrame(loop);
    }

    function start() {
      reset();
      lastTime = 0;
      animationId = requestAnimationFrame(loop);
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    const handleKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        flap();
      }
    };

    const handleClick = () => {
      flap();
    };

    window.addEventListener('resize', resize);
    window.addEventListener('keydown', handleKey);
    canvas.addEventListener('pointerdown', handleClick);

    // Auto-start when the canvas mounts (i.e., after pressing Play) or when startSignal changes
    start();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKey);
      canvas.removeEventListener('pointerdown', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, [onGameOver, onScore, startSignal]);

  return (
    <canvas ref={canvasRef} className="w-full h-full" />
  );
}
