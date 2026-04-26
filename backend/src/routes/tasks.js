import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import supabase from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

// GET /api/tasks — list with optional search/filter/sort
router.get('/', [
  query('search').optional().isString().trim(),
  query('status').optional().isIn(['todo', 'in_progress', 'done']),
  query('priority').optional().isIn(['low', 'medium', 'high']),
  query('sort').optional().isIn(['due_date', 'priority', 'created_at']),
], async (req, res) => {
  const { search, status, priority, sort = 'created_at' } = req.query;

  let queryBuilder = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', req.user.id);

  if (search) queryBuilder = queryBuilder.ilike('title', `%${search}%`);
  if (status) queryBuilder = queryBuilder.eq('status', status);
  if (priority) queryBuilder = queryBuilder.eq('priority', priority);

  const priorityOrder = { high: 1, medium: 2, low: 3 };
  if (sort === 'priority') {
    queryBuilder = queryBuilder.order('priority', { ascending: true });
  } else if (sort === 'due_date') {
    queryBuilder = queryBuilder.order('due_date', { ascending: true, nullsFirst: false });
  } else {
    queryBuilder = queryBuilder.order('created_at', { ascending: false });
  }

  const { data, error } = await queryBuilder;
  if (error) return res.status(500).json({ error: error.message });

  // client-side priority sort since Supabase sorts strings alphabetically
  if (sort === 'priority') {
    data.sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9));
  }

  res.json(data);
});

// POST /api/tasks — create
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('status').optional().isIn(['todo', 'in_progress', 'done']),
  body('due_date').optional({ nullable: true }).isISO8601().withMessage('Invalid date format'),
  body('category').optional().trim().isLength({ max: 50 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, description, priority = 'medium', status = 'todo', due_date, category } = req.body;

  const { data, error } = await supabase
    .from('tasks')
    .insert({ user_id: req.user.id, title, description, priority, status, due_date: due_date || null, category })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/tasks/:id — update
router.put('/:id', [
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('description').optional({ nullable: true }).trim().isLength({ max: 1000 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('status').optional().isIn(['todo', 'in_progress', 'done']),
  body('due_date').optional({ nullable: true }).isISO8601(),
  body('category').optional({ nullable: true }).trim().isLength({ max: 50 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const allowed = ['title', 'description', 'priority', 'status', 'due_date', 'category'];
  const updates = {};
  for (const key of allowed) {
    if (key in req.body) updates[key] = req.body[key];
  }
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Task not found' });
  res.json(data);
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  const { error, count } = await supabase
    .from('tasks')
    .delete({ count: 'exact' })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  if (count === 0) return res.status(404).json({ error: 'Task not found' });
  res.status(204).send();
});

export default router;
