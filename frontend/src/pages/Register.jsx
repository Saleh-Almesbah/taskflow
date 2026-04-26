import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import ClayBlobs from '../components/ClayBlobs.jsx';
import toast from 'react-hot-toast';

export default function Register() {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function validate() {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    const { error } = await signUp(form.email, form.password);
    setLoading(false);
    if (error) toast.error(error.message);
    else setDone(true);
  }

  const set = f => ev => setForm(p => ({ ...p, [f]: ev.target.value }));

  if (done) return (
    <div className="min-h-screen bg-[#F4F1FA] flex items-center justify-center p-6 relative overflow-hidden">
      <ClayBlobs />
      <div className="card-clay p-10 w-full max-w-md text-center relative z-10">
        <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-clayButton animate-clay-breathe">
          <span className="text-4xl">📧</span>
        </div>
        <h2 className="text-2xl font-black text-[#332F3A] mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>Check your email!</h2>
        <p className="text-[#635F69] text-sm leading-relaxed font-medium mb-8">
          We sent a confirmation link to <strong className="text-[#332F3A]">{form.email}</strong>. Click it to activate your account.
        </p>
        <Link to="/login" className="btn-clay inline-flex">Go to Sign In →</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F1FA] flex items-center justify-center p-6 relative overflow-hidden">
      <ClayBlobs />

      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center shadow-clayButton animate-clay-breathe">
            <span className="text-white font-black text-xl" style={{ fontFamily: 'Nunito, sans-serif' }}>T</span>
          </div>
          <span className="font-black text-2xl text-[#332F3A]" style={{ fontFamily: 'Nunito, sans-serif' }}>TaskFlow</span>
        </div>

        <div className="card-clay p-8">
          <h1 className="text-2xl font-black text-[#332F3A] mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>Create your account 🚀</h1>
          <p className="text-[#635F69] text-sm font-medium mb-8">Free forever. No credit card required.</p>

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
                placeholder="At least 6 characters" value={form.password} onChange={set('password')} />
              {errors.password && <p className="text-red-500 text-xs mt-2 font-medium">{errors.password}</p>}
            </div>
            <div>
              <label className="label-clay">Confirm Password</label>
              <input type="password" className={`input-clay ${errors.confirm ? 'ring-4 ring-red-400/30 bg-red-50/50' : ''}`}
                placeholder="••••••••" value={form.confirm} onChange={set('confirm')} />
              {errors.confirm && <p className="text-red-500 text-xs mt-2 font-medium">{errors.confirm}</p>}
            </div>

            <button type="submit" className="btn-clay w-full h-14 text-base" disabled={loading}>
              {loading
                ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account…</>
                : 'Create Account →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#EFEBF5] text-center">
            <p className="text-sm text-[#635F69] font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-[#7C3AED] font-bold hover:text-[#6D28D9] transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
