import React, { useEffect, useRef, useState } from 'react';
import { X, Terminal as TerminalIcon } from 'lucide-react';
import {
  PERSONAL_INFO,
  SKILL_CATEGORIES,
  EXPERIENCES,
  PROJECTS,
  CERTIFICATIONS,
  EDUCATION,
  ACHIEVEMENTS,
} from '../../data/portfolioData';
import { trackEvent } from '../../lib/track';

interface TerminalModalProps {
  open: boolean;
  onClose: () => void;
}

const SECTIONS = ['home', 'skills', 'experience', 'projects', 'certifications', 'contact'];
const QUICK_COMMANDS = ['help', 'about', 'skills', 'projects', 'contact'];

const INITIAL_LOGS = [
  'Portfolio OS v2.4.0 [x86_64-pc-linux-gnu]',
  "Welcome! Tap a command below, or type 'help'.",
];

export const TerminalModal: React.FC<TerminalModalProps> = ({ open, onClose }) => {
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [logs, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Lock page scroll behind the modal while it's open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    trackEvent('terminal_command', cmd);

    let response = '';
    switch (true) {
      case cmd === 'help':
        response = 'Available commands:\nabout, skills, projects, experience, certs, education, achievements,\ncontact, github, linkedin, resume, whoami, date, open <section>, clear';
        break;
      case cmd === 'about':
        response = `${PERSONAL_INFO.name} — ${PERSONAL_INFO.role}\n${PERSONAL_INFO.bio}`;
        break;
      case cmd === 'skills':
        response = SKILL_CATEGORIES.map(c => `${c.category}: ${c.skills.map(s => s.name).join(', ')}`).join('\n');
        break;
      case cmd === 'projects':
        response = PROJECTS.map(p => `• ${p.title} — ${p.tagline}`).join('\n');
        break;
      case cmd === 'experience':
        response = EXPERIENCES.map(e => `• ${e.role} @ ${e.company} (${e.period})`).join('\n');
        break;
      case cmd === 'certs':
        response = CERTIFICATIONS.map(c => `• ${c.title}`).join('\n');
        break;
      case cmd === 'education':
        response = EDUCATION.map(ed => `• ${ed.degree} — ${ed.institution}`).join('\n');
        break;
      case cmd === 'achievements':
        response = ACHIEVEMENTS.map(a => `• ${a.title} — ${a.description}`).join('\n') || 'No achievements listed yet.';
        break;
      case cmd === 'contact':
        response = `Email: ${PERSONAL_INFO.email}\nPhone: ${PERSONAL_INFO.phone}`;
        break;
      case cmd === 'github':
        response = PERSONAL_INFO.githubUrl || 'GitHub URL not configured yet.';
        break;
      case cmd === 'linkedin':
        response = PERSONAL_INFO.linkedinUrl || 'LinkedIn URL not configured yet.';
        break;
      case cmd.startsWith('open '): {
        const target = cmd.replace('open ', '').trim();
        if (SECTIONS.includes(target)) {
          document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
          onClose();
          response = `Navigating to #${target}...`;
        } else {
          response = `Unknown section '${target}'. Try: ${SECTIONS.join(', ')}`;
        }
        break;
      }
      case cmd === 'resume':
        response = PERSONAL_INFO.resumeUrl || 'Resume link not configured yet — reach out via email for now.';
        break;
      case cmd === 'whoami':
        response = 'guest@portfolio — you’re browsing as a visitor.';
        break;
      case cmd === 'date':
        response = new Date().toString();
        break;
      case cmd === 'sudo':
        response = 'Nice try. This visitor does not have root on this portfolio.';
        break;
      case cmd === 'clear':
        setLogs([]);
        setInput('');
        return;
      default:
        response = `Command not recognized: '${cmd}'. Type 'help' for commands.`;
    }

    setLogs(prev => [...prev, `> ${raw.trim()}`, response]);
    setInput('');
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Developer terminal"
    >
      <div
        className="w-full max-w-3xl bg-term rounded-2xl shadow-2xl shadow-iris/30 overflow-hidden font-mono text-sm flex flex-col max-h-[85vh] border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 bg-term-bar flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-coral" aria-label="Close terminal" />
            <span className="w-3 h-3 rounded-full bg-amber-300/80" />
            <span className="w-3 h-3 rounded-full bg-mint/80" />
            <span className="ml-3 flex items-center gap-2 text-white/70 text-xs">
              <TerminalIcon className="w-3.5 h-3.5" /> priyal@portfolio:~
            </span>
          </div>
          <div className="flex items-center gap-3 text-white/50">
            <span className="hidden sm:inline text-xs">Esc to close</span>
            <button onClick={onClose} className="hover:text-white" aria-label="Close terminal">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 h-[50vh] min-h-[260px] overflow-y-auto space-y-2 leading-relaxed">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={`whitespace-pre-wrap break-words ${log.startsWith('> ') ? 'text-mint' : 'text-white/80'}`}
            >
              {log}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="px-4 pt-3 flex flex-wrap gap-2 border-t border-white/10">
          {QUICK_COMMANDS.map((c) => (
            <button
              key={c}
              onClick={() => run(c)}
              className="px-3 py-1.5 rounded-full text-xs text-mint bg-mint/10 hover:bg-mint/20 border border-mint/25 transition-colors"
            >
              {c}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); run(input); }}
          className="p-3 flex items-center gap-2"
        >
          <span className="text-mint pl-2">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command and press Enter"
            aria-label="Terminal command"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-base sm:text-sm"
          />
        </form>
      </div>
    </div>
  );
};

export default TerminalModal;
