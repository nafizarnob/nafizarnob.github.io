'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WindowState, AppType } from '@/types';

const APP_ICONS: Record<AppType, string> = {
  projects: '📁',
  about: '👤',
  terminal: '💻',
  browser: '🌐',
  flappy: '🐦',
  orchestration: '🤖',
};

interface TaskbarProps {
  windows: WindowState[];
  onOpenApp: (app: AppType) => void;
  onFocusWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
}

export default function Taskbar({ windows, onOpenApp, onFocusWindow, onMinimizeWindow }: TaskbarProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true }));
      setDate(now.toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Start menu */}
      {startOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bottom-14 left-2 w-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-[9999]"
          style={{ background: '#1e2030', backdropFilter: 'blur(20px)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-white/5">
            <p className="font-semibold text-white">Nafiz OS</p>
            <p className="text-xs text-gray-400">Product Consultant & Developer</p>
          </div>
          <div className="p-2">
            {([
              ['projects', 'Projects'],
              ['about', 'About Me'],
              ['terminal', 'Terminal'],
              ['flappy', 'Flappy Bird'],
            ] as [AppType, string][]).map(([app, label]) => (
              <button
                key={app}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-200 hover:bg-white/5 transition-all"
                onClick={() => { onOpenApp(app); setStartOpen(false); }}
              >
                <span className="text-xl">{APP_ICONS[app]}</span>
                {label}
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-white/5">
            <a
              href="mailto:mdnafizakter@gmail.com"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/5 transition-all"
            >
              ✉️ mdnafizakter@gmail.com
            </a>
          </div>
        </motion.div>
      )}

      {/* Taskbar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 flex items-center px-2 gap-1 z-[9000]"
        style={{ background: 'rgba(15, 16, 26, 0.85)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
        onClick={() => setStartOpen(false)}
      >
        {/* Start button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => { e.stopPropagation(); setStartOpen((v) => !v); }}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
            startOpen ? 'bg-blue-600/40 shadow-[0_0_12px_rgba(96,165,250,0.25)]' : 'hover:bg-white/10'
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="7" height="7" rx="1.5" fill={startOpen ? '#60a5fa' : '#7aa2f7'} opacity="0.9"/>
            <rect x="10" y="1" width="7" height="7" rx="1.5" fill={startOpen ? '#60a5fa' : '#7aa2f7'} opacity="0.6"/>
            <rect x="1" y="10" width="7" height="7" rx="1.5" fill={startOpen ? '#60a5fa' : '#7aa2f7'} opacity="0.6"/>
            <rect x="10" y="10" width="7" height="7" rx="1.5" fill={startOpen ? '#60a5fa' : '#7aa2f7'} opacity="0.35"/>
          </svg>
        </motion.button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Open windows */}
        <div className="flex items-center gap-1 flex-1">
          {windows.map((win) => (
            <motion.button
              key={win.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                if (win.isFocused && !win.isMinimized) {
                  onMinimizeWindow(win.id);
                } else {
                  onFocusWindow(win.id);
                }
              }}
              className={`flex items-center gap-2 px-3 h-8 rounded-lg text-xs font-medium transition-all max-w-36 ${
                win.isFocused && !win.isMinimized
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30'
                  : win.isMinimized
                  ? 'bg-white/5 text-gray-500 border border-white/5'
                  : 'bg-white/8 text-gray-300 border border-white/5'
              }`}
            >
              <span>{APP_ICONS[win.app]}</span>
              <span className="truncate">{win.title}</span>
              {!win.isMinimized && (
                <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
              )}
            </motion.button>
          ))}
        </div>

        {/* Clock */}
        <div className="text-right ml-auto pr-2">
          <p className="text-xs font-medium text-gray-200 leading-none">{time}</p>
          <p className="text-[10px] text-gray-500 leading-none mt-0.5">{date}</p>
        </div>
      </div>
    </>
  );
}
