'use client';

import { motion } from 'framer-motion';
import { AppComponentProps } from '@/types';

const highlights = [
  { stat: '5', label: 'AI-powered delivery tools adopted org-wide at Fenergo', color: '#7aa2f7' },
  { stat: '27', label: 'Jurisdictions covered across Macquarie ICO', color: '#bb9af7' },
  { stat: '3+', label: 'Years implementing CLM for tier-1 banks', color: '#7dcfff' },
  { stat: '50+', label: 'Regulations handled across APAC programs', color: '#9ece6a' },
];

const snapshot = [
  { label: 'Role', value: 'Product Consultant at Fenergo', icon: '💼' },
  { label: 'Domain', value: 'AML/KYC · CLM · Financial Crime Compliance', icon: '🏛️' },
  { label: 'Clients', value: 'ANZ · Macquarie Group · Fenergo APAC Banks', icon: '🌏' },
  { label: 'I Also Build', value: 'Full-stack web apps, AI delivery tools, this OS portfolio', icon: '🛠️' },
  { label: 'Education', value: 'UTS — BSc IT, Interaction Design', icon: '🎓' },
  { label: 'Award', value: 'Best FEIT Digital Prototype', icon: '🏆' },
  { label: 'Location', value: 'Sydney, NSW, Australia', icon: '📍' },
];

export default function AboutApp({ onOpenApp }: AppComponentProps) {
  return (
    <div className="h-full overflow-y-auto" style={{ background: '#1a1b26' }}>
      <div className="p-6 max-w-2xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src="/avatar.jpg"
              alt="Nafiz Arnob"
              className="w-20 h-20 rounded-2xl object-cover"
              style={{ border: '2px solid rgba(122,162,247,0.3)' }}
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Nafiz Arnob</h1>
              <p className="text-blue-400 text-sm mt-0.5">Product Consultant & Developer</p>
              <p className="text-gray-500 text-xs mt-1">Sydney, NSW, Australia</p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-gray-300 leading-relaxed text-sm mb-6">
            {"I'm a Product Consultant at Fenergo — I implement Client Lifecycle Management solutions for Australia's biggest banks. My day job is translating complex AML/KYC regulations into working platform configurations across multi-jurisdiction programs. But I don't just configure — I build. I've created a suite of AI-powered delivery tools, adopted org-wide across all Fenergo client engagements, that automate what used to take consultants weeks of manual work. Outside of work, I explore AI-enabled product development and ship my own web apps."}
          </p>

          {/* Impact highlights */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {highlights.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.15 }}
                className="rounded-xl p-4 relative overflow-hidden"
                style={{ background: '#24253a', border: '1px solid #2e2f45' }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${h.color}40, ${h.color}, ${h.color}40, transparent)` }}
                />
                <p className="text-2xl font-bold" style={{ color: h.color, fontFamily: "'JetBrains Mono', monospace" }}>{h.stat}</p>
                <p className="text-xs text-gray-400 mt-1 leading-snug">{h.label}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            onClick={() => onOpenApp?.('projects')}
            whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(122,162,247,0.25)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full mb-8 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
              color: 'white',
              border: '1px solid rgba(122,162,247,0.3)',
            }}
          >
            📁 See What I Built — Projects
          </motion.button>

          {/* Snapshot cards */}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Snapshot</p>
          <div className="space-y-2.5">
            {snapshot.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 + 0.3 }}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: '#24253a' }}
              >
                <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="text-sm text-gray-200">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
            <a
              href="mailto:mdnafizakter@gmail.com"
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-center transition-all"
              style={{ background: '#2a2b3d', color: '#7aa2f7', border: '1px solid #3a3b52' }}
            >
              ✉️ Email
            </a>
            <a
              href="https://github.com/nafizarnob"
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-center transition-all"
              style={{ background: '#2a2b3d', color: '#7aa2f7', border: '1px solid #3a3b52' }}
            >
              🔗 GitHub
            </a>
            <button
              onClick={() => onOpenApp?.('browser', { url: '/linkedin-profile.html', title: 'LinkedIn — Nafiz Arnob' })}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-center transition-all"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: 'white', border: '1px solid #3b82f6' }}
            >
              💼 LinkedIn
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
