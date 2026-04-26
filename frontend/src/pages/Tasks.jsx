import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api.js';
import Layout from '../components/Layout.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskModal from '../components/TaskModal.jsx';
import AIPrioritizer from '../components/AIPrioritizer.jsx';

const STATUSES  = [{ value:'',label:'All statuses'},{ value:'todo',label:'To Do'},{ value:'in_progress',label:'In Progress'},{ value:'done',label:'Done'}];
const PRIORITIES= [{ value:'',label:'All priorities'},{ value:'high',label:'High'},{ value:'medium',label:'Medium'},{ value:'low',label:'Low'}];
const SORTS     = [{ value:'created_at',label:'Newest first'},{ value:'due_date',label:'Due date'},{ value:'priority',label:'Priority'}];

export default function Tasks() {
  const [tasks, setTasks]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [status, setStatus]         = useState('');
  const [priority, setPriority]     = useState('');
  const [sort, setSort]             = useState('created_at');
  const [editingTask, setEditingTask]= useState(null);
  const [showAI, setShowAI]         = useState(false);
  const [aiOrdered, setAiOrdered]   = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true); setAiOrdered(false);
    try {
      const params = { sort };
      if (search)   params.search   = search;
      if (status)   params.status   = status;
      if (priority) params.priority = priority;
      const { data } = await api.get('/api/tasks', { params });
      setTasks(data);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  }, [search, status, priority, sort]);

  useEffect(() => { const t = setTimeout(fetchTasks, 300); return () => clearTimeout(t); }, [fetchTasks]);

  async function handleSave(form) {
    try {
      if (form.id) {
        const { data } = await api.put(`/api/tasks/${form.id}`, form);
        setTasks(ts => ts.map(t => t.id === data.id ? data : t));
        toast.success('Task updated ✓');
      } else {
        const { data } = await api.post('/api/tasks', form);
        setTasks(ts => [data, ...ts]);
        toast.success('Task created ✓');
      }
      setEditingTask(null);
    } catch (err) { toast.error(err.response?.data?.errors?.[0]?.msg || 'Failed to save'); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this task?')) return;
    try { await api.delete(`/api/tasks/${id}`); setTasks(ts => ts.filter(t => t.id !== id)); toast.success('Task deleted'); }
    catch { toast.error('Failed to delete'); }
  }

  async function handleToggleDone(task) {
    try {
      const { data } = await api.put(`/api/tasks/${task.id}`, { status: task.status === 'done' ? 'todo' : 'done' });
      setTasks(ts => ts.map(t => t.id === data.id ? data : t));
    } catch { toast.error('Failed to update'); }
  }

  const activeTasks = tasks.filter(t => t.status !== 'done');
  const doneTasks   = tasks.filter(t => t.status === 'done');
  const hasFilters  = search || status || priority;

  const statCards = [
    { label: 'Total', value: tasks.length,                 emoji: '📋', from: 'from-blue-400',    to: 'to-blue-600' },
    { label: 'Active', value: activeTasks.length,          emoji: '⚡', from: 'from-violet-400', to: 'to-violet-600' },
    { label: 'Done',   value: doneTasks.length,            emoji: '✅', from: 'from-emerald-400',to: 'to-emerald-600' },
    { label: 'High ⚠', value: tasks.filter(t=>t.priority==='high'&&t.status!=='done').length, emoji: '🔴', from: 'from-red-400', to: 'to-red-600' },
  ];

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#332F3A]" style={{ fontFamily: 'Nunito, sans-serif' }}>All Tasks 📋</h1>
            <p className="text-sm text-[#635F69] font-medium mt-0.5">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-clay-secondary" onClick={() => setShowAI(true)}>✨ AI Prioritize</button>
            <button className="btn-clay" onClick={() => setEditingTask({})}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              New Task
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {statCards.map(s => (
            <div key={s.label} className="card-clay p-5 text-center hover:-translate-y-2 hover:shadow-clayCardHover transition-all duration-500 cursor-default">
              <div className={`w-12 h-12 rounded-[18px] bg-gradient-to-br ${s.from} ${s.to} flex items-center justify-center mx-auto mb-3 shadow-clayButton animate-clay-breathe`}>
                <span className="text-xl">{s.emoji}</span>
              </div>
              <p className="text-2xl font-black text-[#332F3A]" style={{ fontFamily: 'Nunito, sans-serif' }}>{s.value}</p>
              <p className="text-xs font-bold text-[#635F69] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* AI banner */}
        {aiOrdered && (
          <div className="card-clay p-4 mb-5 bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#7C3AED] font-bold">
              <span>✨</span> AI order applied — tasks reordered by smart priority
            </div>
            <button onClick={fetchTasks} className="text-xs text-[#635F69] hover:text-[#7C3AED] font-bold underline">Reset</button>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
          <div className="relative sm:col-span-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9995A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input className="input-clay pl-10" placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-clay" value={status}   onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(s  => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select className="input-clay" value={priority} onChange={e => setPriority(e.target.value)}>
            {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <select className="input-clay" value={sort}     onChange={e => setSort(e.target.value)}>
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Task list */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="card-clay p-16 text-center">
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center mx-auto mb-5 shadow-clayCard">
              <span className="text-4xl">📭</span>
            </div>
            <p className="text-lg font-black text-[#332F3A] mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {hasFilters ? 'No matching tasks' : 'No tasks yet'}
            </p>
            <p className="text-sm text-[#635F69] font-medium">
              {hasFilters ? 'Try adjusting your filters' : 'Create your first task to get started'}
            </p>
            {!hasFilters && (
              <button className="btn-clay mt-6" onClick={() => setEditingTask({})}>Create First Task</button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {activeTasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={setEditingTask} onDelete={handleDelete} onToggleDone={handleToggleDone} />
            ))}
            {doneTasks.length > 0 && activeTasks.length > 0 && (
              <div className="flex items-center gap-4 py-3">
                <div className="flex-1 h-px bg-[#EFEBF5]" />
                <span className="text-xs font-black text-[#9995A0] uppercase tracking-widest">Completed ({doneTasks.length})</span>
                <div className="flex-1 h-px bg-[#EFEBF5]" />
              </div>
            )}
            {doneTasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={setEditingTask} onDelete={handleDelete} onToggleDone={handleToggleDone} />
            ))}
          </div>
        )}
      </div>

      {editingTask !== null && (
        <TaskModal task={editingTask.id ? editingTask : null} onClose={() => setEditingTask(null)} onSave={handleSave} />
      )}
      {showAI && (
        <AIPrioritizer onResult={t => { setTasks(t); setAiOrdered(true); }} onClose={() => setShowAI(false)} />
      )}
    </Layout>
  );
}
