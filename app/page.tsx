'use client';

import { useRef, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWindowManager } from '@/hooks/useWindowManager';
import Desktop from '@/components/Desktop/Desktop';
import Wallpaper from '@/components/Desktop/Wallpaper';
import Taskbar from '@/components/Taskbar/Taskbar';
import Window from '@/components/Window/Window';
import MobileOS from '@/components/MobileOS/MobileOS';

export default function Home() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    updatePosition,
    updateSize,
  } = useWindowManager();

  const desktopRef = useRef<HTMLDivElement>(null);

  // Dark placeholder while detecting device type — matches wallpaper bg
  if (isMobile === null) {
    return <div style={{ position: 'fixed', inset: 0, background: '#060810' }} />;
  }

  if (isMobile) {
    return <MobileOS />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <Wallpaper />

      {/* Desktop area (above taskbar) */}
      <div ref={desktopRef} className="absolute inset-0 bottom-12">
        <Desktop onOpenApp={openWindow} />

        <AnimatePresence>
          {windows.map((win) => (
            <Window
              key={win.id}
              window={win}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onMaximize={toggleMaximize}
              onFocus={focusWindow}
              onPositionChange={updatePosition}
              onSizeChange={updateSize}
              onOpenApp={openWindow}
            />
          ))}
        </AnimatePresence>
      </div>

      <Taskbar
        windows={windows}
        onOpenApp={openWindow}
        onFocusWindow={focusWindow}
        onMinimizeWindow={minimizeWindow}
      />
    </div>
  );
}
