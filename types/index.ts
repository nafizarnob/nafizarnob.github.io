export interface WindowState {
  id: string;
  title: string;
  app: AppType;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  appProps?: Record<string, string>;
}

export type AppType = 'projects' | 'about' | 'terminal' | 'browser' | 'flappy';

export interface AppComponentProps {
  onOpenApp?: (app: AppType, props?: Record<string, string>) => void;
  appProps?: Record<string, string>;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  links: { label: string; url: string }[];
  websiteUrl?: string;
  category: 'personal' | 'enterprise';
  emoji: string;
  logo?: string;
  highlights: string[];
}

export interface DesktopIcon {
  id: string;
  label: string;
  icon: string;
  app: AppType;
  appProps?: Record<string, string>;
}
