# 🌐 UnityLink — Community Intelligence Platform
### Complete Build Guide for New Grad Portfolio (2026 Edition)

---

## What UnityLink Is

**UnityLink** is a full-stack, AI-powered community intelligence platform built for Bahá'í communities to manage outreach, coordinate events, and surface actionable insights using machine learning — all in one place.

> **Your elevator pitch:**
> *"I built a full-stack community intelligence platform that uses AI to transform unstructured outreach notes into structured insights, prioritize high-engagement neighborhoods, and automate multi-channel communication — all serving a real faith community in Southwest Harris County and Fort Bend."*

---

## Why This Stands Out to Employers in 2026

| Feature | Why Employers Care |
|---|---|
| AI-powered note analysis (Claude API) | Shows LLM integration, prompt engineering |
| Interactive outreach map | Shows geospatial data, real UX complexity |
| WhatsApp → SMS/Email bridge | Shows systems integration, real-world constraints |
| Multi-role auth (admin, volunteer) | Shows security awareness |
| AI Insights dashboard | Shows data pipeline thinking |
| Real community use case | Shows you can ship for real users, not just demos |
| Claude Code used in development | Shows AI-assisted workflow fluency |

---

## Recommended Tech Stack

```
Frontend:       React + Vite + TailwindCSS
Backend:        Node.js + Express
Database:       MySQL
AI Layer:       Anthropic Claude API (claude-sonnet)
Maps:           Mapbox GL JS or Leaflet.js + OpenStreetMap
Auth:           JWT + bcrypt
Messaging:      Twilio (SMS) + SendGrid (Email)
WhatsApp:       Twilio WhatsApp API or Meta Cloud API
Deployment:     Render (backend) + Vercel (frontend)
Dev Tool:       Claude Code (CLI) — speeds up scaffolding 10x
Version Control: Git + GitHub
```

---

## Project File Structure

```
unitylink/
├── README.md                     ← Project overview + demo link
├── UNITYLINK_BUILD_GUIDE.md      ← This file
├── .env                          ← API keys (never commit)
├── .env.example                  ← Template for env vars
├── .gitignore
│
├── client/                       ← React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map/
│   │   │   │   ├── OutreachMap.jsx
│   │   │   │   ├── HouseMarker.jsx
│   │   │   │   ├── ApartmentModal.jsx
│   │   │   │   └── UnitGrid.jsx
│   │   │   ├── Posts/
│   │   │   │   ├── PostFeed.jsx
│   │   │   │   ├── CreatePost.jsx
│   │   │   │   └── PostCard.jsx
│   │   │   ├── Outreach/
│   │   │   │   ├── VisitForm.jsx
│   │   │   │   ├── AIInsightCard.jsx
│   │   │   │   └── PriorityList.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── StatsRow.jsx
│   │   │   │   ├── EngagementChart.jsx
│   │   │   │   └── RecentActivity.jsx
│   │   │   └── Auth/
│   │   │       ├── Login.jsx
│   │   │       └── Register.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── MapPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── PostsPage.jsx
│   │   │   └── ReportsPage.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useOutreach.js
│   │   ├── services/
│   │   │   ├── api.js            ← Axios base config
│   │   │   └── ai.js             ← Claude API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                       ← Node.js backend
│   ├── server.js                 ← Entry point
│   ├── config/
│   │   └── db.js                 ← MySQL connection
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── locations.routes.js
│   │   ├── visits.routes.js
│   │   ├── posts.routes.js
│   │   ├── ai.routes.js
│   │   └── notifications.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── locations.controller.js
│   │   ├── visits.controller.js
│   │   ├── posts.controller.js
│   │   ├── ai.controller.js
│   │   └── notifications.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js    ← JWT verification
│   │   └── validate.middleware.js
│   ├── models/                   ← SQL query functions
│   │   ├── User.js
│   │   ├── Location.js
│   │   ├── Visit.js
│   │   ├── Post.js
│   │   └── AIInsight.js
│   └── package.json
│
└── database/
    ├── schema.sql                ← All CREATE TABLE statements
    └── seed.sql                  ← Sample data for testing
```

---

## Database Schema (schema.sql)

```sql
-- Users
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'volunteer') DEFAULT 'volunteer',
  community VARCHAR(100),
  phone VARCHAR(20),
  notify_sms BOOLEAN DEFAULT FALSE,
  notify_email BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community Posts (events, gatherings, junior youth, children's class)
CREATE TABLE posts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  category ENUM('junior_youth', 'childrens_class', 'devotional', 'event') NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT,
  community VARCHAR(100),
  event_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Locations (houses + apartments)
CREATE TABLE locations (
  location_id INT AUTO_INCREMENT PRIMARY KEY,
  address VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_type ENUM('house', 'apartment_building') DEFAULT 'house',
  status ENUM('unvisited', 'visited', 'engaged') DEFAULT 'unvisited',
  community VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Apartment Units (for apartment buildings)
CREATE TABLE apartment_units (
  unit_id INT AUTO_INCREMENT PRIMARY KEY,
  location_id INT NOT NULL,
  unit_number VARCHAR(20) NOT NULL,
  status ENUM('unvisited', 'visited', 'engaged') DEFAULT 'unvisited',
  FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

-- Visits / Outreach Logs
CREATE TABLE visits (
  visit_id INT AUTO_INCREMENT PRIMARY KEY,
  location_id INT,
  unit_id INT,
  user_id INT NOT NULL,
  visit_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES locations(location_id),
  FOREIGN KEY (unit_id) REFERENCES apartment_units(unit_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- AI Insights (generated from visit notes)
CREATE TABLE ai_insights (
  insight_id INT AUTO_INCREMENT PRIMARY KEY,
  visit_id INT NOT NULL,
  interest_type VARCHAR(100),      -- e.g. "children's classes", "devotional"
  priority_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
  suggested_action TEXT,
  reasoning TEXT,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (visit_id) REFERENCES visits(visit_id)
);

-- Notification Subscriptions
CREATE TABLE subscriptions (
  sub_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  community VARCHAR(100) NOT NULL,
  channel ENUM('sms', 'email', 'both') DEFAULT 'both',
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

---

## Step-by-Step Build Plan

---

### WEEK 1 — Foundation

#### Step 1.1 — Initialize the project

```bash
mkdir unitylink && cd unitylink
git init

# Backend
mkdir server && cd server
npm init -y
npm install express mysql2 dotenv bcrypt jsonwebtoken cors

# Frontend
cd ..
npm create vite@latest client -- --template react
cd client && npm install axios react-router-dom
```

#### Step 1.2 — Set up MySQL schema

```bash
mysql -u root -p < database/schema.sql
```

#### Step 1.3 — Build the backend core

Create `server/server.js`:
```js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/locations', require('./routes/locations.routes'));
app.use('/api/visits', require('./routes/visits.routes'));
app.use('/api/posts', require('./routes/posts.routes'));
app.use('/api/ai', require('./routes/ai.routes'));

app.listen(process.env.PORT || 5000, () =>
  console.log(`UnityLink server running on port ${process.env.PORT || 5000}`)
);
```

---

### WEEK 2 — Core Frontend + Map

#### Step 2.1 — Build the map view

Use **Mapbox GL JS** or **Leaflet.js**:

```bash
cd client && npm install mapbox-gl
# or: npm install leaflet react-leaflet
```

Color coding logic:
```js
const getColor = (status) => ({
  unvisited: '#9CA3AF',   // gray
  visited:   '#FCD34D',   // yellow
  engaged:   '#34D399',   // green
}[status]);
```

For apartment buildings, show a segmented circle/square icon where the fill ratio reflects the percentage of engaged units.

#### Step 2.2 — Build Post Feed

Categories: `junior_youth`, `childrens_class`, `devotional`, `event`
Each post shows: title, category badge, community tag, date, author.

---

### WEEK 3 — AI Integration (The Differentiator)

#### Step 3.1 — AI note analysis endpoint

`server/controllers/ai.controller.js`:
```js
const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

exports.analyzeVisitNotes = async (req, res) => {
  const { notes, visitId } = req.body;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `You are an assistant helping a Bahá'í community outreach volunteer.
      
Analyze the following visit notes and return ONLY a JSON object with these fields:
- interest_type: string (e.g. "children's classes", "devotional gatherings", "junior youth", "general curiosity", "not interested")
- priority_level: "low" | "medium" | "high"
- suggested_action: string (1-2 sentences, what to do next)
- reasoning: string (1 sentence explaining why)

Visit notes: "${notes}"

Return only the JSON object, no other text.`
    }]
  });

  const raw = message.content[0].text;
  const insight = JSON.parse(raw);

  // Save to DB
  await db.query(
    `INSERT INTO ai_insights (visit_id, interest_type, priority_level, suggested_action, reasoning)
     VALUES (?, ?, ?, ?, ?)`,
    [visitId, insight.interest_type, insight.priority_level, insight.suggested_action, insight.reasoning]
  );

  res.json(insight);
};
```

#### Step 3.2 — Smart Priority Map

After AI analysis, the map highlights the **top 10 highest-priority locations** with a pulsing ring. This is your "advanced feature" for the top 1%.

#### Step 3.3 — Surface AI in UI

In `AIInsightCard.jsx`, show:
- 🎯 Suggested next action
- 📊 Priority level (color-coded chip)
- 💡 Reasoning

---

### WEEK 4 — Notifications, Reports, Polish

#### Step 4.1 — SMS + Email notifications

```bash
npm install twilio @sendgrid/mail
```

When an admin posts a message, the server:
1. Queries all subscribers for that community
2. Sends SMS via Twilio to `notify_sms` users
3. Sends email via SendGrid to `notify_email` users

#### Step 4.2 — WhatsApp integration

Use **Twilio WhatsApp API** (sandbox for dev, production requires Meta approval):
- Set up a webhook that receives messages sent to your Twilio WhatsApp number
- Forward those messages to your DB and broadcast via SMS/email to subscribers
- This bridges the existing LSA WhatsApp group → your platform → everyone's phones/inboxes

#### Step 4.3 — Reports Page

Two reports:
1. **Engagement Report** — pie chart of location statuses, trend line over time
2. **AI Insights Report** — bar chart of interest types, table of high-priority homes

Use `recharts` for React charts:
```bash
npm install recharts
```

---

## Using Claude Code to Speed Up Development

Claude Code is a CLI tool that operates directly in your terminal and understands your entire codebase.

### Install
```bash
npm install -g @anthropic-ai/claude-code
claude  # starts the interactive session
```

### How to use it effectively

**Scaffolding (saves hours):**
```
> Create the Express route file for /api/visits with POST and GET endpoints,
  connecting to MySQL using the db config in config/db.js
```

**Debugging:**
```
> My INSERT query is returning "ER_NO_DEFAULT_FOR_FIELD" for visit_date.
  Here's the query: [paste code]. Why is this happening?
```

**AI integration:**
```
> Write a React component called AIInsightCard that takes an insight object
  with fields: interest_type, priority_level, suggested_action, reasoning.
  Show priority with a color-coded badge (red=high, yellow=medium, green=low).
  Use Tailwind for styling.
```

**Refactoring:**
```
> Refactor OutreachMap.jsx — the getColor function and marker click handler
  are in the same component. Extract them into a useMapLogic custom hook.
```

**Rule:** Never paste AI code without reading it line by line. Interviewers WILL ask you to walk through your code. Understand every function you ship.

---

## .env.example

```
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=unitylink

# Auth
JWT_SECRET=your_jwt_secret_here

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Notifications
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@unitylink.app

# Maps
MAPBOX_TOKEN=pk.eyJ1Ijoi...
```

---

## README.md Template

```md
# UnityLink — Community Intelligence Platform

A full-stack AI-powered platform for Bahá'í communities to manage outreach,
coordinate events, and surface actionable engagement insights.

## Live Demo
[Link here]

## Tech Stack
React · Node.js · MySQL · Claude AI · Mapbox · Twilio · SendGrid

## Key Features
- 🗺️ Interactive outreach map with color-coded homes and apartment units
- 🤖 AI-powered visit note analysis (priority level, interest type, suggested actions)
- 📢 Community post feed for junior youth, children's classes, devotionals, events
- 📲 SMS + email notifications for LSA broadcasts
- 🔗 WhatsApp → SMS/Email bridge for existing community groups
- 📊 Engagement reports and AI insights dashboard

## Setup
[instructions]

## Architecture
[diagram or description]
```

---

## 4-Week Timeline

| Week | Focus | Deliverable |
|------|-------|-------------|
| 1 | DB schema + Express backend + Auth | Working API with Postman-tested routes |
| 2 | React frontend + Map + Post Feed | Browsable UI, map renders locations |
| 3 | Claude AI integration + Priority map | Notes → AI insights → map highlights |
| 4 | Notifications + Reports + Polish | Full working app, deployed, demo-ready |

---

## What You Should Be Able to Say in Interviews

> *"UnityLink is a community intelligence platform I built from scratch. The core challenge was that outreach volunteers were writing freeform notes about neighbors — kids at home, schedules, interests — but none of that was structured or actionable. I integrated the Claude API to classify those notes into interest types, assign priority levels, and suggest next actions. On the map, the highest-priority locations pulse, so volunteers know exactly where to focus. I also built a WhatsApp bridge so the local spiritual assembly could keep using their existing group chat, while everyone on the platform gets the messages as SMS or email. The whole thing runs on React, Node, and MySQL, deployed on Vercel and Render."*

---

*Built with love for the Bahá'í communities of Southwest Harris County and Fort Bend. 🌟*
