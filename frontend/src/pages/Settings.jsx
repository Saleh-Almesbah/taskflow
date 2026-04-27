import { useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const DEFAULTS = { defaultPriority: 'medium', defaultStatus: 'todo', confirmDelete: true };

function load() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('tf_settings') || '{}') }; }
  catch { return DEFAULTS; }
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-center gap-4 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${
          checked ? 'bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] shadow-clayButton' : 'shadow-clayPressed bg-[#EFEBF5]'
        }`}
      >
        <span className={`absolute top-1 start-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${checked ? 'translate-x-5' : ''}`} />
      </button>
      <div>
        <p className="text-sm font-bold text-[#332F3A] group-hover:text-[#7C3AED] transition-colors">{label}</p>
        {description && <p className="text-xs text-[#635F69] font-medium mt-0.5">{description}</p>}
      </div>
    </label>
  );
}

export default function Settings() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState(load);

  function save(next) {
    setSettings(next);
    localStorage.setItem('tf_settings', JSON.stringify(next));
    toast.success('Settings saved ✓');
  }

  const techStack = [
    { label: 'Frontend',  value: 'React 19 + Vite',        emoji: '⚛️' },
    { label: 'Styling',   value: 'Tailwind CSS',            emoji: '🎨' },
    { label: 'Backend',   value: 'Node.js + Express',       emoji: '🚀' },
    { label: 'Database',  value: 'Supabase (PostgreSQL)',   emoji: '🗄️' },
    { label: 'Auth',      value: 'Supabase Auth',           emoji: '🔐' },
    { label: 'AI',        value: 'OpenRouter (LLaMA 3.1)',  emoji: '✨' },
  ];

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[#332F3A]" style={{ fontFamily: 'Nunito, sans-serif' }}>{t.settingsTitle}</h1>
          <p className="text-sm text-[#635F69] font-medium mt-0.5">{t.settingsSubtitle}</p>
        </div>

        {/* Task Defaults */}
        <div className="card-clay p-7 mb-6">
          <h2 className="text-base font-black text-[#332F3A] mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>{t.taskDefaultsTitle}</h2>
          <p className="text-sm text-[#635F69] font-medium mb-6">{t.taskDefaultsSubtitle}</p>
          <div className="space-y-5">
            <div>
              <label className="label-clay">{t.defaultPriorityLabel}</label>
              <select className="input-clay max-w-xs"
                value={settings.defaultPriority}
                onChange={e => save({ ...settings, defaultPriority: e.target.value })}>
                <option value="high">{t.highOpt}</option>
                <option value="medium">{t.mediumOpt}</option>
                <option value="low">{t.lowOpt}</option>
              </select>
            </div>
            <div>
              <label className="label-clay">{t.defaultStatusLabel}</label>
              <select className="input-clay max-w-xs"
                value={settings.defaultStatus}
                onChange={e => save({ ...settings, defaultStatus: e.target.value })}>
                <option value="todo">{t.todoOpt}</option>
                <option value="in_progress">{t.inProgressOpt}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Behavior */}
        <div className="card-clay p-7 mb-6">
          <h2 className="text-base font-black text-[#332F3A] mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>{t.behaviorTitle}</h2>
          <p className="text-sm text-[#635F69] font-medium mb-6">{t.behaviorSubtitle}</p>
          <Toggle
            checked={settings.confirmDelete}
            onChange={val => save({ ...settings, confirmDelete: val })}
            label={t.confirmDeleteLabel}
            description={t.confirmDeleteDesc}
          />
        </div>

        {/* About / Tech Stack */}
        <div className="card-clay p-7">
          <h2 className="text-base font-black text-[#332F3A] mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>{t.aboutTitle}</h2>
          <p className="text-sm text-[#635F69] font-medium mb-6">{t.aboutSubtitle}</p>
          <div className="space-y-2">
            {techStack.map(r => (
              <div key={r.label} className="flex items-center justify-between py-3 border-b border-[#F4F1FA] last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{r.emoji}</span>
                  <span className="text-sm font-bold text-[#635F69]">{r.label}</span>
                </div>
                <span className="badge-clay bg-[#EFEBF5] text-[#332F3A]">{r.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[#F4F1FA] flex items-center justify-between">
            <span className="text-xs font-bold text-[#9995A0] uppercase tracking-widest">{t.versionLabel}</span>
            <span className="badge-clay bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton">v1.0.0</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
