import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../lib/api.js';
import TaskCard from '../components/TaskCard.jsx';
import TaskModal from '../components/TaskModal.jsx';
import AIPrioritizer from '../components/AIPrioritizer.jsx';

const STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const PRIORITIES = [
  { value: '', label: 'All priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const SORTS = [
  { value: 'created_at', label: 'Newest first' },
  { value: 'due_date', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiOrdered, setAiOrdered] = useState(false);

  // filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('created_at');

  // modals
  const [editingTask, setEditingTask] = useState(null); // null = closed, {} = new, task = edit
  const [showAI, setShowAI] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setAiOrdered(false);
    try {
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      if (priority) params.priority = priority;
      params.sort = sort;
      const { data } = await api.get('/api/tasks', { params });
      setTasks(data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, sort]);

  useEffect(() => {
    const timer = setTimeout(fetchTasks, 300);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  async function handleSave(form) {
    try {
      if (form.id) {
        const { data } = await api.put(`/api/tasks/${form.id}`, form);
        setTasks(ts => ts.map(t => t.id === data.id ? data : t));
        toast.success('Task updated');
      } else {
        const { data } = await api.post('/api/tasks', form);
        setTasks(ts => [data, ...ts]);
        toast.success('Task created');
      }
      setEditingTask(null);
    } catch (err) {
      const msgs = err.response?.data?.errors;
      toast.error(msgs ? msgs[0].msg : 'Failed to save task');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks(ts => ts.filter(t => t.id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  }

  async function handleToggleDone(task) {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    try {
      const { data } = await api.put(`/api/tasks/${task.id}`, { status: newStatus });
      setTasks(ts => ts.map(t => t.id === data.id ? data : t));
    } catch {
      toast.error('Failed to update task');
    }
  }

  function handleAIResult(ordered) {
    setTasks(ordered);
    setAiOrdered(true);
  }

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    high: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <span className="font-bold text-gray-900 text-lg">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
            <button onClick={signOut} className="btn-secondary text-xs px-3 py-1.5">Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total tasks', value: stats.total, color: 'text-blue-600' },
            { label: 'Completed', value: stats.done, color: 'text-purple-600' },
            { label: 'High priority', value: stats.high, color: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Actions row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button className="btn-primary" onClick={() => setEditingTask({})}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New task
          </button>
          <button
            className="btn-secondary"
            onClick={() => setShowAI(true)}
            title="Let AI suggest the best task order"
          >
            🤖 AI Prioritize
          </button>
          {aiOrdered && (
            <span className="flex items-center gap-1 text-sm text-blue-600 font-medium">
              <span>✨</span> AI order applied
              <button onClick={fetchTasks} className="text-gray-400 hover:text-gray-600 ml-1 text-xs underline">reset</button>
            </span>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
          <div className="sm:col-span-1">
            <input
              className="input"
              placeholder="🔍 Search tasks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="input" value={status} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select className="input" value={priority} onChange={e => setPriority(e.target.value)}>
            {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <select className="input" value={sort} onChange={e => setSort(e.target.value)}>
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Task list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-medium text-gray-700">No tasks found</p>
            <p className="text-sm text-gray-400 mt-1">
              {search || status || priority ? 'Try adjusting your filters' : 'Create your first task to get started'}
            </p>
            {!search && !status && !priority && (
              <button className="btn-primary mt-4" onClick={() => setEditingTask({})}>
                Create first task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                onDelete={handleDelete}
                onToggleDone={handleToggleDone}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {editingTask !== null && (
        <TaskModal
          task={editingTask.id ? editingTask : null}
          onClose={() => setEditingTask(null)}
          onSave={handleSave}
        />
      )}
      {showAI && (
        <AIPrioritizer
          onResult={handleAIResult}
          onClose={() => setShowAI(false)}
        />
      )}
    </div>
  );
}
