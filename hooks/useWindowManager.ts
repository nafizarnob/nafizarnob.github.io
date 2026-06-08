'use client';

import { useState, useCallback } from 'react';
import { WindowState, AppType } from '@/types';

let zCounter = 100;

const DEFAULT_SIZES: Record<AppType, { width: number; height: number }> = {
  projects: { width: 860, height: 560 },
  about: { width: 640, height: 480 },
  terminal: { width: 640, height: 420 },
  browser: { width: 900, height: 600 },
  flappy: { width: 520, height: 520 },
};

const APP_TITLES: Record<AppType, string> = {
  projects: 'Projects',
  about: 'About Nafiz',
  terminal: 'Terminal',
  browser: 'Browser',
  flappy: 'Flappy Bird',
};

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([]);

  const openWindow = useCallback((app: AppType, appProps?: Record<string, string>) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    setWindows((prev) => {
      // For browser windows with a URL, always open a new one
      if (app === 'browser' && appProps?.url) {
        const size = DEFAULT_SIZES[app];
        const offset = prev.filter((w) => w.app === 'browser').length * 30;
        return [
          ...prev.map((w) => ({ ...w, isFocused: false })),
          {
            id: `${app}-${Date.now()}`,
            title: appProps.title ?? 'Browser',
            app,
            isMinimized: false,
            isMaximized: isMobile,
            isFocused: true,
            position: { x: 150 + offset, y: 50 + offset },
            size,
            zIndex: ++zCounter,
            appProps,
          },
        ];
      }

      const existing = prev.find((w) => w.app === app);
      if (existing) {
        return prev.map((w) =>
          w.id === existing.id
            ? { ...w, isMinimized: false, isFocused: true, zIndex: ++zCounter }
            : { ...w, isFocused: false }
        );
      }

      const size = DEFAULT_SIZES[app];
      const offset = prev.length * 30;

      return [
        ...prev.map((w) => ({ ...w, isFocused: false })),
        {
          id: `${app}-${Date.now()}`,
          title: APP_TITLES[app],
          app,
          isMinimized: false,
          isMaximized: isMobile,
          isFocused: true,
          position: { x: 120 + offset, y: 60 + offset },
          size,
          zIndex: ++zCounter,
          appProps,
        },
      ];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true, isFocused: false } : w))
    );
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, isFocused: true, isMinimized: false, zIndex: ++zCounter }
          : { ...w, isFocused: false }
      )
    );
  }, []);

  const updatePosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, position } : w)));
  }, []);

  const updateSize = useCallback(
    (id: string, size: { width: number; height: number }) => {
      setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, size } : w)));
    },
    []
  );

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    updatePosition,
    updateSize,
  };
}
