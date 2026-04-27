import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api.js';
import Layout from '../components/Layout.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskModal from '../components/TaskModal.jsx';
import AIChat from '../components/AIChat.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function Tasks() {
  const { t } = useLanguage();

  const [tasks, setTasks]            = useState([]);
  const [loading, setLoading]        = useState(true);
  const [search, setSearch]          = useState('');
  const [status, setStatus]          = useState('');
  const [priority, setPriority]      = useState('');
  const [sort, setSort]              = useState('created_at');
  const [editingTask, setEditingTask] = useState(null);
  const [showAI, setShowAI]          = useState(false);
  const [aiOrdered, setAiOrdered]    = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortRef = useRef(null);

  // Close sort dropdown on outside click
  useEffect(() => {
    function onOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) setShowSortMenu(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

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

  useEffect(() => { const id = setTimeout(fetchTasks, 300); return () => clearTimeout(id); }, [fetchTasks]);

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
    if (!confirm(t.deleteConfirm)) return;
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

  const sortOptions = [
    { value: 'created_at', label: t.newestFirst },
    { value: 'due_date',   label: t.byDueDate },
    { value: 'priority',   label: t.byPriority },
  ];

  const statCards = [
    { label: t.total,        value: tasks.length,                                                      emoji: '📋', from: 'from-blue-400',    to: 'to-blue-600' },
    { label: t.active,       value: activeTasks.length,                                                emoji: '⚡', from: 'from-violet-400', to: 'to-violet-600' },
    { label: t.done,         value: doneTasks.length,                                                  emoji: '✅', from: 'from-emerald-400', to: 'to-emerald-600' },
    { label: t.highPriority, value: tasks.filter(tk => tk.priority === 'high' && tk.status !== 'done').length, emoji: '🔴', from: 'from-red-400', to: 'to-red-600' },
  ];

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#332F3A]" style={{ fontFamily: 'Nunito, sans-serif' }}>{t.allTasksTitle}</h1>
            <p className="text-sm text-[#635F69] font-medium mt-0.5">{t.tasksTotal(tasks.length)}</p>
          </div>
          <div className="flex gap-2 flex-wrap">

            {/* Sort button */}
            <div className="relative" ref={sortRef}>
              <button
                className="btn-clay-secondary flex items-center gap-2"
                onClick={() => setShowSortMenu(v => !v)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                {t.sortBtn}
                <svg className={`w-3 h-3 transition-transform duration-200 ${showSortMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showSortMenu && (
                <div className="absolute end-0 top-full mt-2 w-48 card-clay p-2 z-20 shadow-clayCardHover">
                  {sortOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSort(opt.value); setShowSortMenu(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-[16px] text-sm font-bold text-start transition-all duration-200 ${
                        sort === opt.value
                          ? 'bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white'
                          : 'text-[#635F69] hover:bg-white/70 hover:text-[#332F3A]'
                      }`}
                    >
                      {sort === opt.value && (
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI button */}
            <button className="btn-clay-secondary" onClick={() => setShowAI(true)}>✨ {t.aiBtn}</button>

            {/* New Task button */}
            <button className="btn-clay" onClick={() => setEditingTask({})}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              {t.newTask}
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
              <span>✨</span> {t.aiOrderApplied}
            </div>
            <button onClick={fetchTasks} className="text-xs text-[#635F69] hover:text-[#7C3AED] font-bold underline">{t.reset}</button>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="relative">
            <svg className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9995A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input className="input-clay ps-10" placeholder={t.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-clay" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">{t.allStatuses}</option>
            <option value="todo">{t.toDo}</option>
            <option value="in_progress">{t.inProgress}</option>
            <option value="done">{t.done}</option>
          </select>
          <select className="input-clay" value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="">{t.allPriorities}</option>
            <option value="high">{t.high}</option>
            <option value="medium">{t.medium}</option>
            <option value="low">{t.low}</option>
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
              {hasFilters ? t.noMatchingTasks : t.noTasksYet}
            </p>
            <p className="text-sm text-[#635F69] font-medium">
              {hasFilters ? t.tryAdjustingFilters : t.createFirstTaskDesc}
            </p>
            {!hasFilters && (
              <button className="btn-clay mt-6" onClick={() => setEditingTask({})}>{t.createFirstTaskBtn}</button>
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
                <span className="text-xs font-black text-[#9995A0] uppercase tracking-widest">{t.completedSection(doneTasks.length)}</span>
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
        <AIChat onClose={() => setShowAI(false)} onRefresh={fetchTasks} />
      )}
    </Layout>
  );
}
