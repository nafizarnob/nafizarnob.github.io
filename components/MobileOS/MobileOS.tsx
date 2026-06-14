'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Wallpaper from '@/components/Desktop/Wallpaper';
import StickyNotes from '@/components/Desktop/StickyNotes';
import ProjectsViewer from '@/components/Apps/ProjectsViewer/ProjectsViewer';
import AboutApp from '@/components/Apps/AboutApp/AboutApp';
import TerminalApp from '@/components/Apps/TerminalApp/TerminalApp';
import BrowserApp from '@/components/Apps/BrowserApp/BrowserApp';
import FlappyApp from '@/components/Apps/FlappyApp/FlappyApp';
import OrchestrationApp from '@/components/Apps/OrchestrationApp/OrchestrationApp';
import { AppType } from '@/types';

// ── SVG Icons (cross-platform, no emoji rendering issues) ───────
const FolderIcon = () => (
  <svg width="30" height="26" viewBox="0 0 30 26" fill="none">
    <path d="M2 6C2 4.34 3.34 3 5 3H12L15 6H25C26.66 6 28 7.34 28 9V21C28 22.66 26.66 24 25 24H5C3.34 24 2 22.66 2 21V6Z" fill="#FFD43B"/>
    <path d="M2 10H28V21C28 22.66 26.66 24 25 24H5C3.34 24 2 22.66 2 21V10Z" fill="#FCC419"/>
  </svg>
);

const LinkedInIcon = () => (
  <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 24, color: '#fff', letterSpacing: -1 }}>
    in
  </span>
);

const TermIcon = () => (
  <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
    <rect x="1" y="1" width="26" height="20" rx="3" fill="#0D1117" stroke="#30363D" strokeWidth="1.5"/>
    <path d="M6 7L10 11L6 15" stroke="#3FB950" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 15H20" stroke="#8B949E" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const BirdIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="12" fill="#FDE047"/>
    <circle cx="17" cy="10" r="2.5" fill="#1a1a2e"/>
    <circle cx="17.5" cy="9.2" r="0.8" fill="#fff"/>
    <path d="M20 14C22 13 24 14 24 14L20 15Z" fill="#F97316"/>
    <path d="M8 18C10 22 18 22 20 18" stroke="#1a1a2e" strokeWidth="1" fill="none"/>
  </svg>
);

const AgentIcon = () => (
  <svg width="28" height="26" viewBox="0 0 30 28" fill="none">
    <circle cx="9" cy="14" r="5" fill="#1a1a2e" stroke="#D9A441" strokeWidth="1.5"/>
    <circle cx="22" cy="8" r="4" fill="#1a1a2e" stroke="#9B8CFF" strokeWidth="1.5"/>
    <circle cx="22" cy="20" r="4" fill="#1a1a2e" stroke="#58C39A" strokeWidth="1.5"/>
    <path d="M14 12L18 9" stroke="#D9A441" strokeWidth="1" strokeDasharray="2 2"/>
    <path d="M14 16L18 19" stroke="#58C39A" strokeWidth="1" strokeDasharray="2 2"/>
  </svg>
);

// ── App registry ────────────────────────────────────────────────
interface MobileApp {
  id: string;
  label: string;
  appType: AppType;
  appProps?: Record<string, string>;
  gradient: string;
  icon: React.ReactNode;
}

const APPS: MobileApp[] = [
  {
    id: 'projects',
    label: 'Projects',
    appType: 'projects',
    gradient: 'linear-gradient(145deg, #1d4ed8, #60a5fa)',
    icon: <FolderIcon />,
  },
  {
    id: 'about',
    label: 'About Me',
    appType: 'about',
    gradient: 'linear-gradient(145deg, #7c3aed, #c084fc)',
    icon: (
      <img
        src="/avatar.jpg"
        alt="About Me"
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '22%' }}
      />
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    appType: 'browser',
    appProps: { url: '/linkedin-profile.html', title: 'LinkedIn — Nafiz Arnob' },
    gradient: 'linear-gradient(145deg, #004e7c, #0a66c2)',
    icon: <LinkedInIcon />,
  },
  {
    id: 'terminal',
    label: 'Terminal',
    appType: 'terminal',
    gradient: 'linear-gradient(145deg, #0f2417, #166534)',
    icon: <TermIcon />,
  },
  {
    id: 'flappy',
    label: 'Flappy Bird',
    appType: 'flappy',
    gradient: 'linear-gradient(145deg, #0369a1, #38bdf8)',
    icon: <BirdIcon />,
  },
  {
    id: 'orchestration',
    label: 'AI Agents',
    appType: 'orchestration',
    gradient: 'linear-gradient(145deg, #3a2a10, #D9A441)',
    icon: <AgentIcon />,
  },
];

const DOCK_IDS = ['projects', 'about', 'linkedin', 'flappy'];

const APP_COMPONENTS: Record<AppType, React.ComponentType<any>> = {
  projects: ProjectsViewer,
  about: AboutApp,
  terminal: TerminalApp,
  browser: BrowserApp,
  flappy: FlappyApp,
  orchestration: OrchestrationApp,
};

const APP_TITLE: Record<string, string> = {
  projects: 'Projects',
  about: 'About Me',
  linkedin: 'LinkedIn',
  terminal: 'Terminal',
  flappy: 'Flappy Bird',
  browser: 'Browser',
  orchestration: 'AI Agents',
};

// ── Sub-components ───────────────────────────────────────────────
function StatusBar({ time }: { time: string }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between"
      style={{ height: 50, paddingLeft: 24, paddingRight: 20, paddingTop: 10 }}
    >
      <span className="text-white font-semibold text-[15px]" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)', fontFeatureSettings: '"tnum"', letterSpacing: '0.02em' }}>
        {time}
      </span>
      <div className="flex items-center gap-[5px]">
        <svg width="18" height="13" viewBox="0 0 18 13" fill="white" opacity={0.9}>
          <rect x="0" y="9" width="3" height="4" rx="0.8"/>
          <rect x="5" y="6" width="3" height="7" rx="0.8"/>
          <rect x="10" y="3" width="3" height="10" rx="0.8"/>
          <rect x="15" y="0" width="3" height="13" rx="0.8"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" opacity={0.9}>
          <circle cx="8" cy="11" r="1.4" fill="white"/>
          <path d="M4.2 7.5A5.3 5.3 0 018 6a5.3 5.3 0 013.8 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M1.5 4.5A9.1 9.1 0 018 2.5a9.1 9.1 0 016.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div className="flex items-center">
          <div style={{ width: 24, height: 12, border: '1.5px solid rgba(255,255,255,0.85)', borderRadius: 3.5, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 1.5, right: '15%', background: 'white', borderRadius: 1.5 }} />
          </div>
          <div style={{ width: 2, height: 5, background: 'rgba(255,255,255,0.7)', borderRadius: '0 1px 1px 0', marginLeft: 1 }} />
        </div>
      </div>
    </div>
  );
}

function AppIcon({ app, onOpen, small = false }: { app: MobileApp; onOpen: () => void; small?: boolean }) {
  const size = small ? 52 : 60;
  const isPhoto = app.id === 'about';
  return (
    <div className="flex flex-col items-center" style={{ gap: 6 }} onClick={onOpen}>
      <motion.div
        whileTap={{ scale: 0.82 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{
          width: size,
          height: size,
          borderRadius: '22%',
          background: isPhoto ? 'transparent' : app.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 18px rgba(0,0,0,0.45)',
          overflow: 'hidden',
        }}
      >
        {app.icon}
      </motion.div>
      {!small && (
        <span
          className="text-white text-center font-medium"
          style={{
            fontSize: 11,
            textShadow: '0 1px 5px rgba(0,0,0,0.9)',
            maxWidth: 72,
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {app.label}
        </span>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
interface OpenApp {
  id: string;
  appType: AppType;
  appProps?: Record<string, string>;
}

export default function MobileOS() {
  const [openApp, setOpenApp] = useState<OpenApp | null>(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    update();
    const interval = setInterval(update, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = (app: MobileApp) => {
    setOpenApp({ id: app.id, appType: app.appType, appProps: app.appProps });
  };

  const handleOpenByType = (appType: AppType, props?: Record<string, string>) => {
    const app = APPS.find(a => a.appType === appType && (!props?.url || a.appProps?.url === props.url));
    setOpenApp({ id: app?.id ?? appType, appType, appProps: props });
  };

  const dockApps = APPS.filter(a => DOCK_IDS.includes(a.id));
  const AppComp = openApp ? APP_COMPONENTS[openApp.appType] : null;
  const appTitle = openApp ? (APP_TITLE[openApp.id] ?? openApp.appProps?.title ?? 'App') : '';

  return (
    <div className="fixed inset-0" style={{ background: '#060810', overflow: 'hidden' }}>
      <Wallpaper />
      <StatusBar time={time} />

      <div className="absolute left-0 right-0" style={{ top: 56, bottom: 110, overflowY: 'auto', padding: '12px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '28px 8px', justifyItems: 'center' }}>
          {APPS.map((app) => (
            <AppIcon key={app.id} app={app} onOpen={() => handleOpen(app)} />
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center">
          <StickyNotes inline />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10" style={{ padding: '0 16px 20px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.14)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 28,
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
          {dockApps.map((app) => (
            <AppIcon key={app.id} app={app} onOpen={() => handleOpen(app)} small />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <div style={{ width: 120, height: 4, background: 'rgba(255,255,255,0.55)', borderRadius: 4 }} />
        </div>
      </div>

      <AnimatePresence>
        {openApp && AppComp && (
          <motion.div
            key={openApp.id + (openApp.appProps?.url ?? '')}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: '#1a1b26' }}
          >
            <div
              className="shrink-0 flex items-center justify-between border-b border-white/10"
              style={{
                background: 'rgba(20,21,36,0.96)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                paddingTop: 50,
                paddingBottom: 12,
                paddingLeft: 16,
                paddingRight: 16,
              }}
            >
              <button
                onClick={() => setOpenApp(null)}
                className="flex items-center gap-1 font-medium"
                style={{ color: '#60a5fa', fontSize: 16 }}
              >
                ‹ Home
              </button>
              <span className="text-white font-semibold text-sm">{appTitle}</span>
              <button
                onClick={() => setOpenApp(null)}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.6)', fontSize: 12,
                }}
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AppComp onOpenApp={handleOpenByType} appProps={openApp.appProps} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
