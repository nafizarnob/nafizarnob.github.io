'use client';

import { useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWindowManager } from '@/hooks/useWindowManager';
import Desktop from '@/components/Desktop/Desktop';
import Wallpaper from '@/components/Desktop/Wallpaper';
import Taskbar from '@/components/Taskbar/Taskbar';
import Window from '@/components/Window/Window';
import MobilePortfolio from '@/components/MobilePortfolio/MobilePortfolio';

export default function Home() {
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

  return (
    <>
    {/* Mobile layout */}
    <div className="md:hidden">
      <MobilePortfolio />
    </div>

    {/* Desktop OS */}
    <div className="hidden md:block fixed inset-0 overflow-hidden">
      <Wallpaper />

      {/* Desktop area (above taskbar) */}
      <div
        ref={desktopRef}
        className="absolute inset-0 bottom-12"
      >
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

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        onOpenApp={openWindow}
        onFocusWindow={focusWindow}
        onMinimizeWindow={minimizeWindow}
      />
    </div>
    </>
  );
}
