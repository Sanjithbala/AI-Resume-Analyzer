import { useEffect, useState } from 'react';
import { Award, Star, Zap, ChevronUp, Sparkles } from 'lucide-react';
import type { ReputationResult } from '../utils/types';

interface Props {
  data: ReputationResult;
}

const levelConfig = {
  beginner: {
    label: 'Beginner',
    gradient: 'from-gray-500 to-slate-600',
    ring: 'ring-gray-500/30',
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
    border: 'border-gray-500/20',
  },
  professional: {
    label: 'Professional',
    gradient: 'from-blue-500 to-indigo-600',
    ring: 'ring-blue-500/30',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  expert: {
    label: 'Expert',
    gradient: 'from-purple-500 to-pink-600',
    ring: 'ring-purple-500/30',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  elite: {
    label: 'Elite',
    gradient: 'from-amber-400 to-yellow-600',
    ring: 'ring-amber-400/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
  },
};

const breakdownMeta = [
  { key: 'skills' as const, label: 'Skills', max: 40, color: 'bg-cyan-500', icon: Zap },
  { key: 'projects' as const, label: 'Projects', max: 25, color: 'bg-purple-500', icon: Star },
  { key: 'certifications' as const, label: 'Certifications', max: 20, color: 'bg-amber-500', icon: Award },
  { key: 'experience' as const, label: 'Experience', max: 15, color: 'bg-pink-500', icon: Sparkles },
];

export default function ReputationScore({ data }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const lc = levelConfig[data.level];

  useEffect(() => {
    let current = 0;
    const step = data.score / 80;
    const interval = setInterval(() => {
      current += step;
      if (current >= data.score) {
        current = data.score;
        clearInterval(interval);
      }
      setAnimatedScore(Math.round(current));
    }, 16);
    return () => clearInterval(interval);
  }, [data.score]);

  const circumference = 2 * Math.PI * 80;
  const progress = (animatedScore / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Score Hero */}
      <div className={`rounded-2xl ${lc.bg} border ${lc.border} p-8`}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Circular Score */}
          <div className="relative flex-shrink-0">
            <svg width="190" height="190" className="-rotate-90">
              <circle cx="95" cy="95" r="80" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle
                cx="95"
                cy="95"
                r="80"
                fill="none"
                stroke="url(#repGradient)"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.05s linear' }}
              />
              <defs>
                <linearGradient id="repGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={data.level === 'elite' ? '#f59e0b' : data.level === 'expert' ? '#a855f7' : data.level === 'professional' ? '#3b82f6' : '#6b7280'} />
                  <stop offset="100%" stopColor={data.level === 'elite' ? '#eab308' : data.level === 'expert' ? '#ec4899' : data.level === 'professional' ? '#6366f1' : '#94a3b8'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-black text-white">{animatedScore}</span>
              <span className="text-xs text-gray-500">/100</span>
            </div>
          </div>

          {/* Level Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${lc.gradient} shadow-lg`}>
                <span className="text-sm font-bold text-white">{lc.label}</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Reputation Score</h3>
            <p className="text-sm text-gray-400">
              Your professional reputation based on skills, projects, and certifications
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {data.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${lc.bg} ${lc.text} border ${lc.border}`}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next Level Progress */}
      {data.level !== 'elite' && (
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <ChevronUp className="w-4 h-4 text-cyan-400" />
              Next Level: <strong className="text-white">{data.nextLevel}</strong>
            </span>
            <span className="text-xs text-gray-500">{data.score} / {data.nextLevelAt}</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${lc.gradient} rounded-full transition-all duration-1000`}
              style={{ width: `${data.progressToNext}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {data.nextLevelAt - data.score} points to reach {data.nextLevel} level
          </p>
        </div>
      )}

      {/* Breakdown */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <h4 className="text-sm font-semibold text-gray-400 mb-4">Score Breakdown</h4>
        <div className="space-y-4">
          {breakdownMeta.map((item) => {
            const Icon = item.icon;
            const val = data.breakdown[item.key];
            const pct = (val / item.max) * 100;
            return (
              <div key={item.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-500" />
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {val}<span className="text-gray-600">/{item.max}</span>
                  </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Tiers */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
        <h4 className="text-sm font-semibold text-gray-400 mb-3">Level Tiers</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.entries(levelConfig) as [ReputationResult['level'], typeof levelConfig.beginner][]).map(([key, config]) => (
            <div
              key={key}
              className={`p-3 rounded-xl text-center border transition-all ${
                data.level === key
                  ? `${config.bg} ${config.border} scale-[1.02]`
                  : 'bg-white/[0.02] border-white/5 opacity-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${config.gradient} flex items-center justify-center mx-auto mb-2`}>
                <Star className="w-4 h-4 text-white" />
              </div>
              <p className={`text-xs font-semibold ${data.level === key ? config.text : 'text-gray-500'}`}>
                {config.label}
              </p>
              <p className="text-[10px] text-gray-600 mt-0.5">
                {key === 'beginner' ? '0-39' : key === 'professional' ? '40-64' : key === 'expert' ? '65-84' : '85+'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
