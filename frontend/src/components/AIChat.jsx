import { useState, useRef, useEffect } from 'react';
import api from '../lib/api.js';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function AIChat({ onClose, onRefresh }) {
  const { t } = useLanguage();

  const [messages, setMessages] = useState([
    { role: 'ai', text: t.aiChatWelcome, time: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages(m => [...m, { role: 'user', text, time: new Date() }]);
    setLoading(true);

    try {
      const { data } = await api.post('/api/ai/chat', { message: text });

      let actionLabel = null;
      let actionError = null;

      try {
        if (data.action === 'create' && data.payload?.title) {
          await api.post('/api/tasks', data.payload);
          actionLabel = '✓ Task created';
          onRefresh();
        } else if (data.action === 'update' && data.payload?.id) {
          await api.put(`/api/tasks/${data.payload.id}`, data.payload.changes);
          actionLabel = '✓ Task updated';
          onRefresh();
        } else if (data.action === 'delete' && data.payload?.id) {
          await api.delete(`/api/tasks/${data.payload.id}`);
          actionLabel = '✓ Task deleted';
          onRefresh();
        } else if (data.action === 'prioritize') {
          actionLabel = '✓ Tasks prioritized';
          onRefresh();
        }
      } catch (actionErr) {
        actionError = actionErr.response?.data?.errors?.[0]?.msg || actionErr.response?.data?.error || 'Action failed';
        console.error('AI action error:', actionErr.response?.data || actionErr.message);
      }

      setMessages(m => [...m, {
        role: 'ai',
        text: actionError ? `${data.reply || 'Done!'}\n\n⚠️ But the action failed: ${actionError}` : (data.reply || 'Done!'),
        actionLabel,
        time: new Date(),
      }]);
    } catch {
      setMessages(m => [...m, {
        role: 'ai',
        text: 'Sorry, I had trouble with that. Please try again.',
        time: new Date(),
      }]);
      toast.error('AI chat failed');
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:justify-end md:pe-6 bg-[#332F3A]/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white/90 backdrop-blur-xl w-full md:w-96 rounded-t-[32px] md:rounded-[32px] shadow-clayDeep flex flex-col"
        style={{ height: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/60 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[14px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center shadow-clayButton animate-clay-breathe">
              <span className="text-base">✨</span>
            </div>
            <h2 className="text-base font-black text-[#332F3A]" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {t.aiChatTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-[14px] text-[#635F69] hover:bg-[#EFEBF5] transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] rounded-[20px] px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white rounded-ee-[4px]'
                  : 'bg-white/80 shadow-clayCard text-[#332F3A] rounded-es-[4px]'
              }`}>
                <p className="text-sm font-medium leading-relaxed whitespace-pre-line">{msg.text}</p>
                {msg.actionLabel && (
                  <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black">
                    {msg.actionLabel}
                  </span>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/80 shadow-clayCard rounded-[20px] rounded-es-[4px] px-4 py-3">
                <div className="flex gap-1.5 items-center h-5">
                  {[0, 150, 300].map(delay => (
                    <div key={delay} className="w-2 h-2 rounded-full bg-[#7C3AED] animate-bounce"
                      style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-white/60">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              className="input-clay flex-1 h-11"
              placeholder={t.aiChatPlaceholder}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="btn-clay h-11 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
