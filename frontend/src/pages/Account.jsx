import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';
import api from '../lib/api.js';
import Layout from '../components/Layout.jsx';

export default function Account() {
  const { user } = useAuth();
  const [stats, setStats]       = useState({ total: 0, done: 0, high: 0 });
  const [pwForm, setPwForm]     = useState({ password: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [all, done] = await Promise.all([api.get('/api/tasks'), api.get('/api/tasks', { params: { status: 'done' } })]);
        const high = all.data.filter(t => t.priority === 'high' && t.status !== 'done').length;
        setStats({ total: all.data.length, done: done.data.length, high });
      } catch { /* ignore */ }
    })();
  }, []);

  async function handlePasswordChange(e) {
    e.preventDefault();
    const errs = {};
    if (!pwForm.password) errs.password = 'New password is required';
    else if (pwForm.password.length < 6) errs.password = 'Must be at least 6 characters';
    if (pwForm.password !== pwForm.confirm) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setPwErrors({});
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwForm.password });
    setPwLoading(false);
    if (error) toast.error(error.message);
    else { toast.success('Password updated! 🔐'); setPwForm({ password: '', confirm: '' }); }
  }

  const initials     = user?.email?.slice(0, 2).toUpperCase() ?? '??';
  const joinDate     = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—';
  const completion   = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const statItems = [
    { emoji: '📋', label: 'Total Tasks',      value: stats.total, from: 'from-blue-400',    to: 'to-blue-600' },
    { emoji: '✅', label: 'Completed',         value: stats.done,  from: 'from-emerald-400', to: 'to-emerald-600' },
    { emoji: '📈', label: 'Completion Rate',   value: `${completion}%`, from: 'from-violet-400', to: 'to-violet-600' },
  ];

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[#332F3A]" style={{ fontFamily: 'Nunito, sans-serif' }}>Account 👤</h1>
          <p className="text-sm text-[#635F69] font-medium mt-0.5">Manage your profile and security</p>
        </div>

        {/* Profile */}
        <div className="card-clay p-7 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center text-white text-2xl font-black shadow-clayButton animate-clay-breathe flex-shrink-0"
              style={{ fontFamily: 'Nunito, sans-serif' }}>
              {initials}
            </div>
            <div>
              <p className="font-black text-lg text-[#332F3A]" style={{ fontFamily: 'Nunito, sans-serif' }}>{user?.email}</p>
              <p className="text-sm text-[#635F69] font-medium mt-0.5">Member since {joinDate}</p>
              <span className="badge-clay bg-violet-100 text-[#7C3AED] mt-2">✨ Free Plan</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {statItems.map(s => (
            <div key={s.label} className="card-clay p-5 text-center hover:-translate-y-2 hover:shadow-clayCardHover transition-all duration-500 cursor-default">
              <div className={`w-12 h-12 rounded-[18px] bg-gradient-to-br ${s.from} ${s.to} flex items-center justify-center mx-auto mb-3 shadow-clayButton`}>
                <span className="text-xl">{s.emoji}</span>
              </div>
              <p className="text-xl font-black text-[#332F3A]" style={{ fontFamily: 'Nunito, sans-serif' }}>{s.value}</p>
              <p className="text-xs font-bold text-[#635F69] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Change password */}
        <div className="card-clay p-7">
          <h2 className="text-lg font-black text-[#332F3A] mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>Change Password 🔐</h2>
          <p className="text-sm text-[#635F69] font-medium mb-6">Choose a strong new password</p>
          <form onSubmit={handlePasswordChange} noValidate className="space-y-5">
            <div>
              <label className="label-clay">New Password</label>
              <input type="password" className={`input-clay ${pwErrors.password ? 'ring-4 ring-red-400/30 bg-red-50/50' : ''}`}
                placeholder="At least 6 characters" value={pwForm.password}
                onChange={e => setPwForm(f => ({ ...f, password: e.target.value }))} />
              {pwErrors.password && <p className="text-red-500 text-xs mt-2 font-medium">{pwErrors.password}</p>}
            </div>
            <div>
              <label className="label-clay">Confirm New Password</label>
              <input type="password" className={`input-clay ${pwErrors.confirm ? 'ring-4 ring-red-400/30 bg-red-50/50' : ''}`}
                placeholder="Repeat password" value={pwForm.confirm}
                onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} />
              {pwErrors.confirm && <p className="text-red-500 text-xs mt-2 font-medium">{pwErrors.confirm}</p>}
            </div>
            <button type="submit" className="btn-clay" disabled={pwLoading}>
              {pwLoading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
