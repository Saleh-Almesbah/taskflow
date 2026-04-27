import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';
import aiRouter from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.get('/', (_, res) => res.json({ name: 'TaskFlow API', version: '1.0.0', status: 'running' }));
app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.use('/api/tasks', tasksRouter);
app.use('/api/ai', aiRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => console.log(`TaskFlow API running on port ${PORT}`));
