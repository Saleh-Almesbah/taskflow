import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import ClayBlobs from '../components/ClayBlobs.jsx';
import toast from 'react-hot-toast';

export default function Login() {
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    const { error } = await signIn(form.email, form.password);
    setLoading(false);
    if (error) toast.error(error.message);
  }

  const set = f => ev => setForm(p => ({ ...p, [f]: ev.target.value }));

  return (
    <div className="min-h-screen bg-[#F4F1FA] flex items-center justify-center p-6 relative overflow-hidden">
      <ClayBlobs />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center shadow-clayButton animate-clay-breathe">
            <span className="text-white font-black text-xl" style={{ fontFamily: 'Nunito, sans-serif' }}>T</span>
          </div>
          <span className="font-black text-2xl text-[#332F3A]" style={{ fontFamily: 'Nunito, sans-serif' }}>TaskFlow</span>
        </div>

        {/* Card */}
        <div className="card-clay p-8">
          <h1 className="text-2xl font-black text-[#332F3A] mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>Welcome back 👋</h1>
          <p className="text-[#635F69] text-sm font-medium mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="label-clay">Email Address</label>
              <input type="email" className={`input-clay ${errors.email ? 'ring-4 ring-red-400/30 bg-red-50/50' : ''}`}
                placeholder="you@example.com" value={form.email} onChange={set('email')} autoFocus />
              {errors.email && <p className="text-red-500 text-xs mt-2 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="label-clay">Password</label>
              <input type="password" className={`input-clay ${errors.password ? 'ring-4 ring-red-400/30 bg-red-50/50' : ''}`}
                placeholder="••••••••" value={form.password} onChange={set('password')} />
              {errors.password && <p className="text-red-500 text-xs mt-2 font-medium">{errors.password}</p>}
            </div>

            <button type="submit" className="btn-clay w-full h-14 text-base" disabled={loading}>
              {loading
                ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in…</>
                : 'Sign In →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#EFEBF5] text-center">
            <p className="text-sm text-[#635F69] font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#7C3AED] font-bold hover:text-[#6D28D9] transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>

        {/* Floating feature pills */}
        <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
          {['📋 Organized', '📅 Deadlines', '✨ AI Powered'].map(f => (
            <span key={f} className="px-4 py-2 rounded-full bg-white/70 backdrop-blur shadow-clayCard text-xs font-bold text-[#635F69] animate-clay-float">
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
