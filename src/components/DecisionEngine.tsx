import { useState } from 'react';
import { Scale, Crown, Plus, X, ChevronRight, Trophy, Minus } from 'lucide-react';
import { CAREER_OPTIONS_LIST } from '../utils/types';
import type { CareerComparison } from '../utils/types';
import { computeDecisionEngine } from '../utils/careerEngine';

interface Props {
  resumeText: string;
}

export default function DecisionEngine({ resumeText }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<CareerComparison | null>(null);

  const toggleOption = (opt: string) => {
    setSelected((prev) => {
      if (prev.includes(opt)) return prev.filter((o) => o !== opt);
      if (prev.length >= 3) return prev;
      return [...prev, opt];
    });
    setResult(null);
  };

  const handleCompare = () => {
    if (selected.length < 2) return;
    const comparison = computeDecisionEngine(resumeText, selected);
    setResult(comparison);
  };

  return (
    <div className="space-y-6">
      {/* Option Selector */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-indigo-500/20">
            <Scale className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Decision Engine</h3>
            <p className="text-xs text-gray-500">Select 2-3 career paths to compare</p>
          </div>
        </div>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selected.map((opt) => (
              <span
                key={opt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
              >
                {opt}
                <button onClick={() => toggleOption(opt)} className="cursor-pointer hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Option grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-5">
          {CAREER_OPTIONS_LIST.map((opt) => {
            const isSelected = selected.includes(opt);
            const isDisabled = !isSelected && selected.length >= 3;
            return (
              <button
                key={opt}
                onClick={() => !isDisabled && toggleOption(opt)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                    : isDisabled
                    ? 'bg-white/[0.02] border-white/5 text-gray-600 cursor-not-allowed'
                    : 'bg-white/[0.03] border-white/5 text-gray-400 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5 justify-center">
                  {isSelected ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  {opt}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleCompare}
          disabled={selected.length < 2}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            selected.length >= 2
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90'
              : 'bg-white/5 text-gray-600 cursor-not-allowed'
          }`}
        >
          <Scale className="w-4 h-4" />
          Compare ({selected.length}/3 selected)
        </button>
      </div>

      {/* Comparison Results */}
      {result && (
        <>
          {/* Best Choice Card */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-emerald-500/20">
                <Trophy className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-emerald-400/70 font-medium uppercase tracking-wider">AI Recommendation</p>
                <h4 className="text-lg font-bold text-white">{result.bestChoice}</h4>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-black text-emerald-400">{result.options[0].total}</p>
                <p className="text-xs text-gray-500">/10</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{result.reasoning}</p>
          </div>

          {/* Comparison Table */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Metric</th>
                    {result.options.map((opt) => (
                      <th key={opt.name} className="text-center text-xs text-gray-500 font-medium px-4 py-3">
                        <span className={opt.name === result.bestChoice ? 'text-emerald-400 font-semibold' : ''}>{opt.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(['salary', 'growth', 'stability', 'demand'] as const).map((metric) => (
                    <tr key={metric} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-5 py-3 text-sm text-gray-400 capitalize">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-gray-600" />
                          {metric === 'demand' ? 'Market Demand' : metric}
                        </div>
                      </td>
                      {result.options.map((opt) => {
                        const val = opt[metric];
                        const isMax = val === Math.max(...result.options.map((o) => o[metric]));
                        return (
                          <td key={opt.name} className="px-4 py-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`text-sm font-bold ${isMax ? 'text-emerald-400' : 'text-gray-400'}`}>
                                {val.toFixed(1)}
                              </span>
                              <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    isMax ? 'bg-emerald-500' : 'bg-gray-600'
                                  }`}
                                  style={{ width: `${(val / 10) * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr className="bg-white/[0.02]">
                    <td className="px-5 py-3 text-sm font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        Overall
                      </div>
                    </td>
                    {result.options.map((opt) => {
                      const isMax = opt.name === result.bestChoice;
                      return (
                        <td key={opt.name} className="px-4 py-3 text-center">
                          <span className={`text-lg font-black ${isMax ? 'text-emerald-400' : 'text-gray-400'}`}>
                            {opt.total.toFixed(1)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Verdict Details */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">Category Winners</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {result.verdictDetails.map((v, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">{v.category}</p>
                  <p className="text-sm font-semibold text-white mt-1">{v.winner}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
