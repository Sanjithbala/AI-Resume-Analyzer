import { useState } from 'react';
import {
  Rocket,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  XCircle,
  Zap,
} from 'lucide-react';
import { SIMULATION_ROLES, type SimulationRole } from '../utils/types';
import type { SimulationResult } from '../utils/types';
import { computeCareerSimulation } from '../utils/careerEngine';

interface Props {
  resumeText: string;
}

const trendConfig = {
  rising: { icon: TrendingUp, text: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Rising ↑' },
  stable: { icon: Minus, text: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Stable →' },
  declining: { icon: TrendingDown, text: 'text-red-400', bg: 'bg-red-500/10', label: 'Declining ↓' },
};

const difficultyConfig = {
  easy: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  moderate: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  challenging: { bg: 'bg-red-500/15', text: 'text-red-300', border: 'border-red-500/30' },
};

export default function CareerSimulation({ resumeText }: Props) {
  const [selectedRole, setSelectedRole] = useState<SimulationRole>(SIMULATION_ROLES[0]);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = () => {
    const sim = computeCareerSimulation(resumeText, selectedRole);
    setResult(sim);
  };

  return (
    <div className="space-y-6">
      {/* Role Selector */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <Rocket className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Career Path Simulator</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Select a target role to simulate your career transition
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as SimulationRole)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 transition-colors appearance-none cursor-pointer"
          >
            {SIMULATION_ROLES.map((role) => (
              <option key={role} value={role} className="bg-gray-900">
                {role}
              </option>
            ))}
          </select>
          <button
            onClick={handleSimulate}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2 justify-center"
          >
            <Zap className="w-4 h-4" />
            Simulate
          </button>
        </div>
      </div>

      {/* Simulation Results */}
      {result && (
        <>
          {/* Key Metrics */}
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Learning Time */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Learning Time</span>
              </div>
              <p className="text-3xl font-black text-white">
                {result.learningTimeMonths}
                <span className="text-lg text-gray-500 font-normal ml-1">mo</span>
              </p>
              <div className={`mt-2 inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border font-medium ${difficultyConfig[result.difficulty].bg} ${difficultyConfig[result.difficulty].text} ${difficultyConfig[result.difficulty].border}`}>
                {result.difficulty}
              </div>
            </div>

            {/* Salary */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Salary Range</span>
              </div>
              <p className="text-2xl font-black text-white">
                ${(result.salaryRange.median / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ${(result.salaryRange.min / 1000).toFixed(0)}K – ${(result.salaryRange.max / 1000).toFixed(0)}K
              </p>
              <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                  style={{ width: `${(result.salaryRange.median / 250000) * 100}%` }}
                />
              </div>
            </div>

            {/* Demand */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Demand Trend</span>
              </div>
              <p className="text-3xl font-black text-white">
                {result.demandScore.toFixed(1)}
                <span className="text-lg text-gray-500 font-normal">/10</span>
              </p>
              {(() => {
                const tc = trendConfig[result.demandTrend];
                const TrendIcon = tc.icon;
                return (
                  <div className={`mt-2 inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full ${tc.bg} ${tc.text}`}>
                    <TrendIcon className="w-3 h-3" />
                    {tc.label}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Skill Match */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white">Skill Match</h4>
              <span className={`text-sm font-bold ${
                result.matchPercent >= 60 ? 'text-emerald-400' : result.matchPercent >= 30 ? 'text-amber-400' : 'text-red-400'
              }`}>{result.matchPercent}%</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  result.matchPercent >= 60
                    ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                    : result.matchPercent >= 30
                    ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                    : 'bg-gradient-to-r from-red-500 to-rose-400'
                }`}
                style={{ width: `${result.matchPercent}%` }}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Matched Skills */}
              <div>
                <p className="text-xs text-gray-400 font-medium mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Skills You Have ({result.matchedSkills.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                  {result.matchedSkills.length === 0 && (
                    <span className="text-xs text-gray-600">No matching skills found</span>
                  )}
                </div>
              </div>

              {/* Gap Skills */}
              <div>
                <p className="text-xs text-gray-400 font-medium mb-2 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                  Skills to Learn ({result.gapSkills.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.gapSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-[11px] bg-red-500/15 text-red-300 border border-red-500/20"
                    >
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
