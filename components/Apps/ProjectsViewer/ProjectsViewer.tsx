'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/data/projects';
import { Project, AppComponentProps } from '@/types';

export default function ProjectsViewer({ onOpenApp }: AppComponentProps) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'all' | 'personal' | 'enterprise'>('all');
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const filtered = projects.filter((p) => filter === 'all' || p.category === filter);

  const openInBrowser = (project: Project) => {
    if (!project.websiteUrl) return;
    onOpenApp?.('browser', { url: project.websiteUrl, title: project.title });
  };

  const handleSelect = (project: Project) => {
    setSelected(project);
    if (isMobile) setMobileView('detail');
  };

  const DetailPanel = ({ project }: { project: Project }) => (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-5"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        {project.logo ? (
          <img src={project.logo} alt={project.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
        ) : (
          <span className="text-5xl">{project.emoji}</span>
        )}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-1.5">{project.title}</h2>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              project.category === 'personal'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}
          >
            {project.category}
          </span>
        </div>
      </div>

      <p className="text-gray-300 leading-relaxed text-sm mb-5">{project.longDescription}</p>

      {/* Highlights */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Highlights</p>
        <ul className="space-y-2">
          {project.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="text-blue-400 mt-0.5 shrink-0">›</span>
              {h}
            </li>
          ))}
        </ul>
      </div>

      {/* Tech stack */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tech Stack</p>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs px-2.5 py-1 rounded-md"
              style={{ background: '#2a2b3d', color: '#7aa2f7', border: '1px solid #3a3b52', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {project.id === 'fenergo-tools' && (
          <button
            onClick={() => onOpenApp?.('orchestration')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg, #D9A441, #9B8CFF)', color: '#0c0c0f' }}
          >
            🤖 View Agent Orchestration
          </button>
        )}
        {project.websiteUrl && (
          <button
            onClick={() => openInBrowser(project)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', color: 'white' }}
          >
            🖥️ Open in OS Browser
          </button>
        )}
        {project.links.map((link) =>
          link.url.startsWith('/') ? (
            <button
              key={link.label}
              onClick={() => onOpenApp?.('browser', { url: link.url, title: 'LinkedIn — Nafiz Arnob' })}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'linear-gradient(135deg, #0a66c2, #1d4ed8)', color: 'white', border: '1px solid #1d6fc4' }}
            >
              {link.label}
            </button>
          ) : (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: '#2a2b3d', color: '#7aa2f7', border: '1px solid #3a3b52' }}
            >
              ↗ {link.label}
            </a>
          )
        )}
      </div>
    </motion.div>
  );

  // ── Mobile layout: single-column master/detail ──
  if (isMobile) {
    return (
      <div className="flex flex-col h-full" style={{ background: '#1a1b26' }}>
        {/* Filter chips */}
        <div className="flex gap-2 px-3 pt-3 pb-2 shrink-0 border-b border-white/5" style={{ background: '#16171f' }}>
          {(['all', 'personal', 'enterprise'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setMobileView('list'); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                filter === f ? 'bg-blue-600/40 text-blue-300' : 'text-gray-400 bg-white/5'
              }`}
            >
              {f === 'all' ? '📂 All' : f === 'personal' ? '🧑‍💻 Personal' : '🏢 Enterprise'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {mobileView === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.18 }}
              className="flex-1 overflow-y-auto p-3 flex flex-col gap-2"
            >
              {filtered.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleSelect(project)}
                  className="w-full text-left flex items-center gap-3 px-4 py-4 rounded-xl transition-all"
                  style={{ background: '#24253a', border: '1px solid #3a3b52' }}
                >
                  <span className="text-3xl">{project.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-200 truncate">{project.title}</p>
                    <p className="text-xs text-gray-500 capitalize mt-0.5">{project.category}</p>
                  </div>
                  <span className="text-gray-600 text-lg">›</span>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.18 }}
              className="flex-1 overflow-y-auto"
            >
              <button
                onClick={() => setMobileView('list')}
                className="flex items-center gap-2 px-4 py-3 text-sm text-blue-400 font-medium shrink-0 sticky top-0 w-full border-b border-white/5"
                style={{ background: '#1a1b26' }}
              >
                ‹ Back to Projects
              </button>
              {selected && <DetailPanel project={selected} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Desktop layout: three-column ──
  return (
    <div className="flex h-full" style={{ background: '#1a1b26' }}>
      {/* Sidebar */}
      <div className="w-44 shrink-0 border-r border-white/5 p-3 flex flex-col gap-1" style={{ background: '#16171f' }}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">Filter</p>
        {(['all', 'personal', 'enterprise'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-left px-3 py-2 rounded-lg text-sm capitalize transition-all ${
              filter === f
                ? 'bg-blue-600/30 text-blue-400 font-medium'
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            {f === 'all' ? '📂 All' : f === 'personal' ? '🧑‍💻 Personal' : '🏢 Enterprise'}
          </button>
        ))}
        <div className="mt-auto pt-4 border-t border-white/5">
          <p className="text-xs text-gray-600 px-2">{filtered.length} projects</p>
        </div>
      </div>

      {/* Project list */}
      <div className="w-56 shrink-0 overflow-y-auto p-3 border-r border-white/5 flex flex-col gap-1">
        {filtered.map((project) => (
          <motion.button
            key={project.id}
            whileHover={{ x: 2 }}
            onClick={() => handleSelect(project)}
            className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
              selected?.id === project.id
                ? 'bg-blue-600/20 border border-blue-500/30'
                : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="text-2xl">{project.emoji}</span>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-200 truncate">{project.title}</p>
              <p className="text-xs text-gray-500 capitalize">{project.category}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="flex-1 overflow-y-auto">
        {selected ? (
          <DetailPanel project={selected} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
            <span className="text-5xl opacity-30">📁</span>
            <p className="text-gray-500 text-sm">Select a project to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
