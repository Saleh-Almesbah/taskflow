import { Router } from 'express';
import supabase from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

function extractJSON(text) {
  let depth = 0, start = -1;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') { if (depth === 0) start = i; depth++; }
    else if (text[i] === '}') { depth--; if (depth === 0 && start !== -1) return text.slice(start, i + 1); }
  }
  return null;
}

const router = Router();
router.use(requireAuth);

router.post('/prioritize', async (req, res) => {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('id, title, description, priority, status, due_date, category')
      .eq('user_id', req.user.id)
      .neq('status', 'done');

    if (error) return res.status(500).json({ error: error.message });
    if (!tasks.length) return res.status(400).json({ error: 'No active tasks to analyze' });

    const taskList = tasks.map((t, i) =>
      `${i + 1}. [ID: ${t.id}] "${t.title}"` +
      (t.description ? ` — ${t.description}` : '') +
      ` | Priority: ${t.priority} | Status: ${t.status}` +
      (t.due_date ? ` | Due: ${t.due_date}` : '') +
      (t.category ? ` | Category: ${t.category}` : '')
    ).join('\n');

    const prompt = `You are a productivity expert. Analyze these tasks and provide a smart prioritization plan.

Tasks:
${taskList}

Respond with valid JSON only, no markdown, no code blocks, just the raw JSON:
{
  "ordered_ids": ["id1", "id2", ...],
  "summary": "2-3 sentence overview of the strategy",
  "tips": ["tip 1", "tip 2", "tip 3"]
}

Consider: deadlines, priority labels, task dependencies, and cognitive load.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL,
        'X-Title': 'TaskFlow',
      },
      body: JSON.stringify({
        model: 'tencent/hy3-preview:free',
        messages: [
          { role: 'system', content: 'You are a JSON API. Output ONLY valid JSON. No thinking. No reasoning. No explanations. Just the raw JSON object.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 8192,
      }),
    });

    const aiData = await response.json();

    if (!response.ok) {
      console.error('OpenRouter error:', aiData);
      return res.status(500).json({ error: 'Sorry, a problem came up. Please try again in 2-3 minutes.' });
    }

    const content = aiData.choices?.[0]?.message?.content
      || aiData.choices?.[0]?.message?.reasoning
      || '';
    if (!content) return res.status(500).json({ error: 'Sorry, a problem came up. Please try again in 2-3 minutes.' });

    const jsonStr = extractJSON(content) || content.trim();
    const parsed = JSON.parse(jsonStr);

    const orderedTasks = parsed.ordered_ids
      .map(id => tasks.find(t => t.id === id))
      .filter(Boolean);
    const remaining = tasks.filter(t => !parsed.ordered_ids.includes(t.id));

    res.json({
      ordered_tasks: [...orderedTasks, ...remaining],
      summary: parsed.summary,
      tips: parsed.tips,
    });
  } catch (err) {
    console.error('AI prioritize error:', err.message);
    res.status(500).json({ error: 'Sorry, a problem came up. Please try again in 2-3 minutes.' });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('id, title, description, priority, status, due_date, category')
      .eq('user_id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });

    const taskList = tasks.length > 0
      ? tasks.map((t, i) =>
          `${i + 1}. [ID: ${t.id}] "${t.title}"` +
          (t.description ? ` — ${t.description}` : '') +
          ` | Priority: ${t.priority} | Status: ${t.status}` +
          (t.due_date ? ` | Due: ${t.due_date}` : '') +
          (t.category ? ` | Category: ${t.category}` : '')
        ).join('\n')
      : 'No tasks yet.';

    const today = new Date().toISOString().split('T')[0];

    const prompt = `You are a task management AI assistant. Today is ${today}.

The user's current tasks:
${taskList}

User message: "${message}"

Respond with valid JSON only, no markdown, no code blocks:
{
  "reply": "Your friendly conversational response",
  "action": "create" | "update" | "delete" | "prioritize" | "none",
  "payload": {}
}

Payload shapes per action:
- create:     { "title": "...", "description": "...", "priority": "low|medium|high", "status": "todo|in_progress|done", "due_date": "YYYY-MM-DD or null", "category": "..." }
- update:     { "id": "exact-uuid-from-list", "changes": { fields to update } }
- delete:     { "id": "exact-uuid-from-list" }
- prioritize: { "ordered_ids": ["id1", "id2", ...] }
- none:       {}

Rules:
- Extract all task details from the user message when creating.
- Match tasks by name to their exact UUID when updating or deleting.
- If you cannot identify a specific task, use action "none" and ask for clarification.
- Be friendly and concise.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL,
        'X-Title': 'TaskFlow',
      },
      body: JSON.stringify({
        model: 'tencent/hy3-preview:free',
        messages: [
          { role: 'system', content: 'You are a JSON API. Output ONLY valid JSON. No thinking. No reasoning. No explanations. Just the raw JSON object.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 8192,
      }),
    });

    const aiData = await response.json();

    if (!response.ok) {
      console.error('OpenRouter error:', aiData);
      return res.status(500).json({ error: 'Sorry, a problem came up. Please try again in 2-3 minutes.' });
    }

    const content = aiData.choices?.[0]?.message?.content
      || aiData.choices?.[0]?.message?.reasoning
      || '';
    if (!content) return res.status(500).json({ error: 'Sorry, a problem came up. Please try again in 2-3 minutes.' });

    const jsonStr = extractJSON(content);
    if (!jsonStr) {
      // Model replied conversationally instead of JSON — return it as a plain reply
      return res.json({ reply: content.trim(), action: 'none', payload: {} });
    }
    const parsed = JSON.parse(jsonStr);
    res.json(parsed);
  } catch (err) {
    console.error('AI chat error:', err.message);
    res.status(500).json({ error: 'Sorry, a problem came up. Please try again in 2-3 minutes.' });
  }
});

export default router;
