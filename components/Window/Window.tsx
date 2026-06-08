'use client';

import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import { WindowState, AppType, AppComponentProps } from '@/types';
import ProjectsViewer from '@/components/Apps/ProjectsViewer/ProjectsViewer';
import AboutApp from '@/components/Apps/AboutApp/AboutApp';
import TerminalApp from '@/components/Apps/TerminalApp/TerminalApp';
import BrowserApp from '@/components/Apps/BrowserApp/BrowserApp';
import FlappyApp from '@/components/Apps/FlappyApp/FlappyApp';

interface WindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onPositionChange: (id: string, pos: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
  onOpenApp: (app: AppType, props?: Record<string, string>) => void;
}

const APP_COMPONENTS: Record<AppType, React.ComponentType<AppComponentProps>> = {
  projects: ProjectsViewer,
  about: AboutApp,
  terminal: TerminalApp,
  browser: BrowserApp,
  flappy: FlappyApp,
};

function TitleBar({
  title,
  onClose,
  onMinimize,
  onMaximize,
  isFocused,
}: {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isFocused: boolean;
}) {
  return (
    <div
      className="window-titlebar flex items-center gap-2 px-4 py-3 select-none cursor-move shrink-0"
      style={{
        background: isFocused ? 'rgba(30,32,55,0.95)' : 'rgba(22,23,38,0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
      onDoubleClick={onMaximize}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center group"
        aria-label="Close"
      >
        <span className="text-red-900 text-[8px] opacity-0 group-hover:opacity-100">✕</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onMinimize(); }}
        className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors flex items-center justify-center group"
        aria-label="Minimize"
      >
        <span className="text-yellow-900 text-[8px] opacity-0 group-hover:opacity-100">−</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onMaximize(); }}
        className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors flex items-center justify-center group"
        aria-label="Maximize"
      >
        <span className="text-green-900 text-[8px] opacity-0 group-hover:opacity-100">+</span>
      </button>
      <span className="flex-1 text-center text-sm font-medium pointer-events-none" style={{ color: isFocused ? '#c0caf5' : '#6b7280' }}>
        {title}
      </span>
      <div className="w-12" />
    </div>
  );
}

export default function Window({
  window: win,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  onSizeChange,
  onOpenApp,
}: WindowProps) {
  const AppComponent = APP_COMPONENTS[win.app];
  if (win.isMinimized) return null;

  const glassStyle: React.CSSProperties = {
    background: win.isFocused ? 'rgba(15,16,28,0.88)' : 'rgba(12,13,22,0.82)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: win.isFocused
      ? '1px solid rgba(122,162,247,0.18)'
      : '1px solid rgba(255,255,255,0.07)',
    boxShadow: win.isFocused
      ? '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(122,162,247,0.08), inset 0 1px 0 rgba(255,255,255,0.06)'
      : '0 16px 40px rgba(0,0,0,0.4)',
  };

  const chrome = (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        ...glassStyle,
        borderRadius: win.isMaximized ? 0 : '12px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      <TitleBar
        title={win.title}
        onClose={() => onClose(win.id)}
        onMinimize={() => onMinimize(win.id)}
        onMaximize={() => onMaximize(win.id)}
        isFocused={win.isFocused}
      />
      <div className="flex-1 overflow-auto" style={{ color: '#c0caf5' }}>
        <AppComponent onOpenApp={onOpenApp} appProps={win.appProps} />
      </div>
    </div>
  );

  if (win.isMaximized) {
    return (
      <AnimatePresence>
        <motion.div
          key={win.id + '-max'}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0, zIndex: win.zIndex }}
          onMouseDown={() => onFocus(win.id)}
        >
          {chrome}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key={win.id}
        initial={{ scale: 0.9, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 16 }}
        transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ position: 'absolute', zIndex: win.zIndex, inset: 0, pointerEvents: 'none' }}
      >
        <Rnd
          position={win.position}
          size={win.size}
          style={{ pointerEvents: 'all' }}
          minWidth={400}
          minHeight={300}
          bounds="parent"
          dragHandleClassName="window-titlebar"
          onMouseDown={() => onFocus(win.id)}
          onDragStop={(_, d) => onPositionChange(win.id, { x: d.x, y: d.y })}
          onResizeStop={(_, __, ref, ___, pos) => {
            onSizeChange(win.id, {
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
            });
            onPositionChange(win.id, pos);
          }}
        >
          {chrome}
        </Rnd>
      </motion.div>
    </AnimatePresence>
  );
}
