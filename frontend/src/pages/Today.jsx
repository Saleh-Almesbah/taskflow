import { useEffect, useState } from 'react';
import { isToday, isPast, format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../lib/api.js';
import Layout from '../components/Layout.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskModal from '../components/TaskModal.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function Today() {
  const { t } = useLanguage();
  const [allTasks, setAllTasks]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/api/tasks', { params: { sort: 'due_date' } });
        setAllTasks(data);
      } catch { toast.error('Failed to load tasks'); }
      finally { setLoading(false); }
    })();
  }, []);

  const todayTasks   = allTasks.filter(t => { if (!t.due_date || t.status === 'done') return false; const d = new Date(t.due_date + 'T00:00:00'); return isToday(d); });
  const overdueTasks = allTasks.filter(t => { if (!t.due_date || t.status === 'done') return false; const d = new Date(t.due_date + 'T00:00:00'); return isPast(d) && !isToday(d); });

  async function handleSave(form) {
    try {
      if (form.id) {
        const { data } = await api.put(`/api/tasks/${form.id}`, form);
        setAllTasks(ts => ts.map(tk => tk.id === data.id ? data : tk));
        toast.success('Task updated ✓');
      } else {
        const { data } = await api.post('/api/tasks', form);
        setAllTasks(ts => [data, ...ts]);
        toast.success('Task created ✓');
      }
      setEditingTask(null);
    } catch { toast.error('Failed to save'); }
  }

  async function handleDelete(id) {
    if (!confirm(t.deleteConfirm)) return;
    try { await api.delete(`/api/tasks/${id}`); setAllTasks(ts => ts.filter(tk => tk.id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed to delete'); }
  }

  async function handleToggleDone(task) {
    try {
      const { data } = await api.put(`/api/tasks/${task.id}`, { status: task.status === 'done' ? 'todo' : 'done' });
      setAllTasks(ts => ts.map(tk => tk.id === data.id ? data : tk));
    } catch { toast.error('Failed to update'); }
  }

  const total = todayTasks.length + overdueTasks.length;

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#332F3A]" style={{ fontFamily: 'Nunito, sans-serif' }}>{t.todayTitle}</h1>
            <p className="text-sm text-[#635F69] font-medium mt-0.5">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          </div>
          <button className="btn-clay self-start" onClick={() => setEditingTask({})}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            {t.newTask}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : total === 0 ? (
          <div className="card-clay p-16 text-center">
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-clayButton animate-clay-breathe">
              <span className="text-4xl">🎉</span>
            </div>
            <p className="text-lg font-black text-[#332F3A] mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>{t.allClear}</p>
            <p className="text-sm text-[#635F69] font-medium">{t.allClearDesc}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {overdueTasks.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-[12px] bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-clayButton">
                    <span className="text-sm">⚠</span>
                  </div>
                  <h2 className="text-sm font-black text-red-600 uppercase tracking-widest">{t.overdue}</h2>
                  <span className="badge-clay bg-red-100 text-red-600">{overdueTasks.length}</span>
                </div>
                <div className="space-y-3">
                  {overdueTasks.map(task => (
                    <TaskCard key={task.id} task={task} onEdit={setEditingTask} onDelete={handleDelete} onToggleDone={handleToggleDone} />
                  ))}
                </div>
              </section>
            )}
            {todayTasks.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-[12px] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-clayButton">
                    <span className="text-sm">📅</span>
                  </div>
                  <h2 className="text-sm font-black text-amber-600 uppercase tracking-widest">{t.dueToday}</h2>
                  <span className="badge-clay bg-amber-100 text-amber-600">{todayTasks.length}</span>
                </div>
                <div className="space-y-3">
                  {todayTasks.map(task => (
                    <TaskCard key={task.id} task={task} onEdit={setEditingTask} onDelete={handleDelete} onToggleDone={handleToggleDone} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
      {editingTask !== null && (
        <TaskModal task={editingTask.id ? editingTask : null} onClose={() => setEditingTask(null)} onSave={handleSave} />
      )}
    </Layout>
  );
}
