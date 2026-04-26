# TaskFlow

A full-stack task management app with AI-powered prioritization.

**Live demo:** [frontend link] · [backend link]

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database + Auth | Supabase (PostgreSQL) |
| AI | Anthropic Claude API |
| Frontend deploy | Vercel |
| Backend deploy | Render |

---

## Features

- Email/password authentication
- Create, edit, delete, and complete tasks
- Priority levels (High / Medium / Low)
- Status tracking (To Do / In Progress / Done)
- Due dates with overdue highlighting
- Category labels
- Search, filter by status & priority, sort by date or priority
- **AI Prioritizer** — Claude analyzes your active tasks and suggests the optimal order with reasoning and productivity tips

---

## Local setup

### 1. Clone the repo

```bash
git clone <your-github-repo-url>
cd taskflow
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → **New query**, paste the contents of `database.sql`, and run it
3. In **Project Settings → API**, copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### 3. Get your Anthropic API key

Go to [console.anthropic.com](https://console.anthropic.com) → API Keys → Create key.

### 4. Backend

```bash
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

`.env` for backend:
```
PORT=4000
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=sk-ant-...
FRONTEND_URL=http://localhost:5173
```

### 5. Frontend

```bash
cd frontend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

`.env` for frontend:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:4000
```

Open [http://localhost:5173](http://localhost:5173).

---

## Deployment

### Frontend → Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Set **Root Directory** to `frontend`
4. Add environment variables (same as `.env` but with your live backend URL for `VITE_API_URL`)
5. Deploy

### Backend → Render

1. Go to [render.com](https://render.com) → New → Web Service → Connect your repo
2. Set **Root Directory** to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables (same as `.env` but set `FRONTEND_URL` to your Vercel URL)
6. Deploy

### Database

Already live on Supabase — no extra steps needed.

---

## Database schema

```sql
tasks (
  id          uuid PRIMARY KEY,
  user_id     uuid REFERENCES auth.users,
  title       text NOT NULL,
  description text,
  priority    text DEFAULT 'medium',  -- low | medium | high
  status      text DEFAULT 'todo',    -- todo | in_progress | done
  due_date    date,
  category    text,
  created_at  timestamptz,
  updated_at  timestamptz
)
```

Row Level Security ensures users can only access their own tasks.

---

## AI usage notes

- **Tool used:** Anthropic Claude API (claude-haiku-4-5 model)
- **Feature:** The "AI Prioritize" button sends all active tasks to Claude with a structured prompt asking for a prioritized JSON response
- **What Claude returns:** ordered task IDs, a strategy summary, and 3 productivity tips
- **What was accepted:** the core prompt structure and JSON parsing approach
- **What was adjusted:** added a fallback regex JSON extractor in case Claude wraps the JSON in markdown code blocks
