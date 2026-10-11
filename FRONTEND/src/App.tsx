import React, { useState, useEffect } from 'react';
import {
  Code, Mail, Send, ChevronDown, Eye, X, ExternalLink, FileDown, Trophy, GraduationCap, Award,
} from 'lucide-react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import SEO from './components/common/SEO';
import AccessibilityManager from './components/common/AccessibilityManager';
import TerminalModal from './components/terminal/TerminalModal';
import TerminalPreview from './components/terminal/TerminalPreview';
import TerminalLauncher from './components/terminal/TerminalLauncher';
import { trackEvent } from './lib/track';

import {
  PERSONAL_INFO,
  SKILL_CATEGORIES,
  EXPERIENCES,
  PROJECTS,
  CERTIFICATIONS,
  EDUCATION,
  ACHIEVEMENTS,
  ENGINEERING_TIMELINE,
} from './data/portfolioData';

import type { Project, Experience, SkillCategory } from './data/portfolioData';

const PROJECT_TINTS = ['bg-iris-soft', 'bg-peach', 'bg-mint-soft'];

// ---- Experience helpers (LinkedIn-style: one company, several roles) ----
// Newest role first.
const ROLES: Experience[] = [...EXPERIENCES].sort(
  (a, b) => b.startYear * 12 + b.startMonth - (a.startYear * 12 + a.startMonth)
);

const monthsBetween = (sy: number, sm: number, ey: number, em: number) => (ey - sy) * 12 + (em - sm) + 1;

const formatDuration = (months: number) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} yr${y > 1 ? 's' : ''}`);
  if (m) parts.push(`${m} mo${m > 1 ? 's' : ''}`);
  return parts.join(' ') || '1 mo';
};

const roleDuration = (e: Experience) => {
  const now = new Date();
  return formatDuration(
    monthsBetween(e.startYear, e.startMonth, e.endYear ?? now.getFullYear(), e.endMonth ?? now.getMonth() + 1)
  );
};

// Total time at the company: earliest start until today (or the latest end if no current role).
const companyDuration = () => {
  const now = new Date();
  const first = ROLES[ROLES.length - 1];
  const hasCurrent = ROLES.some((r) => r.endYear === undefined);
  const lastEnd = ROLES.reduce(
    (max, r) => (r.endYear !== undefined && r.endYear * 12 + (r.endMonth ?? 12) > max.y * 12 + max.m ? { y: r.endYear, m: r.endMonth ?? 12 } : max),
    { y: first.startYear, m: first.startMonth }
  );
  const end = hasCurrent ? { y: now.getFullYear(), m: now.getMonth() + 1 } : lastEnd;
  return formatDuration(monthsBetween(first.startYear, first.startMonth, end.y, end.m));
};

const architectureDetails: Record<string, { nodeLabel: string; title: string; desc: string; tech: string[] }> = {
  React: {
    nodeLabel: 'Frontend',
    title: 'Frontend Architecture',
    desc: 'Component-driven UI built with React and TypeScript across Admin, Store, and Customer portal work.',
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  Django: {
    nodeLabel: 'Backend',
    title: 'Django REST API Layer',
    desc: 'Python backend handling business logic, authentication, and REST APIs for production modules.',
    tech: ['Python', 'Django REST Framework', 'JWT', 'OAuth 2.0'],
  },
  PostgreSQL: {
    nodeLabel: 'Database',
    title: 'Relational Database Layer',
    desc: 'Schema design, indexing, stored procedures, and query restructuring used to cut a dashboard’s load time from minutes to seconds.',
    tech: ['PostgreSQL', 'SQL Server', 'Indexing', 'Stored Procedures'],
  },
  Cloud: {
    nodeLabel: 'Deployment',
    title: 'Deployment & Cloud',
    desc: 'AWS S3 for secure multi-file upload, plus Windows Server deployment including build packaging and database backup/restore.',
    tech: ['AWS S3', 'Windows Server', 'Azure (AZ-900)'],
  },
};

const SectionHeading: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => (
  <div className="mb-8">
    <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink">{title}</h2>
    {sub && <p className="text-muted mt-2 max-w-xl">{sub}</p>}
  </div>
);

const Chip: React.FC<{ children: React.ReactNode; tone?: 'iris' | 'plain' }> = ({ children, tone = 'plain' }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
      tone === 'iris' ? 'bg-iris-soft text-iris-deep' : 'bg-white/70 text-ink border border-ink/10'
    }`}
  >
    {children}
  </span>
);

const FORMSPREE_URL = 'https://formspree.io/f/mljgnyeb';

export const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expandedExperience, setExpandedExperience] = useState<string | null>(ROLES[0]?.id || null);
  const [activeArchNode, setActiveArchNode] = useState<string>('React');
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', website: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'sent' | 'saved_not_sent' | 'error'>('idle');
  const [contactErrorDetail, setContactErrorDetail] = useState<string | null>(null);

  // Log one page_view per browser session.
  useEffect(() => {
    if (!sessionStorage.getItem('pv_logged')) {
      trackEvent('page_view', window.location.pathname);
      sessionStorage.setItem('pv_logged', '1');
    }
  }, []);

  // Easter egg: press ` (or ~) anywhere outside a text field to toggle the terminal.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping = target && ['INPUT', 'TEXTAREA'].includes(target.tagName);
      if ((e.key === '`' || e.key === '~') && !isTyping) {
        e.preventDefault();
        setShowTerminal((prev) => !prev);
      }
      if (e.key === 'Escape') setShowTerminal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sends the form to Formspree, which emails the message to the site owner.
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactStatus('error');
      setContactErrorDetail('Please fill in all fields.');
      return;
    }

    // Honeypot: real visitors never see this field. If it is filled it's a bot,
    // so pretend success and send nothing.
    if (contactForm.website) {
      setContactStatus('sent');
      return;
    }

    setContactStatus('loading');
    setContactErrorDetail(null);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
        }),
      });

      if (res.ok) {
        setContactStatus('sent');
        setContactForm({ name: '', email: '', message: '', website: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setContactStatus('error');
        setContactErrorDetail(
          data?.errors?.[0]?.message ||
            `Could not send your message. Please email ${PERSONAL_INFO.email} directly.`
        );
      }
    } catch {
      setContactStatus('error');
      setContactErrorDetail(`Could not send your message. Please email ${PERSONAL_INFO.email} directly.`);
    }
  };

  const inputClass =
    'w-full p-3.5 rounded-xl bg-paper border border-line text-base sm:text-sm text-ink placeholder-muted/70 focus:outline-none focus:border-iris focus:ring-2 focus:ring-iris/20';

  return (
    <AccessibilityManager>
      <MotionConfig reducedMotion="user">
        <SEO />

        <div className="min-h-screen bg-paper text-ink font-sans selection:bg-iris selection:text-white">
          <Navbar onOpenTerminal={() => setShowTerminal(true)} />

          <main className="max-w-6xl mx-auto px-5 lg:px-8 pb-16 pt-28 space-y-28">

            {/* Hero */}
            <section id="home" className="relative grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-14 items-center pt-6 lg:pt-12">
              <div className="dot-grid absolute -inset-x-8 -top-28 h-[34rem] -z-10 pointer-events-none" aria-hidden="true" />

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-line text-sm text-muted">
                  <span className="w-2 h-2 rounded-full bg-coral" />
                  {PERSONAL_INFO.tagline}
                </div>

                <h1 className="font-display font-extrabold tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl text-ink">
                  {PERSONAL_INFO.name}
                  <span className="block text-muted font-bold text-3xl sm:text-4xl lg:text-5xl mt-3">
                    {PERSONAL_INFO.role}
                  </span>
                </h1>

                <p className="text-lg text-muted max-w-xl leading-relaxed">{PERSONAL_INFO.bio}</p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#projects"
                    className="px-6 py-3 rounded-full bg-iris hover:bg-iris-deep text-white font-bold text-sm transition-colors inline-flex items-center gap-2 shadow-lg shadow-iris/25"
                  >
                    <Code className="w-4 h-4" />
                    Explore projects
                  </a>
                  {PERSONAL_INFO.resumeUrl && (
                    <a
                      href={PERSONAL_INFO.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackEvent('resume_download', 'hero_button')}
                      className="px-6 py-3 rounded-full bg-white hover:bg-iris-soft text-ink font-bold text-sm border border-line transition-colors inline-flex items-center gap-2"
                    >
                      <FileDown className="w-4 h-4" />
                      Download resume
                    </a>
                  )}
                  {PERSONAL_INFO.githubUrl && (
                    <a href={PERSONAL_INFO.githubUrl} target="_blank" rel="noreferrer" className="px-3 py-3 text-sm font-medium text-muted hover:text-iris inline-flex items-center gap-1.5">
                      <ExternalLink className="w-4 h-4" /> GitHub
                    </a>
                  )}
                  {PERSONAL_INFO.linkedinUrl && (
                    <a href={PERSONAL_INFO.linkedinUrl} target="_blank" rel="noreferrer" className="px-3 py-3 text-sm font-medium text-muted hover:text-iris inline-flex items-center gap-1.5">
                      <ExternalLink className="w-4 h-4" /> LinkedIn
                    </a>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              >
                <TerminalPreview onOpen={() => setShowTerminal(true)} />
              </motion.div>
            </section>

            {/* Architecture */}
            <section aria-labelledby="arch-title">
              <div className="mb-8">
                <h2 id="arch-title" className="font-display text-3xl sm:text-4xl font-bold tracking-tight">How I build</h2>
                <p className="text-muted mt-2 max-w-xl">Pick a layer to see what I’ve built there.</p>
              </div>

              <div className="grid lg:grid-cols-[18rem_1fr] gap-4">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                  {Object.keys(architectureDetails).map((key) => {
                    const active = activeArchNode === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveArchNode(key)}
                        aria-pressed={active}
                        className={`p-4 rounded-2xl text-left transition-colors border ${
                          active ? 'bg-ink text-white border-ink' : 'bg-white text-ink border-line hover:border-iris/50'
                        }`}
                      >
                        <div className={`text-sm ${active ? 'text-mint' : 'text-muted'}`}>{architectureDetails[key].nodeLabel}</div>
                        <div className="font-display text-xl font-bold mt-0.5">{key}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-7 sm:p-9 rounded-3xl bg-iris-soft flex flex-col justify-center space-y-4">
                  <h3 className="font-display text-2xl font-bold">{architectureDetails[activeArchNode].title}</h3>
                  <p className="text-ink/80 leading-relaxed max-w-xl">{architectureDetails[activeArchNode].desc}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {architectureDetails[activeArchNode].tech.map((t) => <Chip key={t}>{t}</Chip>)}
                  </div>
                </div>
              </div>
            </section>

            {/* Skills */}
            <section id="skills">
              <SectionHeading title="What I work with" sub="Every skill here comes with the work that backs it up, not a self-rated score." />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {SKILL_CATEGORIES.map((cat: SkillCategory) => (
                  <div key={cat.category} className="p-6 rounded-3xl bg-white border border-line space-y-4">
                    <h3 className="font-display text-xl font-bold">{cat.category}</h3>
                    <div className="space-y-4">
                      {cat.skills.map((skill) => (
                        <div key={skill.name}>
                          <div className="text-sm font-bold text-iris-deep">{skill.name}</div>
                          <p className="text-sm text-muted leading-snug mt-1">{skill.evidence}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Experience */}
            <section id="experience">
              <SectionHeading title="Where I’ve worked" sub="Professional history at Adrta Technologies Pvt. Ltd." />

              <div className="rounded-3xl bg-white border border-line p-5 sm:p-8">
                {/* Company header (shown once, like LinkedIn) */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl bg-iris text-white font-display text-2xl font-bold flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    {ROLES[0].company.charAt(0).toLowerCase()}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold leading-tight">{ROLES[0].company}</h3>
                    <div className="text-sm text-ink/80 mt-1">{companyDuration()}</div>
                    <div className="text-sm text-muted">{ROLES[0].location} · On-site</div>
                  </div>
                </div>

                {/* Roles at this company, newest first */}
                <ol className="mt-6 ml-5 border-l-2 border-line pl-6 space-y-3">
                  {ROLES.map((exp: Experience) => {
                    const isExpanded = expandedExperience === exp.id;
                    return (
                      <li key={exp.id} className="relative">
                        <span
                          className="absolute -left-[1.95rem] top-6 w-3 h-3 rounded-full bg-iris border-2 border-white"
                          aria-hidden="true"
                        />
                        <div className="rounded-2xl border border-line overflow-hidden">
                          <button
                            onClick={() => setExpandedExperience(isExpanded ? null : exp.id)}
                            aria-expanded={isExpanded}
                            className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-iris-soft/40 transition-colors"
                          >
                            <div>
                              <div className="font-display text-lg font-bold">{exp.role}</div>
                              <div className="text-sm text-muted mt-0.5">{exp.employmentType}</div>
                              <div className="text-sm text-muted">{exp.period} · {roleDuration(exp)}</div>
                            </div>
                            <ChevronDown className={`w-5 h-5 mt-1 text-iris shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5 space-y-5">
                                  <ul className="space-y-2.5 text-sm text-ink/80 leading-relaxed list-disc pl-5 marker:text-iris">
                                    {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                                  </ul>
                                  <div className="p-4 rounded-2xl bg-mint-soft text-sm text-ink">
                                    <strong>Key result: </strong>{exp.keyResult}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {exp.technologies.map((t) => <Chip key={t} tone="iris">{t}</Chip>)}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </section>

            {/* Projects */}
            <section id="projects">
              <SectionHeading title="Things I’ve built" sub="Documented projects with the technologies actually used." />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PROJECTS.map((proj: Project, i) => (
                  <article key={proj.id} className={`p-7 rounded-[2rem] flex flex-col justify-between gap-6 ${PROJECT_TINTS[i % PROJECT_TINTS.length]}`}>
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-ink/60">{proj.tagline}</p>
                      <h3 className="font-display text-2xl font-bold leading-tight">{proj.title}</h3>
                      <p className="text-sm text-ink/80 leading-relaxed">{proj.overview}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies.map((t) => <Chip key={t}>{t}</Chip>)}
                      </div>
                      <button
                        onClick={() => setSelectedProject(proj)}
                        className="w-full py-3 rounded-full bg-ink hover:bg-iris text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View details
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Journey */}
            <section>
              <SectionHeading title="My journey so far" />
              <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
                {ENGINEERING_TIMELINE.map((step) => (
                  <li key={step.title} className="relative border-t-2 border-line pt-6">
                    <span className="absolute -top-[7px] left-0 w-3 h-3 rounded-full bg-iris" aria-hidden="true" />
                    <div className="text-sm font-bold text-iris-deep">{step.date}</div>
                    <div className="font-display text-lg font-bold mt-1">{step.title}</div>
                    <p className="text-sm text-muted mt-1.5 leading-snug">{step.description}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Education + Achievements */}
            <section className="grid lg:grid-cols-[1.4fr_1fr] gap-10">
              <div>
                <SectionHeading title="Education" />
                <div className="space-y-4">
                  {EDUCATION.map((ed) => (
                    <div key={ed.id} className="p-6 rounded-3xl bg-white border border-line flex gap-4">
                      <GraduationCap className="w-6 h-6 text-iris shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold text-iris-deep">{ed.period}</div>
                        <div className="font-display text-lg font-bold">{ed.degree}</div>
                        <p className="text-sm text-muted">{ed.institution}</p>
                        {ed.detail && <p className="text-sm text-muted mt-0.5">{ed.detail}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <SectionHeading title="Achievements" />
                <div className="space-y-4">
                  {ACHIEVEMENTS.map((ach) => (
                    <div key={ach.id} className="p-6 rounded-3xl bg-ink text-white flex gap-4">
                      <Trophy className="w-6 h-6 text-mint shrink-0 mt-0.5" />
                      <div>
                        <div className="font-display text-lg font-bold">{ach.title}</div>
                        <p className="text-sm text-white/70 mt-1">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Certifications */}
            <section id="certifications">
              <SectionHeading title="Certifications" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CERTIFICATIONS.map((cert) => (
                  <div key={cert.id} className="p-5 rounded-2xl bg-white border border-line flex gap-3">
                    <Award className="w-5 h-5 text-coral shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm text-muted">{cert.issuer}{cert.issueDate ? `, ${cert.issueDate}` : ''}</div>
                      <div className="font-bold leading-snug mt-0.5">{cert.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section id="contact" className="rounded-[2rem] bg-ink text-white p-8 sm:p-12 grid lg:grid-cols-[1fr_1.1fr] gap-10">
              <div className="space-y-4">
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Let’s work together</h2>
                <p className="text-white/70 max-w-sm leading-relaxed">
                  Have a role, a project, or a question? Email{' '}
                  <a href={`mailto:${PERSONAL_INFO.email}`} className="text-mint underline underline-offset-4">{PERSONAL_INFO.email}</a>
                  {' '}or send a message with the form.
                </p>
                <p className="text-white/50 text-sm flex items-center gap-2"><Mail className="w-4 h-4" /> {PERSONAL_INFO.location}</p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4 bg-white text-ink rounded-3xl p-6">
                {/* Honeypot: hidden from real visitors, bots that auto-fill every field trip it. */}
                <input
                  type="text"
                  name="website"
                  value={contactForm.website}
                  onChange={(e) => setContactForm({ ...contactForm, website: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute w-0 h-0 opacity-0 pointer-events-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    aria-label="Your name"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    aria-label="Your email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <textarea
                  rows={4}
                  placeholder="Your message"
                  aria-label="Your message"
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className={inputClass}
                />

                {contactStatus === 'error' && (
                  <div className="text-sm text-rose-600" role="alert">{contactErrorDetail || 'Something went wrong. Please try again.'}</div>
                )}
                {contactStatus === 'sent' && (
                  <div className="text-sm text-emerald-700" role="status">Message sent. Thanks for reaching out, you should get a reply soon.</div>
                )}
                {contactStatus === 'saved_not_sent' && (
                  <div className="text-sm text-amber-700" role="status">
                    {contactErrorDetail} Your message was saved. You can also reach me at{' '}
                    <a href={`mailto:${PERSONAL_INFO.email}`} className="underline">{PERSONAL_INFO.email}</a>.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={contactStatus === 'loading'}
                  className="px-6 py-3 rounded-full bg-iris hover:bg-iris-deep disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors inline-flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {contactStatus === 'loading' ? 'Sending...' : 'Send message'}
                </button>
              </form>
            </section>
          </main>

          {/* Modal: Project details */}
          {selectedProject && (
            <div
              className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedProject(null)}
              role="dialog"
              aria-modal="true"
              aria-label={selectedProject.title}
            >
              <div
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-7 sm:p-9 space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-bold">{selectedProject.title}</h3>
                    <p className="text-sm text-muted mt-1">{selectedProject.tagline}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-full bg-paper text-muted hover:text-ink"
                    aria-label="Close project details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-5 text-sm text-ink/80">
                  <div>
                    <h4 className="font-bold text-ink mb-1.5">Overview</h4>
                    <p className="leading-relaxed bg-paper p-4 rounded-2xl">{selectedProject.overview}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-ink mb-1.5">Key features</h4>
                    <ul className="list-disc pl-5 space-y-1 marker:text-iris">
                      {selectedProject.keyFeatures.map((feat) => <li key={feat}>{feat}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-ink mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((t) => <Chip key={t} tone="iris">{t}</Chip>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <TerminalModal open={showTerminal} onClose={() => setShowTerminal(false)} />
          <TerminalLauncher onOpen={() => setShowTerminal(true)} hidden={showTerminal} />

          <footer className="border-t border-line py-8 px-5 text-center text-sm text-muted">
            <p>{PERSONAL_INFO.name} · Full Stack Developer · Built with React, TypeScript & Django</p>
          </footer>
        </div>
      </MotionConfig>
    </AccessibilityManager>
  );
};

export default App;