import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import ClayBlobs from './ClayBlobs.jsx';
import toast from 'react-hot-toast';

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('tf_dark');
    return saved ? saved === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('tf_dark', dark);
  }, [dark]);

  return [dark, setDark];
}

const NAV = [
  {
    to: '/tasks', label: 'All Tasks',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  },
  {
    to: '/today', label: 'Today',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  },
  {
    to: '/completed', label: 'Completed',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
];

const BOTTOM_NAV = [
  {
    to: '/account', label: 'Account',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
  {
    to: '/settings', label: 'Settings',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
];

function NavItem({ to, label, icon, onClick }) {
  return (
    <NavLink to={to} onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-[20px] text-sm font-bold transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton -translate-y-0.5'
            : 'text-[#635F69] hover:bg-white/70 hover:text-[#332F3A] hover:shadow-clayCard hover:-translate-y-0.5'
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

export default function Layout({ children }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useDarkMode();

  async function handleSignOut() {
    await signOut();
    toast.success('Signed out — see you soon! 👋');
    navigate('/login');
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? '??';

  const sidebar = (
    <div className="flex flex-col h-full p-4 gap-2">
      {/* Logo */}
      <div className="px-2 py-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center shadow-clayButton animate-clay-breathe">
            <span className="text-white font-black text-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>T</span>
          </div>
          <span className="font-black text-xl text-[#332F3A]" style={{ fontFamily: 'Nunito, sans-serif' }}>TaskFlow</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="flex-1 space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#9995A0] px-4 mb-3">Workspace</p>
        {NAV.map(item => <NavItem key={item.to} {...item} onClick={() => setMobileOpen(false)} />)}

        <p className="text-[10px] font-black uppercase tracking-widest text-[#9995A0] px-4 mt-6 mb-3 pt-4">Account</p>
        {BOTTOM_NAV.map(item => <NavItem key={item.to} {...item} onClick={() => setMobileOpen(false)} />)}
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={() => setDark(d => !d)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-[20px] text-sm font-bold transition-all duration-300 text-[#635F69] hover:bg-white/70 hover:text-[#332F3A] dark:text-[#9B95A8] dark:hover:bg-white/10 dark:hover:text-[#EDE9F7] w-full"
      >
        {dark
          ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        }
        {dark ? 'Light Mode' : 'Dark Mode'}
      </button>

      {/* User footer */}
      <div className="card-clay p-3 mt-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[14px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-clayButton">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#332F3A] truncate">{user?.email}</p>
            <p className="text-[10px] text-[#635F69] font-medium">Free plan</p>
          </div>
          <button onClick={handleSignOut} title="Sign out"
            className="w-8 h-8 flex items-center justify-center rounded-[12px] text-[#635F69] hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 transition-all duration-200 flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F1FA]">
      <ClayBlobs />

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 shadow-claySidebar bg-white/60 backdrop-blur-xl relative z-10">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-[#332F3A]/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white/90 backdrop-blur-xl flex flex-col z-10">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm">
          <button onClick={() => setMobileOpen(true)} className="btn-clay-ghost px-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-black text-lg text-[#332F3A]" style={{ fontFamily: 'Nunito, sans-serif' }}>TaskFlow</span>
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
