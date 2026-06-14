'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppComponentProps } from '@/types';

const C = { orch: '#D9A441', config: '#9B8CFF', entity: '#58C39A', gate: '#8b8b86' } as const;

interface AgentStep {
  label: string;
  desc: string;
  note?: string;
  noteIcon?: string;
}

interface Agent {
  id: keyof typeof C;
  name: string;
  tag: string;
  role: string;
  steps: AgentStep[];
  outputs: string[];
  guardrail: string;
}

const AGENTS: Agent[] = [
  {
    id: 'orch', name: 'Requirement Orchestrator', tag: 'v7 · master',
    role: 'Plans, never writes',
    steps: [
      { label: 'Ingest & normalize inputs', desc: 'Accepts marked Excel workbooks, free text, screenshots, or URLs and normalizes them into one structured requirement set — format-agnostic on the way in.' },
      { label: 'Pull live tenant config', desc: 'Reads the current tenant configuration directly, so every comparison is made against reality rather than against assumptions or stale documentation.' },
      { label: 'Compute the config delta', desc: 'Diffs the requirements against live config to determine exactly what must change — and, just as importantly, flags what must stay untouched.' },
      { label: 'Generate test cases + validation', desc: 'Derives test cases and validation checks for each change so the resulting configuration is provable, not just plausible.' },
      { label: 'Compile pre / post reports', desc: 'Produces branded, tabbed HTML reports — delta tables, validation results, and an intelligence summary that explains the why behind every change.' },
      { label: 'Hand off a scoped package', desc: 'On approval, packages a precise, scoped instruction set and hands it to the Configuration Assistant.', note: 'Crosses to the Configuration Assistant — it never writes config itself.', noteIcon: '→' },
    ],
    outputs: ['Delta tables', 'Pre / post reports', 'Test cases', 'Intelligence summary'],
    guardrail: 'Read-only. Never writes config — it only hands off a precise, scoped instruction package.',
  },
  {
    id: 'config', name: 'Configuration Assistant', tag: 'write operator',
    role: 'Executes approved changes',
    steps: [
      { label: 'Read current state', desc: 'Reads the live configuration for every target before touching anything, so each write is made with full awareness of what is already there.' },
      { label: 'Back up before change', desc: 'Snapshots the current state of every target it is about to modify, so any change can be rolled back cleanly if needed.' },
      { label: 'Apply via API', desc: 'Writes the approved changes through the tenant API — policies, journey schemas, lookups, data groups, document requirements, and risk config.' },
      { label: 'Verify after save', desc: 'Re-reads each target after writing to confirm the change landed exactly as specified, catching silent failures immediately.' },
      { label: 'Generate evidence packs', desc: 'Emits regression and progression evidence packs plus a branded validation report — a complete paper trail for every change made.', note: 'Hard DEV-only guardrail — refuses to touch UAT or above.', noteIcon: '⚠' },
    ],
    outputs: ['Regression pack', 'Progression pack', 'Validation report'],
    guardrail: 'Hard DEV-only guardrail — it refuses to touch UAT or anything above. Read before write, back up before change, verify after save.',
  },
  {
    id: 'entity', name: 'Entity Runner', tag: 'standalone',
    role: 'Runs journeys & workflows',
    steps: [
      { label: 'Read the active policy', desc: 'Reads the active tenant policy to understand which fields, products, and tasks actually apply before generating anything.' },
      { label: 'Build coherent entity data', desc: 'Generates realistic, policy-aware golden entities — coherent data stories with believable names, structures, and attributes, not placeholder junk.' },
      { label: 'Add products & related parties', desc: 'Adds products and links accounts and related parties so the entity is complete and representative of a real onboarding case.' },
      { label: 'Drive the journey / workflow', desc: 'Runs the onboarding journey or workflow itself via the API — progressing each task step by step, executing the flow rather than just observing it.', note: 'It executes the journey itself, end to end.', noteIcon: '▸' },
      { label: 'Stop at gates cleanly', desc: 'Knows when to stop — approval gates, screening matches, lifecycle blockers — and hands off cleanly at exactly that point instead of forcing through.' },
    ],
    outputs: ['Golden entities', 'Progression log', 'Stop-point handoff'],
    guardrail: 'Knows when to stop — approval gates, screening matches, and lifecycle blockers — and hands off cleanly.',
  },
];

const LOGS_DATA = [
  { t: 'Parsed 42 requirements from workbook', o: 'orch' as const, s: 0 },
  { t: 'Pulled live tenant config (DEV)', o: 'orch' as const, s: 1 },
  { t: '3 deltas — AddPolicyRule · UpdateLookup · DocReq', o: 'orch' as const, s: 2 },
  { t: 'Pre-config report ready', o: 'orch' as const, s: 2 },
  { t: 'Awaiting approval…', o: 'gate' as const, s: 3 },
  { t: 'Approved — package handed to Config Assistant', o: 'gate' as const, s: 3 },
  { t: 'Backup snapshot saved', o: 'config' as const, s: 4 },
  { t: 'Applied 3 changes via API', o: 'config' as const, s: 4 },
  { t: 'Regression 0 · Progression 3 / 3', o: 'config' as const, s: 5 },
  { t: 'Validation report generated', o: 'config' as const, s: 5 },
];

const STAGE_DEFS = [
  { label: 'Ingest', owner: 'orch' as const },
  { label: 'Compare vs tenant', owner: 'orch' as const },
  { label: 'Delta + report', owner: 'orch' as const },
  { label: 'Approve', owner: 'gate' as const },
  { label: 'Apply config', owner: 'config' as const },
  { label: 'Verify + evidence', owner: 'config' as const },
];

const POS = { orch: { l: 30, t: 50 }, config: { l: 71, t: 30 }, entity: { l: 71, t: 74 } };

function byId(id: string) { return AGENTS.find(a => a.id === id)!; }

// ============ ORCHESTRATION MAP (SVG Graph) ============
function OrchestrationGraph({ focus, setFocus, hoverAgent, setHoverAgent }: {
  focus: string | null;
  setFocus: (id: string | null) => void;
  hoverAgent: string | null;
  setHoverAgent: (id: string | null) => void;
}) {
  const [sel, setSel] = useState(0);
  const [hoverStep, setHoverStep] = useState<number | null>(null);

  useEffect(() => { setSel(0); setHoverStep(null); }, [focus]);

  const active = focus || hoverAgent;
  const isFocus = !!focus;
  const center = focus ? { l: 50, t: 50 } : (active ? POS[active as keyof typeof POS] : null);

  const nodeOpacity = (id: string) => {
    if (focus) return focus === id ? 1 : 0.22;
    if (hoverAgent) return hoverAgent === id ? 1 : 0.5;
    return 1;
  };

  const handPath = 'M462 268 C 600 230, 660 184, 742 164';
  const baseEdgesOpacity = focus ? 0.05 : 1;

  const bubbles = active ? (() => {
    const a = byId(active);
    const cnt = a.steps.length;
    const rx = isFocus ? 30 : 12;
    const ry = isFocus ? 36 : 17;
    const cx = center!.l, cy = center!.t;
    return a.steps.map((s, i) => {
      const ang = (-90 + i * (360 / cnt)) * Math.PI / 180;
      const left = cx + rx * Math.cos(ang);
      const top = cy + ry * Math.sin(ang);
      return { i, label: s.label, left, top, vx: left / 100 * 1000, vy: top / 100 * 620, dx: Math.cos(ang), dy: Math.sin(ang) };
    });
  })() : [];

  const fAgent = focus ? byId(focus) : null;
  const fHue = fAgent ? C[fAgent.id as keyof typeof C] : '#888';
  const selStep = fAgent ? fAgent.steps[sel] : null;

  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(232,230,225,0.12)', background: '#0d0d11' }}>
      {/* Canvas */}
      <div style={{ position: 'relative', width: '100%', height: 520, background: 'radial-gradient(900px 520px at 42% 46%,#16161d 0%,#0d0d11 64%)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(232,230,225,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(232,230,225,0.03) 1px,transparent 1px)', backgroundSize: '34px 34px', pointerEvents: 'none' }} />

        {/* SVG edges */}
        <svg viewBox="0 0 1000 620" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="handg2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={C.orch} />
              <stop offset="1" stopColor={C.config} />
            </linearGradient>
          </defs>
          <path d="M96 90 C 240 120, 300 240, 392 276" fill="none" stroke="rgba(232,230,225,0.16)" strokeWidth={1.2} strokeLinecap="round" strokeDasharray="5 9" opacity={baseEdgesOpacity * (hoverAgent && hoverAgent !== 'orch' ? 0.4 : 1)} style={{ animation: 'dashflow 1s linear infinite' }} />
          <path d="M96 213 C 240 232, 300 258, 392 280" fill="none" stroke="rgba(232,230,225,0.16)" strokeWidth={1.2} strokeLinecap="round" strokeDasharray="5 9" opacity={baseEdgesOpacity * (hoverAgent && hoverAgent !== 'orch' ? 0.4 : 1)} style={{ animation: 'dashflow 1s linear infinite' }} />
          <path d="M96 336 C 240 322, 300 300, 392 286" fill="none" stroke="rgba(232,230,225,0.16)" strokeWidth={1.2} strokeLinecap="round" strokeDasharray="5 9" opacity={baseEdgesOpacity * (hoverAgent && hoverAgent !== 'orch' ? 0.4 : 1)} style={{ animation: 'dashflow 1s linear infinite' }} />
          <path d="M96 459 C 240 420, 300 330, 392 292" fill="none" stroke="rgba(232,230,225,0.16)" strokeWidth={1.2} strokeLinecap="round" strokeDasharray="5 9" opacity={baseEdgesOpacity * (hoverAgent && hoverAgent !== 'orch' ? 0.4 : 1)} style={{ animation: 'dashflow 1s linear infinite' }} />
          <path d={handPath} fill="none" stroke="url(#handg2)" strokeWidth={3} strokeLinecap="round" strokeDasharray="5 9" opacity={baseEdgesOpacity} style={{ animation: 'dashflow 1s linear infinite' }} />
          <path d="M740 200 C 720 260, 720 310, 740 390" fill="none" stroke="rgba(88,195,154,0.4)" strokeWidth={1.2} strokeLinecap="round" strokeDasharray="5 9" opacity={baseEdgesOpacity * 0.55} style={{ animation: 'dashflow 1s linear infinite' }} />
          {!focus && (
            <>
              <circle r={3.6} fill={C.config}><animateMotion dur="2.4s" repeatCount="indefinite" path={handPath} /></circle>
              <circle r={3.6} fill={C.orch}><animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path={handPath} /></circle>
            </>
          )}
        </svg>

        {/* Entity orbit ring */}
        <div style={{
          position: 'absolute', left: '71%', top: '74%', width: 200, height: 200, borderRadius: '50%',
          border: '1px dashed rgba(88,195,154,0.35)', animation: 'spin 26s linear infinite',
          pointerEvents: 'none', opacity: focus ? 0 : (hoverAgent && hoverAgent !== 'entity' ? 0.4 : 1), transition: 'opacity .3s',
          transform: 'translate(-50%, -50%)',
        }} />

        {/* Input chips */}
        {['xlsx workbook', 'free text', 'screenshot', 'url'].map((label, i) => (
          <div key={label} style={{
            position: 'absolute', left: '9.6%', top: `${16 + i * 22}%`, transform: 'translate(-50%,-50%)',
            fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#8b8b86',
            background: '#121217', border: '1px solid rgba(232,230,225,0.1)', borderRadius: 8,
            padding: '5px 9px', whiteSpace: 'nowrap', opacity: focus ? 0.08 : (hoverAgent && hoverAgent !== 'orch' ? 0.4 : 1),
            transition: 'opacity .3s', pointerEvents: 'none',
          }}>{label}</div>
        ))}

        {/* Edge labels */}
        {!focus && (
          <>
            <div style={{ position: 'absolute', left: '64.5%', top: '20%', transform: 'translate(-50%,-50%)', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: C.orch, whiteSpace: 'nowrap', pointerEvents: 'none' }}>hands off →</div>
            <div style={{ position: 'absolute', left: '71%', top: '92%', transform: 'translate(-50%,-50%)', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: C.entity, whiteSpace: 'nowrap', pointerEvents: 'none' }}>standalone</div>
          </>
        )}

        {/* Agent nodes */}
        {AGENTS.map(agent => {
          const hue = C[agent.id as keyof typeof C];
          const p = (focus === agent.id) ? center! : POS[agent.id as keyof typeof POS];
          const big = focus === agent.id;
          const lit = focus === agent.id || (!focus && hoverAgent === agent.id);
          return (
            <div
              key={agent.id}
              onMouseEnter={() => { if (!focus) setHoverAgent(agent.id); }}
              onMouseLeave={() => { if (!focus) setHoverAgent(null); }}
              onClick={() => { if (focus === agent.id) setFocus(null); else setFocus(agent.id); }}
              style={{
                position: 'absolute', left: `${p.l}%`, top: `${p.t}%`, transform: 'translate(-50%,-50%)',
                width: big ? 190 : 168, cursor: 'pointer',
                background: '#15151b', border: `1px solid ${lit ? hue : 'rgba(232,230,225,0.12)'}`,
                borderRadius: 14, padding: '14px 16px', opacity: nodeOpacity(agent.id),
                boxShadow: lit ? `0 0 0 1px ${hue}55, 0 20px 55px -22px ${hue}cc` : '0 14px 40px -28px #000',
                transition: 'left .45s cubic-bezier(.2,.7,.2,1), top .45s cubic-bezier(.2,.7,.2,1), opacity .3s, border-color .25s, box-shadow .25s',
                zIndex: focus === agent.id ? 6 : (focus ? 1 : 3), pointerEvents: (focus && focus !== agent.id) ? 'none' : 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: hue, boxShadow: `0 0 10px ${hue}` }} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: hue }}>{agent.tag}</span>
              </div>
              <div style={{ fontSize: big ? 16 : 14.5, fontWeight: 600, color: '#e8e6e1', lineHeight: 1.2, marginBottom: 4 }}>{agent.name}</div>
              <div style={{ fontSize: 11.5, color: '#8b8b86', lineHeight: 1.35 }}>{agent.role}</div>
            </div>
          );
        })}

        {/* Glass overlay for focus mode */}
        {focus && (
          <div onClick={() => setFocus(null)} style={{
            position: 'absolute', inset: 0, zIndex: 2, cursor: 'default',
            background: 'rgba(11,11,15,0.58)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          }} />
        )}

        {/* Connector lines in focus mode */}
        {isFocus && (
          <svg viewBox="0 0 1000 620" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4, pointerEvents: 'none' }}>
            {bubbles.map(b => {
              const cvx = center!.l / 100 * 1000, cvy = center!.t / 100 * 620;
              const selected = sel === b.i;
              return (
                <line key={`l${b.i}`} x1={cvx} y1={cvy} x2={b.vx} y2={b.vy}
                  stroke={selected ? C[focus as keyof typeof C] : 'rgba(232,230,225,0.22)'} strokeWidth={selected ? 2 : 1.2}
                  strokeDasharray="4 7" opacity={selected ? 0.95 : 0.55}
                  style={{ animation: 'dashflow 1s linear infinite' }}
                />
              );
            })}
          </svg>
        )}

        {/* Step bubbles */}
        {bubbles.map(b => {
          const hue = C[active as keyof typeof C];
          const selected = isFocus && sel === b.i;
          const hov = isFocus && hoverStep === b.i;
          const size = isFocus ? (selected ? 46 : 38) : 20;

          let labelStyle: React.CSSProperties | null = null;
          if (isFocus) {
            const base: React.CSSProperties = {
              position: 'absolute', fontFamily: "'Geist',sans-serif", fontSize: 12.5, fontWeight: 500,
              lineHeight: 1.35, pointerEvents: 'none', zIndex: 7, padding: '6px 12px', borderRadius: 8,
              background: selected ? `${hue}24` : 'rgba(12,12,16,0.88)',
              border: `1px solid ${selected ? hue : (hov ? `${hue}66` : 'rgba(232,230,225,0.12)')}`,
              color: selected ? '#ffffff' : (hov ? '#e8e6e1' : '#a7a7a2'),
              boxShadow: selected ? `0 8px 24px -12px ${hue}` : 'none',
              transition: 'color .2s, border-color .2s, background .2s',
            };
            const horizontal = Math.abs(b.dx) > 0.4;
            if (horizontal && b.dx > 0) {
              labelStyle = { ...base, left: size / 2 + 14, top: 0, transform: 'translateY(-50%)', textAlign: 'left', maxWidth: 180 };
            } else if (horizontal) {
              labelStyle = { ...base, right: size / 2 + 14, top: 0, transform: 'translateY(-50%)', textAlign: 'right', maxWidth: 180 };
            } else if (b.dy > 0) {
              labelStyle = { ...base, left: 0, top: size / 2 + 12, transform: 'translateX(-50%)', textAlign: 'center', maxWidth: 200, whiteSpace: 'normal' };
            } else {
              labelStyle = { ...base, left: 0, bottom: size / 2 + 12, transform: 'translateX(-50%)', textAlign: 'center', maxWidth: 200, whiteSpace: 'normal' };
            }
          }

          return (
            <div key={`b${b.i}`} style={{ position: 'absolute', left: `${b.left}%`, top: `${b.top}%`, zIndex: 5 }}>
              <div
                onClick={isFocus ? (e) => { e.stopPropagation(); setSel(b.i); } : undefined}
                onMouseEnter={isFocus ? () => setHoverStep(b.i) : undefined}
                onMouseLeave={isFocus ? () => setHoverStep(null) : undefined}
                style={{
                  position: 'absolute', left: 0, top: 0, transform: 'translate(-50%,-50%)',
                  width: size, height: size, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: selected ? hue : (hov ? `${hue}33` : '#15151b'),
                  border: `1px solid ${selected || hov ? hue : 'rgba(232,230,225,0.25)'}`,
                  color: selected ? '#0c0c0f' : (isFocus ? '#c9c9c4' : 'transparent'),
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600,
                  cursor: isFocus ? 'pointer' : 'default', opacity: isFocus ? 1 : 0.6,
                  boxShadow: selected ? `0 0 18px -2px ${hue}` : 'none',
                  transition: 'width .2s, height .2s, background .2s, border-color .2s',
                }}
              >
                {isFocus ? String(b.i + 1) : ''}
              </div>
              {labelStyle && <div style={labelStyle}>{b.label}</div>}
            </div>
          );
        })}
      </div>

      {/* Detail Dock */}
      <div style={{ borderTop: '1px solid rgba(232,230,225,0.1)', background: '#0a0a0d', minHeight: 188 }}>
        {!fAgent ? (
          <div style={{ padding: '30px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 28, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap' }}>
              {AGENTS.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, maxWidth: 230 }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: C[a.id as keyof typeof C], boxShadow: `0 0 10px ${C[a.id as keyof typeof C]}`, marginTop: 4 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{a.name}</div>
                    <div style={{ fontSize: 12.5, color: '#8b8b86', lineHeight: 1.45, marginTop: 2 }}>{a.role}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#5a5a5f', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.orch }} />select an agent above
            </div>
          </div>
        ) : (
          <div style={{ padding: '22px 28px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <button onClick={() => setFocus(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'transparent', border: '1px solid rgba(232,230,225,0.16)', color: '#9b9b96', borderRadius: 8, padding: '7px 11px', fontSize: 12, cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace" }}>← map</button>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: fHue, boxShadow: `0 0 12px ${fHue}` }} />
                <span style={{ fontSize: 16, fontWeight: 600 }}>{fAgent.name}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: fHue, border: `1px solid ${fHue}44`, borderRadius: 5, padding: '2px 7px' }}>{fAgent.tag}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#8b8b86' }}>
                <button onClick={() => setSel(s => (s - 1 + fAgent.steps.length) % fAgent.steps.length)} style={{ width: 26, height: 26, borderRadius: 7, border: '1px solid rgba(232,230,225,0.16)', background: 'transparent', color: '#c9c9c4', cursor: 'pointer' }}>‹</button>
                <span>step {String(sel + 1).padStart(2, '0')} / {fAgent.steps.length}</span>
                <button onClick={() => setSel(s => (s + 1) % fAgent.steps.length)} style={{ width: 26, height: 26, borderRadius: 7, border: '1px solid rgba(232,230,225,0.16)', background: 'transparent', color: '#c9c9c4', cursor: 'pointer' }}>›</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 26, alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 13, marginBottom: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 30, fontWeight: 600, color: fHue, lineHeight: 1 }}>{String(sel + 1).padStart(2, '0')}</span>
                  <span style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>{selStep?.label}</span>
                </div>
                <p style={{ fontSize: 14, color: '#b8b8b2', lineHeight: 1.6, margin: '0 0 16px', maxWidth: '54ch' }}>{selStep?.desc}</p>
                {selStep?.note && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, border: `1px solid ${fHue}33`, background: `${fHue}12`, borderRadius: 9, padding: '9px 13px', fontSize: 12.5, color: '#d6d6d1' }}>
                    <span style={{ color: fHue, fontFamily: "'JetBrains Mono',monospace" }}>{selStep.noteIcon}</span>{selStep.note}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6b6b6b', marginBottom: 11 }}>Produces</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
                  {fAgent.outputs.map(out => (
                    <span key={out} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#c9c9c4', border: '1px solid rgba(232,230,225,0.13)', borderRadius: 7, padding: '5px 9px' }}>{out}</span>
                  ))}
                </div>
                <div style={{ border: `1px solid ${fHue}2e`, background: `${fHue}0d`, borderRadius: 10, padding: '11px 13px' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: fHue }}>Guardrail · </span>
                  <span style={{ fontSize: 12, color: '#c9c9c4', lineHeight: 1.5 }}>{fAgent.guardrail}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ EXECUTION SIMULATION ============
function ExecutionSim() {
  const [run, setRun] = useState<{ active: boolean; done: boolean; step: number; logs: typeof LOGS_DATA }>({ active: false, done: false, step: -1, logs: [] });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const runPipeline = useCallback(() => {
    if (run.active) return;
    setRun({ active: true, done: false, step: -1, logs: [] });
    let i = 0;
    const tick = () => {
      if (i >= LOGS_DATA.length) {
        setRun(st => ({ ...st, active: false, done: true }));
        return;
      }
      setRun(st => ({ ...st, step: i, logs: [...st.logs, LOGS_DATA[i]] }));
      i++;
      timerRef.current = setTimeout(tick, i === 5 ? 950 : 640);
    };
    timerRef.current = setTimeout(tick, 320);
  }, [run.active]);

  const resetRun = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRun({ active: false, done: false, step: -1, logs: [] });
  }, []);

  const cur = run.step >= 0 ? LOGS_DATA[run.step].s : -1;
  const n = STAGE_DEFS.length;
  const tokenLeft = cur >= 0 ? `${((cur + 0.5) * 100 / n)}%` : '0%';
  const progressW = run.done ? '100%' : (cur >= 0 ? `${((cur + 0.5) * 100 / n)}%` : '0%');

  return (
    <div style={{ border: '1px solid rgba(232,230,225,0.12)', borderRadius: 20, background: 'linear-gradient(180deg,#131318,#0e0e12)', padding: '26px 26px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!run.active && !run.done && (
            <button onClick={runPipeline} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#e8e6e1', color: '#0c0c0f', border: 'none', borderRadius: 10, padding: '11px 18px', fontFamily: "'Geist',sans-serif", fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
              Run requirement<span style={{ fontFamily: "'JetBrains Mono',monospace" }}>▸</span>
            </button>
          )}
          {run.active && (
            <button disabled style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#1c1c22', color: '#9b9b96', border: '1px solid rgba(232,230,225,0.14)', borderRadius: 10, padding: '11px 18px', fontSize: 13.5, fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#58C39A', animation: 'livepulse 1s ease infinite' }} />Running…
            </button>
          )}
          {run.done && (
            <button onClick={resetRun} style={{ background: 'transparent', color: '#9b9b96', border: '1px solid rgba(232,230,225,0.14)', borderRadius: 10, padding: '11px 16px', fontSize: 13, cursor: 'pointer' }}>Reset</button>
          )}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, color: '#8b8b86', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.orch }} />tenant: enterprise-DEV
        </div>
      </div>

      {/* Stages */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {STAGE_DEFS.map((s, i) => {
          const reached = run.done || cur >= i;
          const active = cur === i && !run.done;
          const hue = C[s.owner as keyof typeof C];
          return (
            <div key={i} style={{
              flex: 1, border: `1px solid ${active ? hue + '88' : reached ? 'rgba(232,230,225,0.16)' : 'rgba(232,230,225,0.08)'}`,
              background: active ? `${hue}14` : '#131318', borderRadius: 12, padding: '13px 12px 14px', transition: 'all .35s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#6b6b6b' }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: reached ? hue : '#3a3a40', boxShadow: active ? `0 0 8px ${hue}` : 'none' }} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: reached ? '#e8e6e1' : '#7a7a7e', lineHeight: 1.25 }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ position: 'relative', height: 3, borderRadius: 3, background: 'rgba(232,230,225,0.08)', marginBottom: 24 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 3, background: 'linear-gradient(90deg,#D9A441,#9B8CFF)', width: progressW, transition: 'width .55s cubic-bezier(.4,.1,.2,1)' }} />
        <div style={{ position: 'absolute', top: '50%', width: 12, height: 12, borderRadius: '50%', background: '#fff', boxShadow: '0 0 14px #fff', left: tokenLeft, transform: 'translate(-50%,-50%)', transition: 'left .55s cubic-bezier(.4,.1,.2,1)', opacity: cur >= 0 ? 1 : 0 }} />
      </div>

      {/* Log + bulk stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 14 }}>
        <div style={{ background: '#0a0a0d', border: '1px solid rgba(232,230,225,0.1)', borderRadius: 12, padding: '16px 16px', minHeight: 218, fontFamily: "'JetBrains Mono',monospace" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 13, color: '#6b6b6b', fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3a3a40' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3a3a40' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3a3a40' }} />
            <span style={{ marginLeft: 6 }}>execution.log</span>
          </div>
          {run.logs.length === 0 ? (
            <div style={{ color: '#5a5a5f', fontSize: 12.5, lineHeight: 1.7 }}>
              Idle.<span style={{ animation: 'blink 1.1s step-end infinite', color: '#8b8b86' }}> ▋</span><br />
              Press <span style={{ color: '#9b9b96' }}>Run requirement</span> to stream a live execution.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {run.logs.map((line, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12.5, color: '#c9c9c4', lineHeight: 1.4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: C[line.o as keyof typeof C], marginTop: 5, flexShrink: 0 }} />
                  <span>{line.t}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: '#0f0f13', border: '1px solid rgba(232,230,225,0.1)', borderRadius: 12, padding: '18px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#6b6b6b', marginBottom: 14 }}>Now scale it — bulk mode</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: '-0.02em' }}>128</span>
            <span style={{ fontSize: 13, color: '#8b8b86' }}>requirements</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#8b8b86', textDecoration: 'line-through', textDecorationColor: '#5a5a5f' }}>≈ 3 days manual</span>
            <span style={{ color: '#58C39A', fontSize: 14 }}>→</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#58C39A', fontWeight: 600 }}>6 min automated</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN APP ============
export default function OrchestrationApp({ onOpenApp, appProps }: AppComponentProps) {
  const [focus, setFocus] = useState<string | null>(null);
  const [hoverAgent, setHoverAgent] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '48px 28px 100px', fontFamily: "'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", WebkitFontSmoothing: 'antialiased' }}>
      <style>{`
        @keyframes dashflow{to{stroke-dashoffset:-28}}
        @keyframes spin{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes livepulse{0%,100%{opacity:.45;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
        @keyframes pop{from{opacity:0;transform:translate(-50%,-50%) scale(.3)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
        @keyframes rise{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap', marginBottom: 50 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#e8e6e1', boxShadow: '0 0 12px #e8e6e1' }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8b8b86' }}>Nafiz Arnob · AML/KYC Automation</span>
          </div>
          <h1 style={{ fontSize: 46, lineHeight: 1.04, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 16px', maxWidth: '15ch', color: '#e8e6e1' }}>Three agents, one orchestrated config pipeline.</h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#9b9b96', maxWidth: '60ch', margin: 0 }}>
            A planning agent reads a requirement in any format, works out <em style={{ color: '#e8e6e1', fontStyle: 'normal' }}>what must change and why</em>, then hands a scoped package to a write operator that applies it automatically — collapsing days of manual bulk configuration into minutes.
          </p>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b6b6b', border: '1px solid rgba(232,230,225,0.12)', borderRadius: 999, padding: '8px 14px', whiteSpace: 'nowrap' }}>Interactive map</div>
      </header>

      {/* Map section */}
      <section style={{ marginBottom: 70 }}>
        <p style={{ fontSize: 13.5, color: '#7a7a7e', margin: '0 0 18px', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.04em' }}>Click an agent to open its pipeline · click a step bubble for detail</p>
        <OrchestrationGraph focus={focus} setFocus={setFocus} hoverAgent={hoverAgent} setHoverAgent={setHoverAgent} />
      </section>

      {/* Execution section */}
      <section style={{ marginBottom: 64 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 6, flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: 23, fontWeight: 600, letterSpacing: '-0.01em', margin: 0, color: '#e8e6e1' }}>See the handoff execute</h2>
        </div>
        <p style={{ fontSize: 14, color: '#8b8b86', margin: '0 0 22px', maxWidth: '74ch' }}>
          The orchestrator plans; the assistant writes. Press run to watch one requirement travel through the approval gate into automatic execution — then picture it across a whole backlog.
        </p>
        <ExecutionSim />
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(232,230,225,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 13, color: '#8b8b86', lineHeight: 1.5, maxWidth: '62ch' }}>Hover and click around the map — every agent opens its own pipeline, every step opens its detail.</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a5a5f' }}>Tenant data anonymized</div>
      </footer>
    </div>
  );
}
