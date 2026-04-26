# TaskFlow

A full-stack task management web application with AI-powered prioritization.

**Live Demo (website link) :** [taskflow-nine-nu.vercel.app](https://taskflow-nine-nu.vercel.app)  


---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database + Auth | Supabase (PostgreSQL) |
| AI | OpenRouter API |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway |

---

## Features

- Email/password authentication with confirmation
- Create, edit, delete, and complete tasks
- Priority levels: High / Medium / Low
- Status tracking: To Do / In Progress / Done
- Due dates with overdue highlighting
- Category labels
- Search, filter by status & priority, sort by date or priority
- Today view — shows tasks due today and overdue items
- Completed view — history of finished tasks
- Account page — profile stats and password change
- Settings page — customize task defaults
- **AI Prioritizer** — analyzes your active tasks and suggests the optimal order with reasoning and productivity tips

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/Saleh-Almesbah/taskflow.git
cd taskflow
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor → New query**, paste the contents of `database.sql`, and run it
3. In **Authentication → URL Configuration**, set Site URL to your frontend URL

### 3. Backend

```bash
cd backend
cp .env.example .env
# Fill in your values
npm install
npm run dev
```

```env
PORT=4000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

### 4. Frontend

```bash
cd frontend
cp .env.example .env
# Fill in your values
npm install
npm run dev
```

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:4000
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deployment

### Frontend → Vercel
1. Import GitHub repo on [vercel.com](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variables
4. Deploy

### Backend → Railway
1. Import GitHub repo on [railway.app](https://railway.app)
2. Set root directory to `backend`
3. Set start command to `npm start`
4. Add environment variables
5. Generate a domain under Settings → Networking

---

## Database Schema

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

## AI Feature

The **AI Prioritizer** button sends all active tasks to Google Gemini with a structured prompt. The AI returns:
- A recommended task order based on deadlines, priorities, and workload
- A strategy summary explaining the reasoning
- 3 actionable productivity tips

**Model used:** `gemini-1.5-flash`  
**Why:** Fast, free tier available, reliable JSON output

---

## AI Usage Notes

- **Tool:** Google Gemini API (`gemini-1.5-flash`)
- **How:** Structured prompt engineering — tasks are formatted as a numbered list with metadata, and the model is asked to return strict JSON
- **What was accepted:** Core prompt structure, JSON parsing with regex fallback
- **What was adjusted:** Added specific formatting instructions ("no markdown, no code blocks") to ensure clean JSON output every time
