# TaskFlow

A full-stack task management web application with AI-powered task management.

**Live Demo:** [taskflow-nine-nu.vercel.app](https://taskflow-nine-nu.vercel.app)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database + Auth | Supabase (PostgreSQL) |
| AI | OpenRouter API (LLaMA 3.1 8B) |
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
- Dark mode with persistent preference
- English / Arabic language switching with full RTL support
- **AI Assistant** — chat with an AI to create, edit, delete, or prioritize tasks using natural language

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
OPENROUTER_API_KEY=your_openrouter_api_key
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

The **AI Assistant** opens as a chat panel. Users type natural language commands and the AI performs real actions on their tasks:

- *"Create a task to finish the report due Friday with high priority"* → creates the task
- *"Delete the groceries task"* → deletes it
- *"Prioritize my tasks"* → suggests an optimal order
- *"Mark the first task as done"* → updates the status

**How it works:**
1. The user's message is sent to the backend along with their current task list
2. The backend sends a structured prompt to OpenRouter (LLaMA 3.1 8B Instruct, free tier)
3. The AI returns strict JSON: `{ reply, action, payload }`
4. The frontend executes the action via the tasks API and shows the AI's reply in chat

**Model:** `meta-llama/llama-3.1-8b-instruct:free` via OpenRouter  
**Why:** Free tier, reliable JSON output, fast response times

---

## AI Usage Notes

- **Tool:** OpenRouter API (`meta-llama/llama-3.1-8b-instruct:free`)
- **How:** Structured prompt engineering — tasks are formatted as a numbered list with metadata and UUIDs, and the model is instructed to return strict JSON with an action type and payload
- **What was accepted:** Core prompt structure, JSON parsing with regex fallback, action/payload schema design
- **What was adjusted:** Added explicit formatting rules ("no markdown, no code blocks"), defined exact payload shapes per action type, added today's date injection so the AI understands relative deadlines like "tomorrow"
