import { useEffect, useState } from 'react';

const PRIORITIES = [
  { value: 'high',   label: '🔴 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low',    label: '🟢 Low' },
];
const STATUSES = [
  { value: 'todo',        label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done',        label: 'Done' },
];

export default function TaskModal({ task, onClose, onSave }) {
  const isEdit = !!task?.id;
  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium',
    status: 'todo', category: '',
    ...task,
    due_date: task?.due_date ? task.due_date.split('T')[0] : '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (form.title.length > 200) e.title = 'Title must be under 200 characters';
    if ((form.description?.length ?? 0) > 1000) e.description = 'Description too long';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    await onSave({ ...form, due_date: form.due_date || null });
    setSaving(false);
  }

  const set = (field) => (ev) => setForm(f => ({ ...f, [field]: ev.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#332F3A]/40 backdrop-blur-sm"
      onClick={onClose}>

      {/* Background blobs inside modal */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]" aria-hidden>
        <div className="absolute w-48 h-48 rounded-full bg-[#8B5CF6]/10 blur-2xl -top-10 -right-10" />
        <div className="absolute w-40 h-40 rounded-full bg-[#EC4899]/8 blur-2xl -bottom-10 -left-10" />
      </div>

      <div className="relative bg-white/80 backdrop-blur-xl w-full sm:max-w-lg sm:rounded-[32px] rounded-t-[32px] shadow-clayDeep max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/60">
          <h2 className="text-lg font-black text-[#332F3A]" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {isEdit ? '✏️ Edit Task' : '✨ New Task'}
          </h2>
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-[14px] text-[#635F69] hover:text-[#332F3A] hover:bg-[#EFEBF5] transition-all duration-200">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="px-7 py-6 space-y-5">
          <div>
            <label className="label-clay">Title <span className="text-red-400 normal-case tracking-normal">*</span></label>
            <input className={`input-clay ${errors.title ? 'ring-4 ring-red-400/30 bg-red-50' : ''}`}
              placeholder="What needs to be done?" value={form.title} onChange={set('title')} autoFocus />
            {errors.title && <p className="text-red-500 text-xs mt-2 font-medium">{errors.title}</p>}
          </div>

          <div>
            <label className="label-clay">Description</label>
            <textarea className={`input-clay h-24 py-4 resize-none ${errors.description ? 'ring-4 ring-red-400/30' : ''}`}
              placeholder="Add more details…" value={form.description} onChange={set('description')} />
            {errors.description && <p className="text-red-500 text-xs mt-2 font-medium">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-clay">Priority</label>
              <select className="input-clay" value={form.priority} onChange={set('priority')}>
                {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label-clay">Status</label>
              <select className="input-clay" value={form.status} onChange={set('status')}>
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-clay">Due Date</label>
              <input type="date" className="input-clay" value={form.due_date} onChange={set('due_date')} />
            </div>
            <div>
              <label className="label-clay">Category</label>
              <input className="input-clay" placeholder="Work, Personal…" value={form.category} onChange={set('category')} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-clay-secondary flex-1" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-clay flex-1" disabled={saving}>
              {saving
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
                : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
