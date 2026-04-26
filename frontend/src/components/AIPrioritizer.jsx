import { useState } from 'react';
import api from '../lib/api.js';
import toast from 'react-hot-toast';

export default function AIPrioritizer({ onResult, onClose }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function run() {
    setLoading(true);
    try {
      const { data } = await api.post('/api/ai/prioritize');
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'AI analysis failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function apply() {
    onResult(result.ordered_tasks);
    onClose();
    toast.success('✨ Tasks reordered by AI!');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#332F3A]/40 backdrop-blur-sm"
      onClick={onClose}>
      <div className="relative bg-white/80 backdrop-blur-xl w-full sm:max-w-lg sm:rounded-[32px] rounded-t-[32px] shadow-clayDeep max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between px-7 py-5 border-b border-white/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center shadow-clayButton">
              <span className="text-xl">✨</span>
            </div>
            <h2 className="text-lg font-black text-[#332F3A]" style={{ fontFamily: 'Nunito, sans-serif' }}>AI Prioritizer</h2>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-[14px] text-[#635F69] hover:bg-[#EFEBF5] transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-7 py-6">
          {!result ? (
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center mx-auto mb-5 shadow-clayCard animate-clay-breathe">
                <span className="text-4xl">🤖</span>
              </div>
              <p className="text-[#332F3A] font-bold text-lg mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>Smart Task Analysis</p>
              <p className="text-[#635F69] text-sm leading-relaxed mb-7 max-w-xs mx-auto font-medium">
                AI will analyze your active tasks and suggest the optimal order — considering deadlines, priorities, and workload.
              </p>
              <button className="btn-clay" onClick={run} disabled={loading}>
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Analyzing…</>
                  : '✨ Analyze My Tasks'}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="card-clay p-4 bg-gradient-to-br from-violet-50 to-purple-50">
                <p className="text-xs font-black uppercase tracking-widest text-[#7C3AED] mb-2">Strategy</p>
                <p className="text-sm text-[#332F3A] leading-relaxed font-medium">{result.summary}</p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#635F69] mb-3">Suggested Order</p>
                <div className="space-y-2">
                  {result.ordered_tasks.map((task, i) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-[20px] bg-white/60 shadow-clayCard">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-clayButton">
                        {i + 1}
                      </div>
                      <span className="text-sm font-bold text-[#332F3A] truncate">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {result.tips?.length > 0 && (
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#635F69] mb-3">Tips</p>
                  <div className="space-y-2">
                    {result.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-[20px] bg-white/60">
                        <span className="text-[#7C3AED] mt-0.5 flex-shrink-0 font-black">•</span>
                        <p className="text-sm text-[#635F69] font-medium leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button className="btn-clay-secondary flex-1" onClick={onClose}>Dismiss</button>
                <button className="btn-clay flex-1" onClick={apply}>Apply Order</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
