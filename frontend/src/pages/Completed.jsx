import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api.js';
import Layout from '../components/Layout.jsx';
import TaskCard from '../components/TaskCard.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function Completed() {
  const { t } = useLanguage();
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/api/tasks', { params: { status: 'done', sort: 'created_at' } });
        setTasks(data);
      } catch { toast.error('Failed to load'); }
      finally { setLoading(false); }
    })();
  }, []);

  async function handleDelete(id) {
    if (!confirm(t.deleteConfirm)) return;
    try { await api.delete(`/api/tasks/${id}`); setTasks(ts => ts.filter(tk => tk.id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed to delete'); }
  }

  async function handleToggleDone(task) {
    try {
      const { data } = await api.put(`/api/tasks/${task.id}`, { status: 'todo' });
      setTasks(ts => ts.filter(tk => tk.id !== data.id));
      toast.success('Moved back to active ↩');
    } catch { toast.error('Failed to update'); }
  }

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[#332F3A]" style={{ fontFamily: 'Nunito, sans-serif' }}>{t.completedTitle}</h1>
          <p className="text-sm text-[#635F69] font-medium mt-0.5">{t.completedCount(tasks.length)}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="card-clay p-16 text-center">
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center mx-auto mb-5 shadow-clayCard">
              <span className="text-4xl">🏆</span>
            </div>
            <p className="text-lg font-black text-[#332F3A] mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>{t.noCompletedYet}</p>
            <p className="text-sm text-[#635F69] font-medium">{t.noCompletedDesc}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={() => {}} onDelete={handleDelete} onToggleDone={handleToggleDone} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
