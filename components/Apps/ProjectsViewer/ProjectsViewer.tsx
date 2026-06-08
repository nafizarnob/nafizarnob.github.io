'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { projects } from '@/data/projects';
import { Project, AppComponentProps } from '@/types';

export default function ProjectsViewer({ onOpenApp }: AppComponentProps) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'all' | 'personal' | 'enterprise'>('all');

  const filtered = projects.filter((p) => filter === 'all' || p.category === filter);

  const openInBrowser = (project: Project) => {
    if (!project.websiteUrl) return;
    onOpenApp?.('browser', { url: project.websiteUrl, title: project.title });
  };

  return (
    <div className="flex h-full" style={{ background: '#1a1b26' }}>
      {/* Sidebar */}
      <div className="w-44 shrink-0 border-r border-white/5 p-3 flex flex-col gap-1" style={{ background: '#16171f' }}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
          Filter
        </p>
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
            onClick={() => setSelected(project)}
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
      <div className="flex-1 overflow-y-auto p-6">
        {selected ? (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-xl"
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-5">
              <span className="text-5xl">{selected.emoji}</span>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1.5">{selected.title}</h2>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selected.category === 'personal'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {selected.category}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed text-sm mb-5">
              {selected.longDescription}
            </p>

            {/* Highlights */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Highlights
              </p>
              <ul className="space-y-2">
                {selected.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-blue-400 mt-0.5 shrink-0">›</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech stack */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {selected.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-md font-mono"
                    style={{ background: '#2a2b3d', color: '#7aa2f7', border: '1px solid #3a3b52' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {selected.websiteUrl && (
                <button
                  onClick={() => openInBrowser(selected)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                    color: 'white',
                  }}
                >
                  🖥️ Open in OS Browser
                </button>
              )}
              {selected.links.map((link) =>
                link.url.startsWith('/') ? (
                  <button
                    key={link.label}
                    onClick={() =>
                      onOpenApp?.('browser', {
                        url: link.url,
                        title: 'LinkedIn — Nafiz Arnob',
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #0a66c2, #1d4ed8)',
                      color: 'white',
                      border: '1px solid #1d6fc4',
                    }}
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
                    style={{
                      background: '#2a2b3d',
                      color: '#7aa2f7',
                      border: '1px solid #3a3b52',
                    }}
                  >
                    ↗ {link.label}
                  </a>
                )
              )}
            </div>
          </motion.div>
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
