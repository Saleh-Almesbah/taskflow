-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)

create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null check (char_length(title) <= 200),
  description text check (char_length(description) <= 1000),
  priority    text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status      text not null default 'todo'   check (status in ('todo', 'in_progress', 'done')),
  due_date    date,
  category    text check (char_length(category) <= 50),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Each user only sees their own tasks (Row Level Security)
alter table public.tasks enable row level security;

create policy "Users can manage their own tasks"
  on public.tasks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for fast queries per user
create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_status_idx on public.tasks(user_id, status);
create index if not exists tasks_due_date_idx on public.tasks(user_id, due_date);
