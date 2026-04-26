import { format, isPast, isToday } from 'date-fns';

const priorityConfig = {
  high:   { label: 'High',   bg: 'bg-red-100',     text: 'text-red-600',     dot: 'bg-red-500',     glow: 'shadow-[0_0_0_3px_rgba(239,68,68,0.15)]' },
  medium: { label: 'Medium', bg: 'bg-amber-100',   text: 'text-amber-600',   dot: 'bg-amber-500',   glow: 'shadow-[0_0_0_3px_rgba(245,158,11,0.15)]' },
  low:    { label: 'Low',    bg: 'bg-emerald-100', text: 'text-emerald-600', dot: 'bg-emerald-500', glow: 'shadow-[0_0_0_3px_rgba(16,185,129,0.15)]' },
};

const statusConfig = {
  todo:        { label: 'To Do',       bg: 'bg-[#EFEBF5]',   text: 'text-[#635F69]' },
  in_progress: { label: 'In Progress', bg: 'bg-violet-100',   text: 'text-violet-700' },
  done:        { label: 'Done',        bg: 'bg-emerald-100',  text: 'text-emerald-700' },
};

export default function TaskCard({ task, onEdit, onDelete, onToggleDone }) {
  const pri = priorityConfig[task.priority] ?? priorityConfig.medium;
  const sta = statusConfig[task.status] ?? statusConfig.todo;
  const isDone = task.status === 'done';

  let dueBadge = null;
  if (task.due_date) {
    const d = new Date(task.due_date + 'T00:00:00');
    const overdue = !isDone && isPast(d) && !isToday(d);
    const today = isToday(d);
    dueBadge = (
      <span className={`badge-clay ${overdue ? 'bg-red-100 text-red-600' : today ? 'bg-amber-100 text-amber-600' : 'bg-[#EFEBF5] text-[#635F69]'}`}>
        {overdue ? '⚠' : today ? '📅' : '📆'} {format(d, 'MMM d')}
      </span>
    );
  }

  return (
    <div className={`group card-clay-hover p-5 ${isDone ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Completion toggle */}
        <button
          onClick={() => onToggleDone(task)}
          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-clayPressed ${
            isDone
              ? 'bg-gradient-to-br from-[#34D399] to-[#10B981] border-transparent shadow-clayButton'
              : 'border-[#C4BFCE] hover:border-[#7C3AED] hover:bg-[#7C3AED]/10'
          }`}
          title={isDone ? 'Mark incomplete' : 'Mark complete'}
        >
          {isDone && (
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-[#332F3A] leading-snug ${isDone ? 'line-through text-[#9995A0]' : ''}`}
            style={{ fontFamily: 'Nunito, sans-serif' }}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-[#635F69] mt-1.5 line-clamp-2 leading-relaxed font-medium">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`badge-clay ${pri.bg} ${pri.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />
              {pri.label}
            </span>
            <span className={`badge-clay ${sta.bg} ${sta.text}`}>{sta.label}</span>
            {task.category && (
              <span className="badge-clay bg-[#EFEBF5] text-[#635F69]">{task.category}</span>
            )}
            {dueBadge}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
          <button onClick={() => onEdit(task)}
            className="w-9 h-9 flex items-center justify-center rounded-[14px] text-[#635F69] hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 hover:shadow-clayCard transition-all duration-200 hover:-translate-y-0.5"
            title="Edit">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => onDelete(task.id)}
            className="w-9 h-9 flex items-center justify-center rounded-[14px] text-[#635F69] hover:text-red-500 hover:bg-red-50 hover:shadow-clayCard transition-all duration-200 hover:-translate-y-0.5"
            title="Delete">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
