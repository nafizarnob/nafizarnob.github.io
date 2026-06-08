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
    title: 'Fenergo Delivery Automation Suite',
    description: '8 AI-powered tools that turned weeks of manual consulting into hours of automated delivery.',
    longDescription:
      'I identified that Fenergo CLM consulting was full of repetitive, error-prone manual work: extracting configurations, comparing environments, writing evidence reports, configuring policies from requirement docs. So I built an integrated suite of 8 tools — each one targeting a specific bottleneck in the delivery pipeline. The progression tells a story: from structured data extraction (Policy Extractor) to automated diffing (Comparator) to free-form AI analysis (Configuration Assistant) to fully autonomous journey execution (Entity Runner). The Requirement Orchestrator v7 is the capstone — it reads business requirements, auto-generates platform config, deploys it, then tests the config, all with built-in guardrails and quality gates. Deployed across ANZ (Skyc) and Macquarie Group\'s ICO program (27 jurisdictions, 50+ regulations).',
    tech: ['Python', 'Flask', 'Claude AI', 'Fenergo API', 'REST APIs', 'openpyxl', 'MCP Plugins'],
    links: [{ label: '💼 View LinkedIn Profile', url: '/linkedin-profile.html' }],
    category: 'enterprise',
    emoji: '⚙️',
    highlights: [
      'Requirement Orchestrator v7 — reads requirements, auto-configs the platform, tests it end-to-end with guardrails',
      'Entity Runner — fully autonomous policy-aware entity onboarding through live APIs',
      'Policy Extractor — auditable Excel extracts from any FenX tenant in one click (adopted org-wide)',
      'Policy Comparator — row-by-row environment promotion evidence reports',
      'Configuration Assistant — AI-powered live tenant analysis from any input (text, screenshots, URLs)',
      'Launch Webtool — Flask-based web tool for policy extract & compare workflows',
      'CE Report — deterministic Configuration Exchange reporting webtool',
      'MDES Config Aligner — reconciliation between client data dictionaries and live config',
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
