'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DAD_JOKES = [
  "I told my computer I needed a break. Now it won't stop sending me KitKat ads.",
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "A SQL query walks into a bar, sees two tables, and asks... 'Can I JOIN you?'",
  "There are only 10 types of people: those who understand binary and those who don't.",
  "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
  "I'd tell you a UDP joke, but you might not get it.",
  "What's a programmer's favorite hangout place? Foo Bar.",
  "Why do Java developers wear glasses? Because they can't C#.",
  "How do you comfort a JavaScript bug? You console it.",
  "Why did the developer go broke? Because he used up all his cache.",
  "What do you call a developer who doesn't comment their code? A menace to society.",
  "REST in peace, boilerplate. GraphQL sends its regards.",
  "My code works, I have no idea why. My code doesn't work, I have no idea why.",
  "git commit -m 'fixed it' — narrator: he did not fix it.",
  "A QA engineer walks into a bar. Orders 1 beer. Orders 0 beers. Orders 99999999 beers. Orders -1 beers. Orders a lizard.",
  "The best thing about a Boolean is that even if you're wrong, you're only off by a bit.",
  "I have a joke about recursion, but first I have to tell you my joke about recursion.",
  "Debugging: being the detective in a crime movie where you are also the murderer.",
];

const COLORS = [
  { bg: '#fff9c4', border: '#f9e54a', text: '#5d4e00' },
  { bg: '#f8bbd0', border: '#f48fb1', text: '#5c1a33' },
  { bg: '#c8e6c9', border: '#81c784', text: '#1b4d1f' },
  { bg: '#bbdefb', border: '#64b5f6', text: '#0d3557' },
  { bg: '#e1bee7', border: '#ce93d8', text: '#4a1259' },
];

function pickRandom<T>(arr: T[], count: number, seed: number): T[] {
  const shuffled = [...arr];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export default function StickyNotes({ inline = false }: { inline?: boolean }) {
  const [notes, setNotes] = useState<{ joke: string; color: typeof COLORS[0]; rotation: number }[]>([]);

  useEffect(() => {
    const seed = Math.floor(Date.now() / 1000);
    const jokes = pickRandom(DAD_JOKES, 3, seed);
    const colors = pickRandom(COLORS, 3, seed + 1);
    setNotes(jokes.map((joke, i) => ({
      joke,
      color: colors[i],
      rotation: (((seed * (i + 1)) % 11) - 5),
    })));
  }, []);

  if (notes.length === 0) return null;

  return (
    <div className={inline ? 'flex flex-col gap-5' : 'absolute top-8 right-8 flex flex-col gap-5'} style={{ width: 200 }}>
      {notes.map((note, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8, rotate: note.rotation - 10 }}
          animate={{ opacity: 1, scale: 1, rotate: note.rotation }}
          transition={{ delay: 0.6 + i * 0.15, type: 'spring', stiffness: 260, damping: 18 }}
          style={{
            background: note.color.bg,
            border: `1px solid ${note.color.border}`,
            color: note.color.text,
            borderRadius: 4,
            padding: '14px 16px',
            boxShadow: '2px 3px 12px rgba(0,0,0,0.25)',
            fontFamily: '"Comic Sans MS", "Chalkboard SE", "Patrick Hand", cursive',
            fontSize: 13,
            lineHeight: 1.5,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 40,
              height: 12,
              background: 'rgba(255,255,255,0.6)',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          />
          {note.joke}
        </motion.div>
      ))}
      <p className="text-center text-white/20 text-[10px] mt-1" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
        refresh for new jokes
      </p>
    </div>
  );
}
