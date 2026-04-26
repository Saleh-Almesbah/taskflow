import { Router } from 'express';
import supabase from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

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
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
      }),
    });

    const aiData = await response.json();

    if (!response.ok) {
      console.error('OpenRouter error:', aiData);
      return res.status(500).json({ error: 'AI service error. Please try again.' });
    }

    const raw = aiData.choices[0].message.content.trim();
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
    res.status(500).json({ error: 'AI analysis failed. Please try again.' });
  }
});

export default router;
