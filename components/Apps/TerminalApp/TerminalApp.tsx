'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { AppComponentProps } from '@/types';

interface Line {
  type: 'input' | 'output' | 'error';
  text: string;
}

const COMMANDS: Record<string, string | string[]> = {
  help: [
    'Available commands:',
    '  about      — who am I',
    '  skills     — tech stack',
    '  projects   — list all projects',
    '  contact    — get in touch',
    '  clear      — clear terminal',
  ],
  about: [
    'Md Nafiz Arnob — Product Consultant & Developer',
    'Company  : Fenergo (3+ years)',
    'Domain   : AML/KYC, CLM, Financial Crime Compliance',
    'Location : Sydney, NSW, Australia',
    'Education: UTS BSc IT — Interaction Design (GPA 6.25)',
    'Award    : Best FEIT Digital Prototype',
  ],
  skills: [
    'Frontend  : Next.js · React · TypeScript · Tailwind CSS',
    'Backend   : Node.js · Python · Flask · PostgreSQL · Prisma',
    'Domain    : AML/KYC · CLM · Fenergo · Financial Crime',
    'Tools     : GitHub · Vercel · REST APIs · openpyxl',
  ],
  projects: [
    '📁 Shopnopuri   — Next.js · TypeScript · i18n (github.com/nafizarnob/shopnopuri-website)',
    '🐾 PawFound     — Next.js 14 · Prisma · PostgreSQL (pawfound.vercel.app)',
    '⚙️  Fenergo Tools — Python · Flask · REST APIs (contact for details)',
  ],
  contact: [
    'Email    : jagerotiai@gmail.com',
    'GitHub   : github.com/nafizarnob',
    'LinkedIn : linkedin.com/in/mdarn',
  ],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TerminalApp(_props: AppComponentProps) {
  const [lines, setLines] = useState<Line[]>([
    { type: 'output', text: 'Welcome to Nafiz OS Terminal v1.0' },
    { type: 'output', text: 'Type "help" to see available commands.' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    setLines((prev) => [...prev, { type: 'input', text: `nafiz@portfolio:~$ ${cmd}` }]);

    if (!trimmed) return;

    setHistory((h) => [trimmed, ...h].slice(0, 50));
    setHistoryIndex(-1);

    if (trimmed === 'clear') {
      setLines([]);
      return;
    }

    const result = COMMANDS[trimmed];
    if (result) {
      const outputs = Array.isArray(result) ? result : [result];
      setLines((prev) => [
        ...prev,
        ...outputs.map((t) => ({ type: 'output' as const, text: t })),
        { type: 'output', text: '' },
      ]);
    } else {
      setLines((prev) => [
        ...prev,
        { type: 'error', text: `command not found: ${trimmed}. Type "help" for options.` },
        { type: 'output', text: '' },
      ]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      setInput(newIndex === -1 ? '' : history[newIndex]);
    }
  };

  return (
    <div
      className="h-full flex flex-col font-mono text-sm cursor-text p-4 overflow-hidden"
      style={{ background: '#0d0e16', color: '#c0caf5' }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto space-y-0.5">
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.type === 'input'
                ? 'text-green-400'
                : line.type === 'error'
                ? 'text-red-400'
                : 'text-gray-300'
            }
          >
            {line.text || ' '}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
        <span className="text-green-400 shrink-0">nafiz@portfolio:~$</span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-gray-200 caret-green-400"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
