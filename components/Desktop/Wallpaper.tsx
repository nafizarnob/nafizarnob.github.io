'use client';

import { useRef, useEffect } from 'react';

const COLS = 10;
const ROWS = 7;

export default function Wallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: (COLS + 1) * (ROWS + 1) }, (_, i) => ({
      col: i % (COLS + 1),
      row: Math.floor(i / (COLS + 1)),
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      speed: 0.25 + Math.random() * 0.35,
    }));

    let t = 0;
    const baseHue = { current: 210 };
    const targetHue = { current: 210 };

    const handleClick = () => {
      targetHue.current = Math.random() * 360;
    };
    window.addEventListener('click', handleClick);

    const draw = () => {
      t += 0.003;

      // Smoothly lerp hue, handling 360° wrap-around
      let diff = targetHue.current - baseHue.current;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      baseHue.current = ((baseHue.current + diff * 0.018) + 360) % 360;

      const W = canvas.width;
      const H = canvas.height;
      const cw = W / COLS;
      const ch = H / ROWS;

      ctx.fillStyle = '#040710';
      ctx.fillRect(0, 0, W, H);

      const pos = pts.map((p) => ({
        x: p.col * cw + Math.sin(t * p.speed + p.phaseX) * cw * 0.38,
        y: p.row * ch + Math.cos(t * p.speed * 0.75 + p.phaseY) * ch * 0.38,
      }));

      const drawTri = (a: number, b: number, d: number) => {
        const pa = pos[a], pb = pos[b], pd = pos[d];
        const cx = (pa.x + pb.x + pd.x) / 3 / W;
        const cy = (pa.y + pb.y + pd.y) / 3 / H;
        const hue = baseHue.current + cx * 65 + Math.sin(t * 0.4 + cy * Math.PI) * 20;
        const lum = 7 + cy * 11 + Math.sin(t * 0.55 + cx * Math.PI * 2) * 3;
        const sat = 55 + Math.cos(t * 0.45 + cx * Math.PI) * 22;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.lineTo(pd.x, pd.y);
        ctx.closePath();
        ctx.fillStyle = `hsl(${hue},${sat}%,${lum}%)`;
        ctx.fill();
        ctx.strokeStyle = `hsl(${hue},${sat}%,${lum + 5}%)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      };

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const tl = r * (COLS + 1) + c;
          const tr = tl + 1;
          const bl = tl + COLS + 1;
          const br = bl + 1;
          drawTri(tl, tr, bl);
          drawTri(tr, br, bl);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: 'transform' }}
      />
      {/* Scanlines */}
      <div className="scanlines" />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.65) 100%)' }}
      />
      {/* Taskbar glow line */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: '48px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(99,179,237,0.12) 20%, rgba(99,179,237,0.28) 50%, rgba(99,179,237,0.12) 80%, transparent 100%)',
        }}
      />
    </div>
  );
}
