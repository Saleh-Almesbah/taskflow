import { GoogleGenerativeAI } from '@google/generative-ai';
import { Router } from 'express';
import supabase from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.use(requireAuth);

// POST /api/ai/prioritize — analyze tasks and suggest priority order + tips
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

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a productivity expert. Analyze these tasks and provide a smart prioritization plan.

Tasks:
${taskList}

Respond with valid JSON only, no markdown, no code blocks, just the raw JSON object:
{
  "ordered_ids": ["id1", "id2", ...],
  "summary": "2-3 sentence overview of the strategy",
  "tips": ["tip 1", "tip 2", "tip 3"]
}

Consider: deadlines, current priority labels, task dependencies implied by descriptions, and cognitive load.`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);

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
    const msg = err.message?.includes('API_KEY_INVALID')
      ? 'Invalid Gemini API key. Check your backend .env file.'
      : err.message?.includes('quota')
      ? 'AI quota reached. Please try again later.'
      : 'AI analysis failed. Please try again.';
    res.status(500).json({ error: msg });
  }
});

export default router;
