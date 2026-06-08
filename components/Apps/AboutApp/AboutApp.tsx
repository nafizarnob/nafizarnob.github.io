'use client';

import { motion } from 'framer-motion';
import { AppComponentProps } from '@/types';

const items = [
  { label: 'Role', value: 'Product Consultant at Fenergo', icon: '💼' },
  { label: 'Domain', value: 'AML/KYC · CLM · Financial Crime Compliance', icon: '🏛️' },
  { label: 'Clients', value: 'ANZ (Skyc) · Macquarie Group (ICO — 27 jurisdictions)', icon: '🌏' },
  { label: 'Education', value: 'UTS — BSc IT, Interaction Design (GPA 6.25)', icon: '🎓' },
  { label: 'Award', value: 'Best FEIT Digital Prototype', icon: '🏆' },
  { label: 'Location', value: 'Sydney, NSW, Australia', icon: '📍' },
];

export default function AboutApp({ onOpenApp }: AppComponentProps) {
  return (
    <div className="p-6 h-full overflow-y-auto" style={{ background: '#1a1b26' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <img
            src="/avatar.jpg"
            alt="Nafiz Arnob"
            className="w-16 h-16 rounded-2xl object-cover"
            style={{ border: '2px solid rgba(122,162,247,0.3)' }}
          />
          <div>
            <h1 className="text-2xl font-bold text-white">Md Nafiz Arnob</h1>
            <p className="text-blue-400 text-sm mt-0.5">Product Consultant & Developer</p>
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm mb-8">
          I architect enterprise solutions for financial compliance platforms at Fenergo, while
          building thoughtful digital experiences. My work spans the full spectrum — from discovery
          and solution design to configuration, testing, and production release across major APAC
          institutions.
        </p>

        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 + 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: '#24253a' }}
            >
              <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">
                  {item.label}
                </p>
                <p className="text-sm text-gray-200">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

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
  );
}
