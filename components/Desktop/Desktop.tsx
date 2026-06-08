'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { desktopIcons } from '@/data/projects';
import { AppType, DesktopIcon } from '@/types';
import StickyNotes from '@/components/Desktop/StickyNotes';

const DESKTOP_ICON_SVG: Record<string, React.ReactNode> = {
  projects: (
    <svg width="32" height="28" viewBox="0 0 30 26" fill="none">
      <path d="M2 6C2 4.34 3.34 3 5 3H12L15 6H25C26.66 6 28 7.34 28 9V21C28 22.66 26.66 24 25 24H5C3.34 24 2 22.66 2 21V6Z" fill="#FFD43B"/>
      <path d="M2 10H28V21C28 22.66 26.66 24 25 24H5C3.34 24 2 22.66 2 21V10Z" fill="#FCC419"/>
    </svg>
  ),
  terminal: (
    <svg width="30" height="24" viewBox="0 0 28 22" fill="none">
      <rect x="1" y="1" width="26" height="20" rx="3" fill="#0D1117" stroke="#30363D" strokeWidth="1.5"/>
      <path d="M6 7L10 11L6 15" stroke="#3FB950" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 15H20" stroke="#8B949E" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  flappy: (
    <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="12" fill="#FDE047"/>
      <circle cx="17" cy="10" r="2.5" fill="#1a1a2e"/>
      <circle cx="17.5" cy="9.2" r="0.8" fill="#fff"/>
      <path d="M20 14C22 13 24 14 24 14L20 15Z" fill="#F97316"/>
      <path d="M8 18C10 22 18 22 20 18" stroke="#1a1a2e" strokeWidth="1" fill="none"/>
    </svg>
  ),
};

function IconContent({ icon }: { icon: DesktopIcon }) {
  if (icon.id === 'about') {
    return (
      <img
        src="/avatar.jpg"
        alt="About Me"
        className="w-full h-full object-cover"
        style={{ borderRadius: '16px' }}
      />
    );
  }
  if (icon.id === 'linkedin') {
    return (
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white select-none"
        style={{ background: '#0A66C2', fontSize: '22px', letterSpacing: '-1px', fontFamily: 'Georgia, serif' }}
      >
        in
      </div>
    );
  }
  if (DESKTOP_ICON_SVG[icon.id]) {
    return <>{DESKTOP_ICON_SVG[icon.id]}</>;
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
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                selected === icon.id
                  ? 'bg-blue-500/30 ring-2 ring-blue-400/60'
                  : 'bg-white/5 group-hover:bg-white/15 group-hover:shadow-[0_0_20px_rgba(122,162,247,0.12)]'
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

      {/* Sticky notes */}
      <StickyNotes />

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
