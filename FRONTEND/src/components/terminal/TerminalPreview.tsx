import React, { useEffect, useMemo, useState } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { PERSONAL_INFO, SKILL_CATEGORIES, PROJECTS } from '../../data/portfolioData';

interface TerminalPreviewProps {
  onOpen: () => void;
}

interface Step {
  cmd: string;
  out: string[];
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// A self-playing demo of the real terminal that lives in the hero.
export const TerminalPreview: React.FC<TerminalPreviewProps> = ({ onOpen }) => {
  const script: Step[] = useMemo(
    () => [
      { cmd: 'whoami', out: [`${PERSONAL_INFO.name}, ${PERSONAL_INFO.role}`] },
      { cmd: 'skills', out: SKILL_CATEGORIES.map(c => c.category) },
      { cmd: 'projects', out: PROJECTS.map(p => p.title) },
      { cmd: 'help', out: ['about, skills, projects, contact ...', 'and a few secrets 🤫'] },
    ],
    []
  );

  const [reduced] = useState(prefersReducedMotion);
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
  const [showOut, setShowOut] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const current = script[step];
    let t: ReturnType<typeof setTimeout>;

    if (!showOut) {
      if (typed < current.cmd.length) {
        t = setTimeout(() => setTyped(typed + 1), 80);
      } else {
        t = setTimeout(() => setShowOut(true), 350);
      }
    } else if (step < script.length - 1) {
      t = setTimeout(() => { setStep(step + 1); setTyped(0); setShowOut(false); }, 1300);
    } else {
      t = setTimeout(() => { setStep(0); setTyped(0); setShowOut(false); }, 3500);
    }
    return () => clearTimeout(t);
  }, [reduced, script, step, typed, showOut]);

  const done = reduced ? script : script.slice(0, step);

  return (
    <div className="relative">
      {/* Sticker that says what this is */}
      <div className="absolute -top-4 -right-2 sm:-right-5 z-10 rotate-6 bg-coral text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-coral/30">
        Psst. It’s interactive
      </div>

      <div className="rounded-2xl bg-term shadow-2xl shadow-iris/25 overflow-hidden border border-white/10 font-mono text-[13px] sm:text-sm">
        <div className="px-4 py-3 bg-term-bar flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-coral" />
          <span className="w-3 h-3 rounded-full bg-amber-300/80" />
          <span className="w-3 h-3 rounded-full bg-mint/80" />
          <span className="ml-3 text-white/60 text-xs">priyal@portfolio:~</span>
        </div>

        <div
          className="p-5 h-[280px] overflow-hidden space-y-1.5 text-white/80 cursor-pointer"
          onClick={onOpen}
          aria-hidden="true"
        >
          {done.map((s) => (
            <div key={s.cmd}>
              <div className="text-mint">&gt; {s.cmd}</div>
              {s.out.map((line, i) => <div key={i} className="text-white/70">{line}</div>)}
            </div>
          ))}
          {!reduced && (
            <div>
              <div className="text-mint">
                &gt; {script[step].cmd.slice(0, typed)}
                {!showOut && <span className="caret" />}
              </div>
              {showOut && script[step].out.map((line, i) => (
                <div key={i} className="text-white/70">{line}</div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onOpen}
          className="w-full px-4 py-3.5 bg-iris hover:bg-iris-deep transition-colors text-white font-sans font-bold text-sm flex items-center justify-center gap-2.5"
        >
          <TerminalIcon className="w-4 h-4" />
          Open the terminal
          <span className="hidden sm:inline-flex items-center gap-1.5 text-white/70 font-normal">
            or press
            <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-xs">`</kbd>
          </span>
        </button>
      </div>
    </div>
  );
};

export default TerminalPreview;
