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
      { label: 'Live Site', url: 'https://shopnopuri-website.vercel.app/' },
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
    description: 'A suite of AI-powered delivery tools adopted org-wide across all Fenergo client engagements.',
    longDescription:
      'Fenergo CLM consulting was full of repetitive, error-prone manual work: extracting configurations, comparing environments, writing evidence reports, configuring policies from requirement docs. So I built an integrated suite of tools — each one targeting a specific bottleneck in the delivery pipeline. The Requirement Orchestrator reads business requirements in any format, analyses gaps against live platform configuration, and produces structured delivery plans with test cases — it never writes config itself, handing scoped change packages to the Configuration Assistant, which applies them with built-in guardrails and automatic evidence packs. Adopted org-wide across all Fenergo client engagements, including ANZ (SkyC) and Macquarie Group\'s ICO program (27 jurisdictions, 50+ regulations).',
    tech: ['Python', 'Flask', 'Claude AI', 'Fenergo API', 'REST APIs', 'openpyxl', 'MCP Plugins'],
    links: [{ label: '💼 View LinkedIn Profile', url: '/linkedin-profile.html' }],
    category: 'enterprise',
    emoji: '⚙️',
    logo: '/fenergo-logo-new.png',
    highlights: [
      'Requirement Orchestrator — reads requirements from any source (Excel, text, screenshots, URLs), analyses gaps against live config, and produces delivery plans with test cases and validation — cutting scoping from days to minutes',
      'Entity Runner — creates policy-aware test entities and progresses onboarding journeys via live Fenergo APIs, handling approval gates and screening matches',
      'Configuration Assistant — applies approved platform changes to live environments with built-in safeguards and automatic evidence packs for audit and sign-off',
      'Configuration Extractor Tool — one-click export of full platform configuration into business-ready Excel reports (adopted org-wide)',
      'Configuration Exchange Report Generator — client-ready change documentation for cross-environment migrations',
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
  {
    id: 'resume',
    label: 'Resume',
    icon: '📄',
    app: 'browser',
    appProps: { url: '/resume.html', title: 'Resume — Nafiz Arnob' },
  },
  { id: 'flappy', label: 'Flappy Bird', icon: '🐦', app: 'flappy' },
  { id: 'orchestration', label: 'AI Agents', icon: '🤖', app: 'orchestration' },
];
