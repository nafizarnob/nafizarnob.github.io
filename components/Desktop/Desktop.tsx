'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { desktopIcons } from '@/data/projects';
import { AppType, DesktopIcon } from '@/types';

function IconContent({ icon }: { icon: DesktopIcon }) {
  if (icon.id === 'linkedin') {
    return (
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white select-none"
        style={{ background: '#0A66C2', fontSize: '22px', letterSpacing: '-1px' }}
      >
        in
      </div>
    );
  }
  return <span className="text-3xl">{icon.icon}</span>;
}

interface DesktopProps {
  onOpenApp: (app: AppType, appProps?: Record<string, string>) => void;
}

export default function Desktop({ onOpenApp }: DesktopProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [time, setTime] = useState('');
  const lastTap = useRef<Record<string, number>>({});

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-AU', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute inset-0 select-none"
      onClick={() => setSelected(null)}
    >
      {/* Desktop icons */}
      <div className="absolute top-8 left-8 flex flex-col gap-4">
        {desktopIcons.map((icon, i) => (
          <motion.div
            key={icon.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            className="flex flex-col items-center gap-1.5 cursor-pointer group w-20"
            onClick={(e) => {
              e.stopPropagation();
              const now = Date.now();
              const last = lastTap.current[icon.id] ?? 0;
              if (now - last < 400) {
                onOpenApp(icon.app, icon.appProps);
                lastTap.current[icon.id] = 0;
              } else {
                setSelected(icon.id);
                lastTap.current[icon.id] = now;
              }
            }}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                selected === icon.id
                  ? 'bg-blue-500/30 ring-2 ring-blue-400/60'
                  : 'bg-white/5 group-hover:bg-white/10'
              }`}
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <IconContent icon={icon} />
            </div>
            <span
              className={`text-xs text-center leading-tight px-1.5 py-0.5 rounded ${
                selected === icon.id ? 'bg-blue-500 text-white' : 'text-white drop-shadow'
              }`}
              style={{ textShadow: selected === icon.id ? 'none' : '0 1px 3px rgba(0,0,0,0.8)' }}
            >
              {icon.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-16 right-6 text-xs text-white/30 text-right"
      >
        Double-tap or click to open
      </motion.div>
    </div>
  );
}
