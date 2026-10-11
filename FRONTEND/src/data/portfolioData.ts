// ---------------------------------------------------------------------------
// SOURCE OF TRUTH: Priyal Gandhi's resume.
// Every field here must trace back to something actually on the resume.
// Do not add invented metrics, employers, dates, or results here — if
// something is missing, leave it as an empty string / TODO marker instead
// of guessing, and surface it to Priyal to fill in.
// ---------------------------------------------------------------------------

export interface PersonalInfo {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  // TODO: paste actual profile URLs here — the resume PDF links to GitHub/LinkedIn
  // but the plain-text extraction doesn't include the URLs themselves.
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
}

export interface SkillCategory {
  category: string;
  skills: { name: string; evidence: string }[];
}

export interface Experience {
  id: string;
  company: string;
  location: string;
  role: string;
  period: string;
  description: string[];
  technologies: string[];
  keyResult: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  overview: string;
  technologies: string[];
  keyFeatures: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  verificationUrl?: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  detail?: string;
  period: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export interface EngineeringTimelineStep {
  date: string;
  title: string;
  description: string;
}

export const PERSONAL_INFO: PersonalInfo = {
  name: 'Priyal Gandhi',
  role: 'Full Stack Developer',
  tagline: 'Build. Secure. Optimize.',
  bio: 'Full stack developer building scalable, secure web applications with React, TypeScript, and Django REST Framework backed by PostgreSQL — from API design and authentication through database optimization and production deployment.',
  email: 'priyalg234@gmail.com',
  phone: '+91 9978602646',
  location: 'Ahmedabad, India',
  githubUrl: 'https://github.com/PriyalGandhi19',
  linkedinUrl: 'https://www.linkedin.com/in/priyal-gandhi-a88502264/',
  resumeUrl: '/resume.pdf',
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'Frontend',
    skills: [
      { name: 'React.js', evidence: 'Built production features and interfaces across Admin, Store, and Customer portals at Adrta Technologies.' },
      { name: 'TypeScript / JavaScript', evidence: 'Used across full-stack feature development and the DriveXo cab-booking interface.' },
      { name: 'HTML5 / CSS3 / Bootstrap', evidence: 'Built the fully responsive DriveXo interface.' },
    ],
  },
  {
    category: 'Backend & APIs',
    skills: [
      { name: 'Python', evidence: 'Backend development plus Selenium-based automation scripts.' },
      { name: 'Django REST Framework', evidence: 'Built and maintained REST APIs and CRUD workflows across production modules.' },
      { name: 'JWT & OAuth 2.0', evidence: 'Implemented authentication with JWT and Google OAuth 2.0 across all user roles and portals.' },
      { name: 'Role-Based Access Control (RBAC)', evidence: 'Designed dynamic role-based permissions securing multi-portal access.' },
    ],
  },
  {
    category: 'Database',
    skills: [
      { name: 'PostgreSQL', evidence: 'Query optimization, indexing, and stored procedures; reduced a dashboard\u2019s load time from several minutes to seconds using temporary tables.' },
      { name: 'SQL Server', evidence: 'Listed technical skill; used alongside PostgreSQL work.' },
    ],
  },
  {
    category: 'Cloud & Tools',
    skills: [
      { name: 'AWS S3', evidence: 'Integrated for secure multi-file upload.' },
      { name: 'Microsoft Azure', evidence: 'AZ-900 (Azure Fundamentals) certified.' },
      { name: 'Windows Server', evidence: 'Managed deployments including build packaging, database backup/restore, and post-deployment validation.' },
      { name: 'Git / GitHub', evidence: 'Version control across all projects and production work.' },
      { name: 'Cloudflare Tunnel, Supabase, Firebase, Google OAuth, Power BI', evidence: 'Listed technical tools used in project and production work.' },
    ],
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'exp-intern',
    company: 'Adrta Technologies Pvt. Ltd.',
    location: 'Ahmedabad, India',
    role: 'Software Developer Intern',
    period: 'Feb 2026 – Jul 2026',
    description: [
      'Contributed to feature development across Admin, Store, and Customer portals, building REST APIs and CRUD workflows as part of 3+ production modules.',
      'Built production modules (Customer Support, Species Management, Task Management), handling backend design and database schema while collaborating with the team to align features with client requirements.',
      'Implemented authentication & RBAC with JWT, Google OAuth 2.0, and dynamic role-based permissions, securing access across all user roles and portals.',
      'Optimized PostgreSQL performance through stored procedures, indexing, and query restructuring, and built a centralized error-logging system to speed up debugging.',
      'Executed cloud deployments by integrating AWS S3 for secure multi-file upload and managing Windows Server deployments, including build packaging, PostgreSQL backup/restore, and post-deployment validation.',
    ],
    technologies: ['React', 'TypeScript', 'Django REST Framework', 'PostgreSQL', 'JWT', 'Google OAuth 2.0', 'AWS S3', 'Windows Server'],
    keyResult: 'Reduced one dashboard\u2019s load time from several minutes to seconds using stored procedures, indexing, and temporary tables.',
  },
  {
    id: 'exp-junior',
    company: 'Adrta Technologies Pvt. Ltd.',
    location: 'Ahmedabad, India',
    role: 'Junior Software Engineer',
    period: 'Present',
    description: [
      'Contributed to an in-house product across backend, frontend, and database layers, developing and maintaining features using Django REST Framework, TypeScript, and PostgreSQL, while resolving reported bugs across the application.',
      'Developed Python/Selenium web-scraping automation and browser-console scripts to automate repetitive data-entry workflows, reducing manual effort and improving operational efficiency.',
      'Implemented application-level security and session controls, including middleware to enforce single active sessions per user and React-based protections against unauthorized developer-tool inspection and transaction manipulation.',
    ],
    technologies: ['Django REST Framework', 'TypeScript', 'PostgreSQL', 'Python', 'Selenium', 'React'],
    keyResult: 'Built middleware enforcing single active sessions per user and client-side protections against unauthorized inspection and transaction manipulation.',
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'task-management-system',
    title: 'Task Management System',
    tagline: 'Role-based task management platform',
    overview: 'Built a role-based task management platform with JWT-secured CRUD workflows, audit logging, and database schema triggers for data integrity.',
    technologies: ['React', 'TypeScript', 'Django REST Framework', 'PostgreSQL', 'JWT'],
    keyFeatures: [
      'JWT-secured CRUD workflows',
      'Audit logging',
      'Database schema triggers enforcing data integrity',
    ],
  },
  {
    id: 'drivexo',
    title: 'DriveXo',
    tagline: 'Cab booking web application',
    overview: 'Built a fully responsive cab-booking interface with Firebase Authentication and a real-time database for user login and registration.',
    technologies: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript', 'Firebase'],
    keyFeatures: [
      'Fully responsive booking interface',
      'Firebase Authentication for login/registration',
      'Firebase Realtime Database',
    ],
  },
  {
    id: 'brute-force-simulator',
    title: 'Brute Force Attack Simulator',
    tagline: 'Cybersecurity testing platform',
    overview: 'Built a cybersecurity testing platform to simulate brute-force attacks, with rate limiting, IP blocking, attack monitoring, and Burp Suite integration for authentication testing.',
    technologies: ['Python (Flask)', 'HTML', 'Burp Suite'],
    keyFeatures: [
      'Simulated brute-force attack traffic',
      'Rate limiting and IP blocking',
      'Attack monitoring',
      'Burp Suite integration for authentication testing',
    ],
  },
];

// Invest Smart-AI is not detailed enough on the resume (only mentioned as a
// hackathon project) to responsibly write a full case study — no tech stack,
// architecture, or feature list is documented. Listed under achievements
// instead. Move it into PROJECTS once Priyal supplies the details.
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'hackathon-finalist',
    title: 'Finalist, Ahmedabad University Hackathon',
    description: 'Top 25 of 100+ teams. Project: Invest Smart-AI.',
  },
];

export const CERTIFICATIONS: Certification[] = [
  { id: 'az-900', title: 'Microsoft Certified: Azure Fundamentals (AZ-900)', issuer: 'Microsoft' },
  { id: 'sc-900', title: 'Microsoft Certified: Security, Compliance, and Identity Fundamentals (SC-900)', issuer: 'Microsoft' },
  { id: 'dp-800', title: 'Microsoft Certified: SQL AI Developer Associate Certification (DP-800)', issuer: 'Microsoft' },
  { id: 'cisco-cyber', title: 'Introduction to Cybersecurity', issuer: 'Cisco Networking Academy' },
  { id: 'fullstack-bootcamp', title: 'Full Stack Web Development Bootcamp', issuer: 'Udemy' },
];

export const EDUCATION: EducationEntry[] = [
  {
    id: 'mscit',
    degree: 'MScIT (Fullstack and Cyber Security)',
    institution: 'SKIPS University, School of Computer Science',
    period: 'Aug 2026',
  },
  {
    id: 'bca',
    degree: 'BCA',
    institution: 'GLS University, Faculty of Computer Application & IT',
    detail: 'CGPA: 7.63 / 10',
    period: 'May 2024',
  },
];

export const ENGINEERING_TIMELINE: EngineeringTimelineStep[] = [
  { date: 'May 2024', title: 'BCA Completed', description: 'GLS University, Faculty of Computer Application & IT.' },
  { date: 'Feb 2026 \u2013 Jul 2026', title: 'Software Developer Intern', description: 'Adrta Technologies \u2014 built REST APIs, RBAC/JWT authentication, and PostgreSQL performance work across production portals.' },
  { date: 'Aug 2026', title: 'MScIT (Fullstack and Cyber Security)', description: 'SKIPS University, School of Computer Science.' },
  { date: 'Present', title: 'Junior Software Engineer', description: 'Adrta Technologies \u2014 full-stack feature development, automation, and application-level security controls.' },
  
];
