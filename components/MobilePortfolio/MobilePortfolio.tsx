'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { projects } from '@/data/projects';

const skills = {
  Domain: ['Fenergo CLM', 'AML / KYC', 'Financial Crime Compliance', 'Client Onboarding', 'Regulatory Compliance', 'Risk Assessment'],
  Engineering: ['Python', 'Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'PostgreSQL', 'Prisma', 'AWS', 'Azure'],
};

const experience = [
  {
    title: 'Product Consultant',
    company: 'Fenergo',
    client: 'Macquarie Group — ICO Program',
    period: 'Apr 2024 – Present',
    location: 'Sydney, NSW (Hybrid)',
    desc: "Embedded in Macquarie Group's ICO program across 27 jurisdictions. Own end-to-end CLM automation: 50% faster document processing, 95% automated AML screening resolution.",
    tags: ['CLM', 'AML/KYC', 'Python', 'Automation'],
  },
  {
    title: 'Implementation Consultant',
    company: 'Fenergo',
    client: 'ANZ Bank — SkyC Project',
    period: 'Sep 2021 – Apr 2024',
    location: 'Sydney, NSW',
    desc: 'Led CLM configuration and delivery for ANZ\'s SkyC digital onboarding. Designed automation modules for document collection, entity screening, and risk assessment.',
    tags: ['CLM', 'ANZ', 'Client Onboarding', 'Rule Engine'],
  },
];

export default function MobilePortfolio() {
  const [openProject, setOpenProject] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen overflow-y-auto pb-12"
      style={{ background: '#0f101a', color: '#c0caf5' }}
    >
      {/* Hero */}
      <div className="px-6 pt-12 pb-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-4"
          style={{ background: 'linear-gradient(135deg, #7aa2f7, #bb9af7)', color: '#1a1b26' }}
        >
          N
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h1 className="text-2xl font-bold text-white">Md Nafiz Arnob</h1>
          <p className="text-sm mt-1" style={{ color: '#7aa2f7' }}>Product Consultant &amp; Developer</p>
          <p className="text-xs mt-1 text-gray-500">📍 Sydney, NSW, Australia</p>
          <div className="flex justify-center gap-3 mt-4">
            <a
              href="mailto:mdnafizakter@gmail.com"
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#24253a', color: '#7aa2f7', border: '1px solid #3a3b52' }}
            >
              ✉️ Email
            </a>
            <a
              href="https://github.com/nafizarnob"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#24253a', color: '#7aa2f7', border: '1px solid #3a3b52' }}
            >
              🔗 GitHub
            </a>
            <a
              href="/linkedin-profile.html"
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: '#fff', border: '1px solid #3b82f6' }}
            >
              💼 LinkedIn
            </a>
          </div>
        </motion.div>
      </div>

      <div className="px-5 space-y-8">
        {/* About */}
        <section>
          <SectionTitle>About</SectionTitle>
          <p className="text-sm leading-relaxed text-gray-300">
            I'm a Fenergo-specialised Product Consultant with 3+ years implementing Client Lifecycle Management (CLM)
            solutions for Australia's major financial institutions. My work spans AML/KYC compliance automation,
            platform configuration, and full-stack development — bridging regulatory complexity and technology.
          </p>
        </section>

        {/* Experience */}
        <section>
          <SectionTitle>Experience</SectionTitle>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl p-4"
                style={{ background: '#1a1b26', border: '1px solid #2a2b3d' }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: '#0a66c2', color: '#fff' }}
                  >
                    F
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{exp.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{exp.company} · {exp.period}</p>
                    <div
                      className="mt-2 px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1"
                      style={{ background: '#1e3a5f', color: '#7aa2f7' }}
                    >
                      📌 {exp.client}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">{exp.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {exp.tags.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#24253a', color: '#7aa2f7' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-3">
            {projects.map((proj, i) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl overflow-hidden"
                style={{ background: '#1a1b26', border: '1px solid #2a2b3d' }}
              >
                <button
                  className="w-full flex items-center gap-3 p-4 text-left"
                  onClick={() => setOpenProject(openProject === proj.id ? null : proj.id)}
                >
                  <span className="text-2xl">{proj.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{proj.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{proj.description}</p>
                  </div>
                  <span className="text-gray-600 text-xs shrink-0">{openProject === proj.id ? '▲' : '▼'}</span>
                </button>
                {openProject === proj.id && (
                  <div className="px-4 pb-4 border-t border-white/5">
                    <p className="text-xs text-gray-400 leading-relaxed mt-3">{proj.longDescription}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {proj.tech.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#24253a', color: '#bb9af7' }}>{t}</span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {proj.links.map(l => (
                        <a
                          key={l.label}
                          href={l.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs px-3 py-1.5 rounded-lg font-medium"
                          style={{ background: '#24253a', color: '#7aa2f7', border: '1px solid #3a3b52' }}
                        >
                          {l.label} ↗
                        </a>
                      ))}
                      {proj.websiteUrl && (
                        <a
                          href={proj.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs px-3 py-1.5 rounded-lg font-medium"
                          style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: '#fff' }}
                        >
                          🖥️ Open Site
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-4">
            {Object.entries(skills).map(([group, items]) => (
              <div key={group}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{group}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map(s => (
                    <span key={s} className="text-xs px-3 py-1 rounded-full" style={{ background: '#24253a', color: '#c0caf5', border: '1px solid #3a3b52' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <SectionTitle>Education</SectionTitle>
          <div className="rounded-xl p-4" style={{ background: '#1a1b26', border: '1px solid #2a2b3d' }}>
            <p className="font-semibold text-white text-sm">University of Technology Sydney</p>
            <p className="text-xs text-gray-400 mt-1">BSc Information Technology — Interaction Design · 2018–2021</p>
            <div className="mt-2 text-xs px-2 py-1 rounded inline-block" style={{ background: '#2a2000', color: '#e5b800' }}>
              🏆 Best FEIT Digital Prototype
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <SectionTitle>Contact</SectionTitle>
          <div className="rounded-xl p-4 space-y-3" style={{ background: '#1a1b26', border: '1px solid #2a2b3d' }}>
            <a href="mailto:mdnafizakter@gmail.com" className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors">
              <span>✉️</span> mdnafizakter@gmail.com
            </a>
            <a href="https://github.com/nafizarnob" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors">
              <span>🐙</span> github.com/nafizarnob
            </a>
            <a href="https://www.linkedin.com/in/mdarn/" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors">
              <span>💼</span> linkedin.com/in/mdarn
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
      {children}
    </h2>
  );
}
