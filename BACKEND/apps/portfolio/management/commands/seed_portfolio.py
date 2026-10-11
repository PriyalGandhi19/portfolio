from django.core.management.base import BaseCommand

from apps.portfolio.models import Skill, Project, Experience

# Keep this in sync with FRONTEND/src/data/portfolioData.ts — both are
# sourced from the same resume and should never drift into different facts.

SKILLS = [
    ('Frontend', 'React.js', 'Built production features and interfaces across Admin, Store, and Customer portals at Adrta Technologies.'),
    ('Frontend', 'TypeScript / JavaScript', 'Used across full-stack feature development and the DriveXo cab-booking interface.'),
    ('Frontend', 'HTML5 / CSS3 / Bootstrap', 'Built the fully responsive DriveXo interface.'),
    ('Backend & APIs', 'Python', 'Backend development plus Selenium-based automation scripts.'),
    ('Backend & APIs', 'Django REST Framework', 'Built and maintained REST APIs and CRUD workflows across production modules.'),
    ('Backend & APIs', 'JWT & OAuth 2.0', 'Implemented authentication with JWT and Google OAuth 2.0 across all user roles and portals.'),
    ('Backend & APIs', 'Role-Based Access Control (RBAC)', 'Designed dynamic role-based permissions securing multi-portal access.'),
    ('Database', 'PostgreSQL', "Query optimization, indexing, and stored procedures; reduced a dashboard's load time from several minutes to seconds using temporary tables."),
    ('Database', 'SQL Server', 'Listed technical skill; used alongside PostgreSQL work.'),
    ('Cloud & Tools', 'AWS S3', 'Integrated for secure multi-file upload.'),
    ('Cloud & Tools', 'Microsoft Azure', 'AZ-900 (Azure Fundamentals) certified.'),
    ('Cloud & Tools', 'Windows Server', 'Managed deployments including build packaging, database backup/restore, and post-deployment validation.'),
    ('Cloud & Tools', 'Git / GitHub', 'Version control across all projects and production work.'),
    ('Cloud & Tools', 'Cloudflare Tunnel, Supabase, Firebase, Google OAuth, Power BI', 'Listed technical tools used in project and production work.'),
]

PROJECTS = [
    {
        'title': 'Task Management System',
        'tagline': 'Role-based task management platform',
        'overview': 'Built a role-based task management platform with JWT-secured CRUD workflows, audit logging, and database schema triggers for data integrity.',
        'technologies': ['React', 'TypeScript', 'Django REST Framework', 'PostgreSQL', 'JWT'],
        'key_features': ['JWT-secured CRUD workflows', 'Audit logging', 'Database schema triggers enforcing data integrity'],
    },
    {
        'title': 'DriveXo',
        'tagline': 'Cab booking web application',
        'overview': 'Built a fully responsive cab-booking interface with Firebase Authentication and a real-time database for user login and registration.',
        'technologies': ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript', 'Firebase'],
        'key_features': ['Fully responsive booking interface', 'Firebase Authentication for login/registration', 'Firebase Realtime Database'],
    },
    {
        'title': 'Brute Force Attack Simulator',
        'tagline': 'Cybersecurity testing platform',
        'overview': 'Built a cybersecurity testing platform to simulate brute-force attacks, with rate limiting, IP blocking, attack monitoring, and Burp Suite integration for authentication testing.',
        'technologies': ['Python (Flask)', 'HTML', 'Burp Suite'],
        'key_features': ['Simulated brute-force attack traffic', 'Rate limiting and IP blocking', 'Attack monitoring', 'Burp Suite integration for authentication testing'],
    },
]

EXPERIENCES = [
    {
        'role': 'Software Developer Intern',
        'company': 'Adrta Technologies Pvt. Ltd.',
        'location': 'Ahmedabad, India',
        'period': 'Feb 2026 \u2013 Jul 2026',
        'description': [
            'Contributed to feature development across Admin, Store, and Customer portals, building REST APIs and CRUD workflows as part of 3+ production modules.',
            'Built production modules (Customer Support, Species Management, Task Management), handling backend design and database schema while collaborating with the team to align features with client requirements.',
            'Implemented authentication & RBAC with JWT, Google OAuth 2.0, and dynamic role-based permissions, securing access across all user roles and portals.',
            'Optimized PostgreSQL performance through stored procedures, indexing, and query restructuring, and built a centralized error-logging system to speed up debugging.',
            'Executed cloud deployments by integrating AWS S3 for secure multi-file upload and managing Windows Server deployments, including build packaging, PostgreSQL backup/restore, and post-deployment validation.',
        ],
        'technologies': ['React', 'TypeScript', 'Django REST Framework', 'PostgreSQL', 'JWT', 'Google OAuth 2.0', 'AWS S3', 'Windows Server'],
        'key_result': "Reduced one dashboard's load time from several minutes to seconds using stored procedures, indexing, and temporary tables.",
    },
    {
        'role': 'Junior Software Engineer',
        'company': 'Adrta Technologies Pvt. Ltd.',
        'location': 'Ahmedabad, India',
        'period': 'Present',
        'description': [
            'Contributed to an in-house product across backend, frontend, and database layers, developing and maintaining features using Django REST Framework, TypeScript, and PostgreSQL, while resolving reported bugs across the application.',
            'Developed Python/Selenium web-scraping automation and browser-console scripts to automate repetitive data-entry workflows, reducing manual effort and improving operational efficiency.',
            'Implemented application-level security and session controls, including middleware to enforce single active sessions per user and React-based protections against unauthorized developer-tool inspection and transaction manipulation.',
        ],
        'technologies': ['Django REST Framework', 'TypeScript', 'PostgreSQL', 'Python', 'Selenium', 'React'],
        'key_result': 'Built middleware enforcing single active sessions per user and client-side protections against unauthorized inspection and transaction manipulation.',
    },
]


class Command(BaseCommand):
    help = 'Seeds the database with real, resume-sourced portfolio data (idempotent).'

    def handle(self, *args, **options):
        Skill.objects.all().delete()
        Project.objects.all().delete()
        Experience.objects.all().delete()

        for category, name, evidence in SKILLS:
            Skill.objects.create(category=category, name=name, evidence=evidence)

        for proj in PROJECTS:
            Project.objects.create(**proj)

        for exp in EXPERIENCES:
            Experience.objects.create(**exp)

        self.stdout.write(self.style.SUCCESS(
            f'Seeded {len(SKILLS)} skills, {len(PROJECTS)} projects, {len(EXPERIENCES)} experience entries.'
        ))
