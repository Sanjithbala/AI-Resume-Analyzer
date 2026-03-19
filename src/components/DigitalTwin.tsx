import { User, TrendingUp, Sparkles, Compass, BarChart3, Target, ArrowUpRight } from 'lucide-react';
import type { DigitalTwinProfile } from '../utils/types';

interface Props {
  data: DigitalTwinProfile;
}

const trendConfig = {
  rising: { text: 'text-emerald-400', bg: 'bg-emerald-500', label: '↑' },
  stable: { text: 'text-amber-400', bg: 'bg-amber-500', label: '→' },
  declining: { text: 'text-red-400', bg: 'bg-red-500', label: '↓' },
};

export default function DigitalTwin({ data }: Props) {
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs text-teal-400 font-medium uppercase tracking-wider mb-1">Career Digital Twin</p>
            <h2 className="text-xl font-bold text-white mb-1">{data.currentRole}</h2>
            <p className="text-sm text-gray-400">
              {data.experienceYears}+ years experience • Market alignment: <strong className="text-white">{data.marketAlignment}%</strong>
            </p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-3xl font-black text-teal-400">{data.marketAlignment}%</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Market Fit</div>
          </div>
        </div>

        {/* Top Strengths */}
        <div className="mt-5 pt-5 border-t border-white/5">
          <p className="text-xs text-gray-500 font-medium mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Top Strengths
          </p>
          <div className="flex flex-wrap gap-2">
            {data.topStrengths.map((s, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs bg-teal-500/10 text-teal-300 border border-teal-500/20">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Growth */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-teal-500/20">
            <BarChart3 className="w-5 h-5 text-teal-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Skill Growth Tracker</h3>
        </div>
        <div className="space-y-4">
          {data.skillGrowth.map((skill, idx) => {
            const tc = trendConfig[skill.trend];
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-300 flex items-center gap-2">
                    {skill.name}
                    <span className={`text-[10px] ${tc.text}`}>{tc.label}</span>
                  </span>
                  <span className="text-xs text-gray-500">
                    {skill.current}% → <span className={tc.text}>{skill.projected}%</span>
                  </span>
                </div>
                <div className="relative h-2.5 bg-white/5 rounded-full overflow-hidden">
                  {/* Current level */}
                  <div
                    className="absolute h-full bg-teal-500 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.current}%` }}
                  />
                  {/* Projected level */}
                  <div
                    className="absolute h-full bg-teal-500/30 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.projected}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 bg-teal-500 rounded-full" />
            <span className="text-[10px] text-gray-500">Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 bg-teal-500/30 rounded-full" />
            <span className="text-[10px] text-gray-500">Projected (12 months)</span>
          </div>
        </div>
      </div>

      {/* Career Trajectory */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-indigo-500/20">
            <Compass className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Career Trajectory</h3>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed mb-5">{data.careerTrajectory}</p>

        {/* Predicted Roles */}
        <div className="space-y-3">
          {data.predictedRoles.map((pred, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all">
                <Target className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{pred.role}</p>
                <p className="text-xs text-gray-500">{pred.timeframe}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-bold ${
                    pred.probability >= 70 ? 'text-emerald-400' : pred.probability >= 45 ? 'text-amber-400' : 'text-gray-400'
                  }`}>
                    {pred.probability}%
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-gray-600" />
                </div>
                <p className="text-[10px] text-gray-600">probability</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Future Opportunities */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-emerald-500/20">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Future Opportunities</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {data.futureOpportunities.map((opp, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-all"
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-gray-300">{opp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
