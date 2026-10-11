import React, { useState } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalLauncherProps {
  onOpen: () => void;
  hidden: boolean;
}

const SEEN_KEY = 'terminal_seen';

// Floating button visible on every screen size (phones have no ` key,
// and the navbar button is hidden there), pulsing until first use.
export const TerminalLauncher: React.FC<TerminalLauncherProps> = ({ onOpen, hidden }) => {
  const [seen, setSeen] = useState(() => {
    try { return localStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
  });

  if (hidden) return null;

  const handleClick = () => {
    try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* storage unavailable */ }
    setSeen(true);
    onOpen();
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Open developer terminal"
      className={`fixed bottom-5 right-5 z-40 flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-ink text-white text-sm font-bold shadow-xl shadow-ink/30 hover:bg-iris transition-colors ${seen ? '' : 'pulse-ring'}`}
    >
      <TerminalIcon className="w-4 h-4 text-mint" />
      Try the terminal
    </button>
  );
};

export default TerminalLauncher;
