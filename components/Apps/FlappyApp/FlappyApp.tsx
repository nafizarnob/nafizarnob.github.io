'use client';

import { useEffect, useRef, useCallback } from 'react';
import { AppComponentProps } from '@/types';

const GRAVITY = 0.38;
const FLAP = -7.5;
const PIPE_SPEED = 2.8;
const PIPE_GAP = 148;
const PIPE_W = 54;
const PIPE_INTERVAL = 1700;
const BIRD_X = 90;
const BIRD_R = 13;

interface Pipe { x: number; topH: number; scored: boolean; }
type GameState = 'idle' | 'playing' | 'dead';

interface State {
  bird: { y: number; vy: number; angle: number };
  pipes: Pipe[];
  score: number;
  best: number;
  gs: GameState;
  lastPipe: number;
  raf: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function FlappyApp(_props: AppComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<State>({
    bird: { y: 0, vy: 0, angle: 0 },
    pipes: [],
    score: 0,
    best: 0,
    gs: 'idle',
    lastPipe: 0,
    raf: 0,
  });

  const reset = useCallback((canvas: HTMLCanvasElement) => {
    const s = stateRef.current;
    s.bird = { y: canvas.height / 2, vy: 0, angle: 0 };
    s.pipes = [];
    s.score = 0;
    s.gs = 'playing';
    s.lastPipe = performance.now();
  }, []);

  const action = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = stateRef.current;
    if (s.gs === 'idle' || s.gs === 'dead') {
      reset(canvas);
    } else {
      s.bird.vy = FLAP;
    }
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      const r = container.getBoundingClientRect();
      canvas.width = Math.floor(r.width);
      canvas.height = Math.floor(r.height);
      const s = stateRef.current;
      if (s.gs === 'idle') s.bird.y = canvas.height / 2;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const draw = (ts: number) => {
      const s = stateRef.current;
      const W = canvas.width;
      const H = canvas.height;

      // ── Background ──
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#03050e');
      bg.addColorStop(1, '#0a0f2e');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(56,189,248,0.04)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // ── Physics ──
      if (s.gs === 'playing') {
        s.bird.vy += GRAVITY;
        s.bird.y += s.bird.vy;
        s.bird.angle = Math.min(Math.max(s.bird.vy * 0.07, -0.5), 1.3);

        // Spawn pipes
        if (ts - s.lastPipe > PIPE_INTERVAL) {
          const minH = 50;
          const maxH = H - PIPE_GAP - minH - 40;
          const topH = Math.random() * (maxH - minH) + minH;
          s.pipes.push({ x: W + PIPE_W, topH, scored: false });
          s.lastPipe = ts;
        }

        // Move pipes + score
        for (const p of s.pipes) {
          p.x -= PIPE_SPEED;
          if (!p.scored && p.x + PIPE_W < BIRD_X - BIRD_R) {
            p.scored = true;
            s.score++;
            if (s.score > s.best) s.best = s.score;
          }
        }
        s.pipes = s.pipes.filter(p => p.x > -PIPE_W - 10);

        // Ground / ceiling
        if (s.bird.y - BIRD_R < 0 || s.bird.y + BIRD_R > H - 32) {
          s.gs = 'dead';
        }

        // Pipe collision
        for (const p of s.pipes) {
          const inX = BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + PIPE_W;
          if (inX && (s.bird.y - BIRD_R < p.topH || s.bird.y + BIRD_R > p.topH + PIPE_GAP)) {
            s.gs = 'dead';
          }
        }
      }

      // ── Draw ground ──
      ctx.fillStyle = '#0e1628';
      ctx.fillRect(0, H - 32, W, 32);
      ctx.fillStyle = '#1e3a5f';
      ctx.fillRect(0, H - 32, W, 2);

      // ── Draw pipes ──
      for (const p of s.pipes) {
        // Pipe gradient
        const pg = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
        pg.addColorStop(0, '#0c4a6e');
        pg.addColorStop(0.35, '#0891b2');
        pg.addColorStop(0.65, '#0891b2');
        pg.addColorStop(1, '#0c4a6e');

        // Top pipe body
        ctx.fillStyle = pg;
        ctx.fillRect(p.x, 0, PIPE_W, p.topH - 14);
        // Top pipe cap
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.roundRect(p.x - 5, p.topH - 14, PIPE_W + 10, 14, [0, 0, 3, 3]);
        ctx.fill();

        // Bottom pipe body
        ctx.fillStyle = pg;
        ctx.fillRect(p.x, p.topH + PIPE_GAP + 14, PIPE_W, H);
        // Bottom pipe cap
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.roundRect(p.x - 5, p.topH + PIPE_GAP, PIPE_W + 10, 14, [3, 3, 0, 0]);
        ctx.fill();

        // Glow edges
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 6;
        ctx.strokeStyle = 'rgba(34,211,238,0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(p.x, 0, PIPE_W, p.topH - 14);
        ctx.strokeRect(p.x, p.topH + PIPE_GAP + 14, PIPE_W, H - p.topH - PIPE_GAP - 14);
        ctx.shadowBlur = 0;
      }

      // ── Draw bird ──
      const bx = BIRD_X;
      const by = s.bird.y;
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(s.bird.angle);

      // Glow halo
      const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, BIRD_R * 2.5);
      halo.addColorStop(0, 'rgba(251,191,36,0.35)');
      halo.addColorStop(1, 'transparent');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0, 0, BIRD_R * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
      const bodyGrad = ctx.createRadialGradient(-3, -3, 0, 0, 0, BIRD_R);
      bodyGrad.addColorStop(0, '#fde68a');
      bodyGrad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Wing
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(-3, 3, 7, 4, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(5, -3, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(6, -4, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(BIRD_R - 2, 0);
      ctx.lineTo(BIRD_R + 7, -2);
      ctx.lineTo(BIRD_R + 7, 3);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // ── Score ──
      if (s.gs === 'playing') {
        ctx.textAlign = 'center';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'white';
        ctx.font = 'bold 30px monospace';
        ctx.fillText(String(s.score), W / 2, 52);
        ctx.shadowBlur = 0;
      }

      // ── Overlays ──
      if (s.gs === 'idle') {
        ctx.fillStyle = 'rgba(3,5,14,0.55)';
        ctx.fillRect(0, 0, W, H);

        ctx.textAlign = 'center';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 16;
        ctx.fillStyle = '#7dd3fc';
        ctx.font = 'bold 26px monospace';
        ctx.fillText('FLAPPY NAFIZ', W / 2, H / 2 - 38);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '13px monospace';
        ctx.fillText('Click · Space · Tap to play', W / 2, H / 2 + 2);

        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.font = '11px monospace';
        ctx.fillText('Avoid the pipes. Don\'t crash.', W / 2, H / 2 + 26);
      }

      if (s.gs === 'dead') {
        ctx.fillStyle = 'rgba(3,5,14,0.7)';
        ctx.fillRect(0, 0, W, H);

        ctx.textAlign = 'center';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 24px monospace';
        ctx.fillText('GAME OVER', W / 2, H / 2 - 58);
        ctx.shadowBlur = 0;

        // Score card
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.beginPath();
        ctx.roundRect(W / 2 - 90, H / 2 - 42, 180, 80, 10);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px monospace';
        ctx.fillText('SCORE', W / 2 - 42, H / 2 - 20);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 28px monospace';
        ctx.fillText(String(s.score), W / 2 - 42, H / 2 + 12);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px monospace';
        ctx.fillText('BEST', W / 2 + 42, H / 2 - 20);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 28px monospace';
        ctx.fillText(String(s.best), W / 2 + 42, H / 2 + 12);

        ctx.fillStyle = '#64748b';
        ctx.font = '12px monospace';
        ctx.fillText('Click · Space to restart', W / 2, H / 2 + 52);
      }

      s.raf = requestAnimationFrame(draw);
    };

    stateRef.current.raf = requestAnimationFrame(draw);

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); action(); }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(stateRef.current.raf);
      window.removeEventListener('keydown', onKey);
      ro.disconnect();
    };
  }, [action]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-pointer select-none"
      onClick={action}
      style={{ background: '#03050e' }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
