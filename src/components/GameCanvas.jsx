import React, { useEffect, useRef, useState } from 'react';

// A lightweight Flappy Bird-like canvas game
export default function GameCanvas({ onGameOver, onScore }) {
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let animationId;
    let lastTime = 0;

    // Game constants
    const gravity = 0.5;
    const flapStrength = -8.5;
    const pipeGap = 120;
    const pipeWidth = 60;
    const pipeSpeed = 2.2;

    // World
    const bird = { x: 80, y: 180, r: 14, vy: 0 };
    let pipes = [];
    let score = 0;
    let gameOver = false;

    function reset() {
      pipes = [];
      score = 0;
      gameOver = false;
      bird.y = 180;
      bird.vy = 0;
      spawnPipe();
      spawnPipe();
    }

    function spawnPipe() {
      const topHeight = 40 + Math.random() * 160; // 40..200
      pipes.push({ x: canvas.width + 40, top: topHeight, bottom: topHeight + pipeGap, passed: false });
    }

    function flap() {
      if (gameOver) return;
      bird.vy = flapStrength;
    }

    function collide() {
      // Ground/ceiling
      if (bird.y + bird.r >= canvas.height - 20 || bird.y - bird.r <= 0) return true;
      // Pipes
      for (const p of pipes) {
        const inX = bird.x + bird.r > p.x && bird.x - bird.r < p.x + pipeWidth;
        const inY = bird.y - bird.r < p.top || bird.y + bird.r > p.bottom;
        if (inX && inY) return true;
      }
      return false;
    }

    function drawBackground() {
      // Sky
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#0b1220');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ground
      ctx.fillStyle = '#0a0f1a';
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    }

    function drawBird() {
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.beginPath();
      ctx.arc(0, 0, bird.r, 0, Math.PI * 2);
      ctx.fillStyle = '#34d399';
      ctx.fill();
      // Eye
      ctx.beginPath();
      ctx.arc(5, -5, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#111827';
      ctx.fill();
      // Beak
      ctx.beginPath();
      ctx.moveTo(bird.r, 0);
      ctx.lineTo(bird.r + 8, 4);
      ctx.lineTo(bird.r, 6);
      ctx.closePath();
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.restore();
    }

    function drawPipes() {
      ctx.fillStyle = '#22d3ee';
      for (const p of pipes) {
        // Top pipe
        ctx.fillRect(p.x, 0, pipeWidth, p.top);
        // Bottom pipe
        ctx.fillRect(p.x, p.bottom, pipeWidth, canvas.height - p.bottom - 20);
      }
    }

    function drawScore() {
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px Inter, system-ui, -apple-system, Segoe UI, Roboto';
      ctx.fillText(`Score: ${score}`, 16, 28);
    }

    function update(dt) {
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
      if (!pipes.length || pipes[pipes.length - 1].x < canvas.width - 200) {
        spawnPipe();
      }

      // Collision
      if (collide()) {
        gameOver = true;
      }
    }

    function loop(ts) {
      const dt = ts - lastTime;
      lastTime = ts;
      drawBackground();
      if (!gameOver) update(dt);
      drawPipes();
      drawBird();
      drawScore();

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 22px Inter, system-ui, -apple-system, Segoe UI, Roboto';
        const message = 'Tota Uda nhi paaya tu Zindagi me ky karega';
        const metrics = ctx.measureText(message);
        ctx.fillText(message, (canvas.width - metrics.width) / 2, canvas.height / 2);
        cancelAnimationFrame(animationId);
        onGameOver?.(score);
        setRunning(false);
        return;
      }

      animationId = requestAnimationFrame(loop);
    }

    function start() {
      reset();
      setRunning(true);
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
        if (!running) start();
        else flap();
      }
    };

    const handleClick = () => {
      if (!running) start();
      else flap();
    };

    window.addEventListener('resize', resize);
    window.addEventListener('keydown', handleKey);
    canvas.addEventListener('pointerdown', handleClick);

    // Start on first click/space, show idle state first
    drawBackground();
    drawPipes();
    drawBird();
    drawScore();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKey);
      canvas.removeEventListener('pointerdown', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, [onGameOver, onScore, running]);

  return (
    <div className="w-full aspect-[3/2] rounded-2xl overflow-hidden border border-white/10 bg-[#0b1220]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
