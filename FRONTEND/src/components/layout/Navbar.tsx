import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Menu, X } from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolioData';

interface NavbarProps {
  onOpenTerminal: () => void;
}

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenTerminal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-paper/85 backdrop-blur-md border-b border-line py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 lg:px-8 flex items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-2.5 text-ink font-display font-bold text-lg tracking-tight">
          <span className="w-9 h-9 rounded-xl bg-iris text-white flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </span>
          <span>{PERSONAL_INFO.name}</span>
        </a>

        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-muted" aria-label="Primary">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-iris transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTerminal}
            className="hidden sm:inline-flex items-center gap-2 pl-3 pr-2.5 py-2 rounded-full bg-ink text-white text-sm font-bold hover:bg-iris transition-colors"
            title="Open Developer Terminal (press `)"
            aria-label="Open Developer Terminal"
          >
            <Terminal className="w-4 h-4 text-mint" />
            Terminal
            <kbd className="px-1.5 py-0.5 rounded bg-white/15 text-white/80 font-mono text-xs">`</kbd>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-ink"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-line px-5 pt-2 pb-5 mt-3 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 text-base font-medium text-ink hover:text-iris border-b border-line/70"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
