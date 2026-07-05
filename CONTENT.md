# CONTENT.md — real content for the site
All copy below is approved source material. Claude Code may lightly edit for
flow but must NOT invent facts, numbers, or projects.

## Identity
- Name: Om Sharma
- Sophomore (2nd year) B.Tech, IIT Guwahati (2025–present)
- Email (public): om.sharma@iitg.ac.in
- GitHub: https://github.com/omsharmaiitg
- LinkedIn: https://www.linkedin.com/in/om-sharma2008/
- Codeforces: om_sharma_ (max rating 1242)
- DO NOT publish phone number anywhere on the site.

## Hero (home page / #intro)
Two-line title treatment (like the reference's "Hello, this is / Ojas Mutreja"):
- Line 1, smaller Fraunces serif, muted: "Hello, this is"
- Line 2, huge Fraunces serif, ink: "Om Sharma"
Fraunces italic tagline below (branch mentioned here, ONCE, lightly):
- "— Mechanical Engineering sophomore at IIT Guwahati, exploring ML,
  algorithms, and the web."
Body sub-line (Plus Jakarta Sans): "Currently learning faster than my
timetable allows."
Nav at top: ABOUT · WORK · NOW · CONTACT (mono, uppercase).
Avatar (FULL body) sits right of the text on desktop, above it on mobile.

Wording rules for this section: hint that Om is early / still learning, framed
with curiosity and momentum — never claim he "builds anything" or is an expert,
but also never say he "can't" or "doesn't know". Confident-but-honest.

## /about (single paragraph + contact)
I'm Om, a sophomore B.Tech student at IIT Guwahati, keeping an 8.3 CGPA while
spending most of my hours where math, code, and curiosity overlap. I'm drawn to
problems where theory meets something you can actually run — reading handwriting
with models, pulling the bottlenecks out of a logistics network, teaching an
agent to bid in an auction. I'm early in all of it and learning fast, and I'd
rather show you what I've been figuring out than what I've mastered. Around
campus you'll find me with the Coding Club's ML module (Deputy Coordinator),
the Finance & Economics Club, the Entrepreneurship Cell, and the Aeromodelling
and Robotics clubs.
Say hi: om.sharma@iitg.ac.in

Wording rules: convey that Om is a fast-learning beginner with real curiosity —
hint at "still learning / early" positively (e.g. "figuring out", "learning
fast"), NEVER state he "can't", "doesn't know", or is an expert who "builds
anything". College performance (CGPA) is mentioned exactly ONCE, here. Branch
("Mechanical") is mentioned exactly ONCE on the whole site, in the HERO — not
repeated here.

## /now (initial content — Om will update this file over time)
Last updated: July 2026

**Learning** — machine learning from the ground up (currently working through
Andrew Ng's ML Specialization and rebuilding the math underneath it).

**Grinding** — competitive programming on Codeforces (max 1242 and climbing;
greedy, math, brute force & DP).

**Building** — web dev, starting with this site. Next.js, and a 3D version
of me that watches your cursor.

## /work — exactly three projects, this order

### 1. GradeOps — AI-powered human-in-the-loop exam grading
Tagline: *Grading handwritten exams — with humans in the loop.*
2026 · Coding Club, IIT Guwahati
Tags: React · FastAPI · LangGraph · Gemini · NVIDIA Nemotron · PostgreSQL
Link: https://github.com/exharmonic/gradeops

A platform that OCRs handwritten exam scripts with NVIDIA Nemotron, scores
each answer against instructor rubrics using Gemini, and routes every result
through a human review queue before grades are released. A LangGraph state
machine orchestrates the two-stage AI pipeline with SQLite checkpointing, so
pending reviews survive server restarts. FastAPI + PostgreSQL backend with
role-based cookie auth; React frontend built from scratch — instructor and
TA dashboards, keyboard-friendly review queue, and a landing page with
Three.js visuals.

Detail-page sections (use on /work/gradeops):
- THE PROBLEM: Grading handwritten exams at scale is slow and inconsistent.
  Pure-AI grading isn't trustworthy enough to release directly. GradeOps keeps
  a human in the loop while letting AI do the heavy lifting.
- WHAT I BUILT: A monorepo — a React (Vite) frontend and a FastAPI backend —
  covering the full flow: an instructor creates an exam with a rubric and
  uploads student scripts as PDFs; the system OCRs, scores, and queues each
  answer for a TA to approve, override, or flag; the instructor then releases
  grades.
- HOW IT WORKS: NVIDIA Nemotron (via OpenRouter) reads each script; Google
  Gemini scores the extracted answers against the rubric and returns structured
  feedback with a confidence reading. LangGraph runs this as a state machine
  that pauses for human judgment and persists its queue to SQLite, so pending
  reviews survive restarts. PyMuPDF handles PDF reading; heavy model work runs
  as async background jobs.
- STACK: React 19 + Vite, React Router v7, Framer Motion, three.js
  (@react-three/fiber + drei) for the landing visuals; FastAPI, LangGraph +
  LangChain, PostgreSQL (app data) + SQLite (checkpoints), SQLAlchemy ORM,
  PyJWT/pwdlib auth, httponly cookie sessions.
- AUTH/SECURITY note: role-based access control with httponly cookie sessions.

### 2. Delhivery Network Intelligence — graph-based logistics optimization
Tagline: *Finding the five hubs that slow a whole network down.*
2026 · Consulting & Analytics Club, IIT Guwahati
Tags: Python · XGBoost · NetworkX · node2vec · Pandas · Streamlit
Link: https://github.com/omsharmaiitg/delivery-network-intelligence

Modelled Delhivery's logistics network as a directed weighted graph from
~144,900 scan events (~14,800 trips). The routing engine systematically
underestimates delivery times — only 4.1% of legs land within ±15% of the
OSRM estimate — and delay is heavily concentrated: the top 5 hubs account
for 30.8% of all network excess delay, led by Gurgaon Bilaspur HB alone at
12.5%. Built a graph-enhanced XGBoost ETA model (node2vec hub embeddings,
betweenness/PageRank features, corridor history priors, leakage-safe train
folds): MAE 27.8 min vs OSRM's 107.8 min (74% better), 58.3% on-target
accuracy. Delivered an FTL-vs-carting decision framework (FTL on 100% of
corridors >400 km, saving 339–778 min per leg), a 7-script reproducible
pipeline, a consulting-style strategy memo, and a live 4-tab Streamlit
operations dashboard. Estimated impact of upgrading the top 3 hubs: 28%
fewer late deliveries on key corridors, ~₹1.5 cr/yr recovered revenue.

Detail-page extras (use on /work/delhivery only):
- Worst corridor: Gurgaon ⇄ Bangalore, ~145k excess minutes in 3 weeks.
- Model table: OSRM 107.8 MAE / Ridge 198.3 / XGBoost trip-only 34.2 /
  XGBoost+Graph 27.8.
- Graph advantage over trip-only baseline: −18.9% MAE, +12.8 pts on-target.

### 3. FixIt — hyperlocal civic issue reporting
Tagline: *One pothole, reported five ways, becomes one issue.*
2026 · Vibe2Ship Hackathon (Coding Ninjas × Google for Developers)
Tags: Next.js 14 · Firebase · Gemini 2.5 Flash · Google Maps Platform · Cloud Run
Link: https://github.com/omsharmaiitg/fixit
Live: https://fixit-341094842696.asia-south1.run.app

A civic reporting platform where citizens flag potholes, broken streetlights,
water leaks, and garbage — and can actually see what happens next. It closes
the broken feedback loop between people who see problems and the systems meant
to fix them, using two AI agents and radical public transparency, with no
government buy-in required.

Detail-page sections (use on /work/fixit):
- THE PROBLEM: People report civic issues into a void — reporting is
  fragmented, untrackable, and opaque, and a citizen rarely learns whether a
  report was verified, acknowledged, or fixed. FixIt makes the whole lifecycle
  public and accountable.
- WHAT I BUILT: Two AI agents, not one chatbot. A reactive Triage Agent turns
  a short conversation + photo into a structured, geocoded, severity-rated,
  de-duplicated record. A proactive Watchtower Agent runs on a schedule to
  recompute urgency, cluster failures into Problem Zones with an AI root-cause
  read, predict hotspots, and auto-write a weekly civic report.
- HOW IT WORKS: The Triage Agent is a Gemini function-calling tool loop that
  visibly reasons across tools — geocoding, duplicate-checking, live weather,
  and a transparent severity score. The Watchtower Agent runs via Cloud
  Scheduler. Every issue carries a public 0–100 Pressure Score (rises with
  neglect, falls when authorities act) and an immutable, timestamped "Issue
  DNA" life-story. All AI and geocoding calls run server-side — keys never
  reach the browser.
- RESULTS/FEATURES: proximity-weighted community verification (Reported →
  Verified), issue aging (Fresh → Neglected → Critical → Civic Failure), a
  login-free Public Impact Dashboard, and a deployed live app on Cloud Run.
- STACK: Next.js 14 (App Router) + TypeScript + Tailwind; Gemini 2.5 Flash
  (function calling, multimodal); Firebase (Firestore, Auth, Storage); Google
  Maps Platform; Open-Meteo; Cloud Run + Cloud Build + Cloud Scheduler; ships
  as a multi-stage Docker container.

## /work page footer line
More experiments live on GitHub → https://github.com/omsharmaiitg

## Footer (all pages) + Contact section
om.sharma@iitg.ac.in · GitHub · LinkedIn · Resume (PDF) · built with Next.js

RESUME LINK — currently missing from the live site. To fix: place the resume
PDF at /public/resume.pdf in the repo, then link "Resume" to /resume.pdf with
target="_blank" rel="noopener". The link must appear in BOTH the footer and the
Contact (#contact) section. (Om: drop your resume.pdf into /public — remember to
update its project dates to 2026 first so it matches the site.)
