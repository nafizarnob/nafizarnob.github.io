import { Project, DesktopIcon } from '@/types';

export const projects: Project[] = [
  {
    id: 'shopnopuri',
    title: 'Shopnopuri Amusement Park',
    description: 'Official website for Shopnopuri Amusement Park, Bangladesh.',
    longDescription:
      'Full-featured tourism website for one of Bangladesh\'s most popular amusement parks. Supports both Bengali and English visitors with full i18n routing, responsive layouts across all devices, and dynamic content sections for attractions, events, and ticketing info.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'i18n'],
    links: [
      { label: 'GitHub', url: 'https://github.com/nafizarnob/shopnopuri-website' },
      { label: 'Live Site', url: 'https://shopnopuri.com' },
    ],
    websiteUrl: 'https://shopnopuri-website.vercel.app/',
    category: 'personal',
    emoji: '🎡',
    highlights: [
      'Bilingual (Bengali & English) with i18n routing',
      'Responsive across mobile, tablet, desktop',
      'Dynamic attraction & event sections',
      'Optimised for Bangladeshi visitors',
    ],
  },
  {
    id: 'pawfound',
    title: 'PawFound',
    description: 'Lost & found platform connecting pet owners with missing companions.',
    longDescription:
      'A full-stack platform that helps reunite lost pets with their owners. Features include community posting with photo uploads, location-based matching, real-time status updates, and a browseable feed of missing and found animals. Built with Next.js 14 App Router, Prisma ORM, and PostgreSQL on Vercel.',
    tech: ['Next.js 14', 'TypeScript', 'Prisma', 'PostgreSQL', 'Vercel'],
    links: [
      { label: 'Live App', url: 'https://pawfound.vercel.app' },
      { label: 'GitHub', url: 'https://github.com/nafizarnob/pawfound' },
    ],
    websiteUrl: 'https://pawfound.vercel.app',
    category: 'personal',
    emoji: '🐾',
    highlights: [
      'Full-stack with Next.js App Router & Prisma ORM',
      'Location-based pet matching system',
      'Community photo posting & browsing',
      'Real-time status tracking',
    ],
  },
  {
    id: 'fenergo-tools',
    title: 'Fenergo CLM Automation Suite',
    description: 'AI-driven automation built on Fenergo — the CLM platform used by global tier-1 banks.',
    longDescription:
      'Fenergo\'s Client Lifecycle Management platform helps financial institutions achieve 50% faster document processing, auto-resolve 95% of AML screening hits, and save up to 18,300 analyst hours annually. Working inside this ecosystem across ANZ (Skyc) and Macquarie Group\'s ICO program (27 jurisdictions, 50+ regulations), I built automation that compresses what takes weeks into hours. The Requirements-to-Config AI pipeline reads business requirement documents and auto-generates Fenergo platform configurations end-to-end. The Hybrid Testing Framework validates both the backend policy engine via API and full UI task journeys without manual effort. The Configuration Extractor — now used org-wide — exports any platform state to structured Excel in one click. A Config Change Monitor provides daily diffs of who changed what. The Daily Digest aggregates Teams and Outlook each morning so nothing critical is missed across multi-jurisdiction programs.',
    tech: ['Python', 'Flask', 'Fenergo API', 'REST APIs', 'openpyxl', 'Claude AI'],
    links: [{ label: '💼 View LinkedIn Profile', url: '/linkedin-profile.html' }],
    category: 'enterprise',
    emoji: '⚙️',
    highlights: [
      'Built on Fenergo CLM — trusted by ANZ, Macquarie & global tier-1 banks',
      'Requirements-to-Config AI: weeks of manual config collapsed to hours',
      'Hybrid testing: 100% API policy engine + UI journey coverage, zero manual effort',
      'Config Extractor: adopted org-wide — replaced manual Excel copy-paste',
      'Deployed across 27-jurisdiction, 50+ regulation programs',
    ],
  },
];

export const desktopIcons: DesktopIcon[] = [
  { id: 'projects', label: 'Projects', icon: '📁', app: 'projects' },
  { id: 'about', label: 'About Me', icon: '👤', app: 'about' },
  { id: 'terminal', label: 'Terminal', icon: '💻', app: 'terminal' },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: '🔗',
    app: 'browser',
    appProps: { url: '/linkedin-profile.html', title: 'LinkedIn — Nafiz Arnob' },
  },
  { id: 'flappy', label: 'Flappy Bird', icon: '🐦', app: 'flappy' },
];
