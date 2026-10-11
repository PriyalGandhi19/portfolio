# Priyal Gandhi — Full Stack Engineering Portfolio

An interactive engineering portfolio: a React/TypeScript frontend backed by a
Django REST API, with a knowledge-grounded AI assistant, interactive
engineering labs (auth, RBAC, PostgreSQL performance, brute-force
simulation), and a real contact form.

Every fact shown about experience, projects, and certifications is sourced
directly from the resume — see `FRONTEND/src/data/portfolioData.ts` and
`BACKEND/apps/portfolio/knowledge_base.py`, which are kept in sync.

## Architecture

```
React (Vite) ──► Django REST Framework ──► PostgreSQL
                        │
                        ├─► Claude API (optional, backend-only key)
                        └─► SMTP (contact form)
```

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Python + Django + Django REST Framework
- **Database**: PostgreSQL
- **AI**: Claude API when `ANTHROPIC_API_KEY` is set, otherwise a
  deterministic keyword lookup against the same knowledge base — never
  invents facts outside it either way.

## Prerequisites

- Node.js 18+
- Python 3.12+
- PostgreSQL 14+ running locally (or a connection string to one)

## Backend setup

```bash
cd BACKEND
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create the database (adjust to your local Postgres setup)
psql -c "CREATE DATABASE portfolio_db;"

cp .env.example .env            # then edit .env — see below
python manage.py migrate
python manage.py seed_portfolio # loads real resume data into Skill/Project/Experience
python manage.py createsuperuser  # optional, for /admin
python manage.py runserver      # http://localhost:8000
```

### Backend environment variables (`BACKEND/.env`)

| Variable | Purpose |
|---|---|
| `DEBUG` | `True` for local dev. Must be `False` in production. |
| `SECRET_KEY` | Long random value in production — never reuse the dev default. |
| `ALLOWED_HOSTS` | Comma-separated hostnames Django will serve. |
| `DATABASE_URL` | `postgres://user:pass@host:5432/dbname`. Falls back to SQLite if unset (dev convenience only). |
| `CORS_ALLOWED_ORIGINS` | Comma-separated origins allowed to call the API (your frontend's URL). |
| `ANTHROPIC_API_KEY` | Optional. If set, the AI assistant calls the real Claude API, grounded in `knowledge_base.py`. If unset, it uses a deterministic keyword lookup against the same data. |
| `EMAIL_BACKEND` / `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_HOST_USER` / `EMAIL_HOST_PASSWORD` / `EMAIL_USE_TLS` | Contact form email delivery. Defaults to printing to the console in dev. |
| `CONTACT_RECIPIENT_EMAIL` | Where contact form submissions are sent. |

## Frontend setup

```bash
cd FRONTEND
npm install
npm run dev    # http://localhost:3000, proxies /api to http://127.0.0.1:8000
```

The frontend's page content (experience, projects, skills, certs) is static
data in `src/data/portfolioData.ts` — fast to load, no API round trip needed
for the page itself. The backend independently serves the same facts via
REST (`/api/skills/`, `/api/projects/`, `/api/experience/`) for the
"API Explorer" lab to demonstrate against, and powers the AI assistant,
contact form, and health check.

**If you edit your resume**, update both:
- `FRONTEND/src/data/portfolioData.ts` (page content)
- `BACKEND/apps/portfolio/knowledge_base.py` and `management/commands/seed_portfolio.py` (AI assistant + API data)

## Testing

```bash
cd BACKEND
python manage.py test
```

## Production build

```bash
cd FRONTEND
npm run build     # outputs to FRONTEND/dist

cd ../BACKEND
python manage.py check --deploy   # verify security settings before shipping
python manage.py collectstatic
```

## Deployment

- **Frontend**: any static host (Vercel, Netlify, etc.) serving `FRONTEND/dist`.
- **Backend**: any WSGI host (Render, Railway, etc.). Set the environment
  variables above as real environment variables (not a committed `.env`).
- **Database**: managed PostgreSQL.

Before deploying, set `DEBUG=False`, a strong random `SECRET_KEY`, real
`ALLOWED_HOSTS`, and run `python manage.py check --deploy` — it should
report zero issues.

## Security notes

- API keys and secrets live only in `BACKEND/.env` (gitignored) — the
  frontend never sees `ANTHROPIC_API_KEY` or email credentials.
- The AI and contact endpoints are rate-limited (`10/min` and `5/hour`
  respectively) to control cost and abuse.
- The contact form has a honeypot field and server-side validation.
- `manage.py check --deploy` passes with zero issues when `DEBUG=False` and
  a real `SECRET_KEY`/`ALLOWED_HOSTS` are set.

## Analytics (owner-only)

Every AI question, terminal command, page view, and resume download click is
logged to the `AnalyticsEvent` table (`apps/analytics`) — no IP address or
device fingerprinting is stored, just an event type, a short text detail,
and a session key. Contact form submissions are stored separately in
`apps/contact` (`ContactMessage`), since they need the full message.

To check what visitors have been doing:

- **Django admin** (`/admin`, requires `createsuperuser`): browse
  Analytics → Analytics events, and Contact → Contact messages directly.
- **`GET /api/stats/`**: a JSON summary (unique sessions, event counts,
  recent AI questions/terminal commands, contact message counts) for the
  last 30 days. Requires an authenticated staff session — returns `403`
  for anyone else, and there's no public link to it anywhere on the site.

This is intentionally simple. For real traffic-volume analytics (unique
visitors over time, referrers, geography) a dedicated tool like Plausible
or Google Analytics will tell you far more than this table — the built-in
logging here only answers "did anyone use the AI/terminal/resume button,
and what did they ask."

## Hosting your resume

`PERSONAL_INFO.resumeUrl` in `FRONTEND/src/data/portfolioData.ts` is set to
`/resume.pdf`. Drop your actual resume PDF into `FRONTEND/public/resume.pdf`
and the "Download Resume" button and terminal `resume` command will work
immediately — no code changes needed. (A Google Drive link works too, but
a local file avoids Drive's virus-scan/permission friction for downloads.)

