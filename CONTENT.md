# CONTENT.md — real content for the site
All copy below is approved source material. Claude Code may lightly edit for
flow but must NOT invent facts, numbers, or projects.

## Identity
- Name: Om Sharma
- First-year B.Tech, Mechanical Engineering, IIT Guwahati (2025–present)
- Email (public): om.sharma@iitg.ac.in
- GitHub: https://github.com/omsharmaiitg
- LinkedIn: https://www.linkedin.com/in/om-sharma2008/
- Codeforces: om_sharma_ (max rating 1242)
- DO NOT publish phone number anywhere on the site.

## Hero (home page)
Om Sharma — first-year at IIT Guwahati.
I build ML systems and web things. Currently learning faster than my
timetable allows.
[links: work · now · about · github]

## /about (single paragraph + contact)
I'm Om, a first-year B.Tech student at IIT Guwahati, keeping an 8.3 CGPA
while spending most of my time on machine learning, graphs, and the web.
I like problems where math meets software: grading pipelines that read
handwriting, logistics networks that reveal their bottlenecks, agents that
bid in auctions. Around campus I work with the Coding Club's ML module
(Deputy Coordinator), the Finance & Economics Club, and the
Entrepreneurship Cell.
Say hi: om.sharma@iitg.ac.in

Notes: college performance is mentioned exactly ONCE (the CGPA aside above)
and never repeated. Do NOT mention Om's branch/department anywhere on the
site — the resume PDF covers that.

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
Mar 2025 – Present · Coding Club, IIT Guwahati
Tags: Python · FastAPI · React · LangGraph · Gemini · NVIDIA Nemotron · PostgreSQL
Link: https://github.com/exharmonic/gradeops

A platform that OCRs handwritten exam scripts with NVIDIA Nemotron, scores
each answer against instructor rubrics using Gemini, and routes every result
through a human review queue before grades are released. A LangGraph state
machine orchestrates the two-stage AI pipeline with SQLite checkpointing, so
pending reviews survive server restarts. FastAPI + PostgreSQL backend with
role-based cookie auth; React frontend built from scratch — instructor and
TA dashboards, keyboard-friendly review queue, and a landing page with
Three.js visuals.

### 2. Delhivery Network Intelligence — graph-based logistics optimization
Tagline: *Finding the five hubs that slow a whole network down.*
Jun 2025 · Consulting & Analytics Club, IIT Guwahati
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

A civic reporting platform where citizens flag potholes, broken streetlights,
and garbage issues. An AI "Watchtower" agent built on Gemini 2.5 Flash
classifies and normalizes incoming reports and places them on a live city
map, so the same pothole reported five ways becomes one actionable issue.
Deployed on Google Cloud Run.
(Om: add repo/demo link + your role line when ready.)

## /work page footer line
More experiments live on GitHub → https://github.com/omsharmaiitg

## Footer (all pages)
om.sharma@iitg.ac.in · GitHub · LinkedIn · Resume (PDF) · built with Next.js
