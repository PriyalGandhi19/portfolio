# Portfolio Testing Guide

A complete manual walkthrough to verify every feature works before you consider the site done. Run backend and frontend together (`python manage.py runserver` + `npm run dev`) for the full experience — some checks specifically test what happens when the backend is *not* running, noted below.

## 0. Setup sanity check

- [ ] `cd BACKEND && python manage.py check` → no issues
- [ ] `python manage.py test` → all tests pass
- [ ] `cd FRONTEND && npx tsc -b --noEmit` → no errors
- [ ] `npx eslint .` → no errors
- [ ] `npm run build` → builds successfully

## 1. Navigation

- [ ] Click every navbar link (Home, Work, Projects, Engineering Lab, Skills, Certifications, Contact) — each scrolls to the correct section
- [ ] Navbar becomes sticky/blurred after scrolling down
- [ ] Mobile: resize below 1024px, open the hamburger menu, confirm all links + Recruiter Mode + Ask My AI buttons appear and work
- [ ] "Ask My AI" button (desktop and mobile) switches to the AI Copilot tab inside Engineering Lab and scrolls there

## 2. Hero section

- [ ] Tagline, role, and bio text match the resume
- [ ] "Launch Interactive Labs" scrolls to the lab section
- [ ] "Explore Projects" scrolls to Projects
- [ ] "Download Resume" button appears once `resumeUrl` is set, opens the PDF in a new tab, and logs a `resume_download` event (check Django admin afterward)
- [ ] GitHub/LinkedIn buttons open the correct real profiles

## 3. Interactive System Architecture

- [ ] Click each node (Frontend, Backend, Database, Deployment) — description and tech tags update
- [ ] Labels above each node are distinct (Frontend/Backend/Database/Deployment), not all identical

## 4. Engineering Lab suite

For each tab, confirm it renders without console errors:

- [ ] **System Telemetry** — click "Ping Telemetry"; with backend running, all four services should show Operational; stop the backend and re-check → Portfolio API / DB / AI show Offline, not a false "Operational"
- [ ] **Auth & JWT** — walk through the simulated login flow
- [ ] **RBAC Security** — switch roles (Admin/Manager/User), attempt a DELETE as User → see "Access Denied" with reason
- [ ] **PostgreSQL Lab** — shows the before/after query optimization demo (previously built but not wired in — confirm it now appears in the tab list)
- [ ] **Brute-Force Sandbox** — click "Start Simulation", watch the animated request flow, confirm the "safe simulated environment" disclaimer is visible
- [ ] **API Explorer** — with backend running, execute each of the 4 endpoints and confirm the badge says **LIVE BACKEND** and real JSON comes back; stop the backend and execute again → badge says **BACKEND UNREACHABLE** with an honest message (not fake data)
- [ ] **Observability / Async Queue** — panels render and animate
- [ ] **AI Copilot** — see section 6 below
- [ ] **AI Interviewer** — pick a mode, answer a question, confirm the "scripted, not a real assessment" disclaimer is visible
- [ ] **Problem Engine** — pick a category, select an option, confirm an explanation appears

## 5. Skills, Experience, Projects, Achievements, Timeline, Education, Certifications

- [ ] Skills show evidence text only — no fabricated percentage bars
- [ ] Experience cards expand/collapse; both Adrta Technologies roles appear with correct dates
- [ ] Each project card opens its detail modal with overview, features, and tech tags
- [ ] Achievements section shows the hackathon finalist entry
- [ ] Education section shows both degrees
- [ ] Certifications show the correct 5 entries (double check DP-800's title matches the resume)

## 6. AI Copilot ("Ask My Portfolio")

Test with the backend **running**:

- [ ] Ask "hi" or "who are you" → get an introductory answer, not "I don't have enough information"
- [ ] Ask "What PostgreSQL experience does he have?" → grounded answer + evidence line
- [ ] Ask something unrelated (e.g. "what's the weather") → honest "I don't have enough information..." fallback
- [ ] Response shows a small source label: **Backend knowledge lookup** (or **Claude API (grounded)** if you've set `ANTHROPIC_API_KEY`)

Test with the backend **stopped**:

- [ ] Ask a question → still get an answer (client-side fallback), labeled **Offline fallback — backend unreachable**

## 7. Developer Terminal

- [ ] Press the `` ` `` key anywhere on the page (not while typing in a field) → terminal opens/closes
- [ ] Terminal icon button in the navbar also opens it
- [ ] Run `help` → see the full command list
- [ ] Run each of: `about`, `skills`, `projects`, `experience`, `certs`, `education`, `achievements`, `contact`, `github`, `linkedin`, `resume`, `whoami`, `date`, `sudo`
- [ ] Run `open projects` → terminal closes and page scrolls to Projects; try `open nonsense` → get an "unknown section" message listing valid options
- [ ] Run `clear` → log clears
- [ ] Each command you ran should show up in Django admin under Analytics → Analytics Events with `event_type = terminal_command`

## 8. Recruiter Mode

- [ ] Toggle it on from the navbar → amber banner appears at the top of the page
- [ ] Toggle off → banner disappears
- [ ] (Current state: this is a visual banner only — see note below on what it's for and what a fuller version would add)

## 9. Contact form

Test each path:

- [ ] **Happy path**: fill all fields with a message ≥10 characters → button shows "Sending...", then a green "Message sent" confirmation. Check the Django console log (or your real inbox if `EMAIL_BACKEND` is SMTP) for the email.
- [ ] **Validation error**: submit with a message under 10 characters → red error message: "Message is too short."
- [ ] **Missing fields**: leave a field blank → browser's native "required" validation stops submission
- [ ] **Backend unreachable**: stop the backend, submit → red error telling you to email directly
- [ ] **Honeypot**: this can only be tested by inspecting the DOM — the hidden `website` field should never be visible to a real user; if a script fills it, submission should be rejected (400)
- [ ] Confirm the submission appears in Django admin under Contact → Contact Messages, and `email_delivered` reflects whether it actually sent

## 10. Certifications, System Status, and honesty checks

- [ ] Stop the Django backend entirely. Reload the frontend. Confirm nothing crashes — sections that need the backend (System Telemetry, API Explorer, AI Copilot, Contact) degrade honestly instead of pretending to work.

## 11. Responsive design

Check at each width (browser dev tools → responsive mode):

- [ ] 375px (mobile)
- [ ] 768px (tablet)
- [ ] 1024px
- [ ] 1440px

At each: navbar collapses/expands correctly, lab tabs scroll horizontally without breaking layout, project cards and skill cards reflow to a single column on mobile.

## 12. Accessibility

- [ ] Tab through the entire page using only the keyboard — every interactive element (nav links, buttons, form fields, lab tabs) should be reachable and show a visible focus state
- [ ] Open the mobile menu and confirm it's keyboard-dismissible (Escape or tab-through)
- [ ] Check contrast visually — light gray text on dark background should still be readable

## 13. Analytics (owner-only)

- [ ] Log in at `/admin` with your superuser account
- [ ] Under **Analytics → Analytics events**, confirm page views, terminal commands, AI questions, and resume downloads are being recorded as you test
- [ ] Under **Contact → Contact messages**, confirm every contact form test submission appears
- [ ] While logged in as an admin/staff user in the browser, visit `http://localhost:8000/api/stats/` directly → see a JSON summary: unique sessions, event counts by type, recent AI questions, recent terminal commands, and contact message counts (last 30 days + all-time)
- [ ] Confirm `/api/stats/` returns `403 Forbidden` when you're logged out — it should never be publicly reachable

---

### Note on Recruiter Mode

Right now it's a visual banner only. Its intended purpose is a streamlined view for a recruiter skimming quickly: hide the engineering labs/AI/terminal noise, surface just role, core tech, project titles, and a prominent resume download + contact button. If you want that built out for real, ask and it can be done as a follow-up — it's a UI-only change, no new backend work needed.
