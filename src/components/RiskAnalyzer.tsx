import { AlertTriangle, ShieldCheck, TrendingDown, Activity, Globe, Cpu } from 'lucide-react';
import type { RiskAnalysis, RiskDimension } from '../utils/types';

interface Props {
  data: RiskAnalysis;
}

const riskColors = {
  low: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    bar: 'bg-emerald-500',
    glow: 'shadow-emerald-500/20',
  },
  medium: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    pill: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    bar: 'bg-amber-500',
    glow: 'shadow-amber-500/20',
  },
  high: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    pill: 'bg-red-500/20 text-red-300 border-red-500/30',
    bar: 'bg-red-500',
    glow: 'shadow-red-500/20',
  },
};

const riskIcons = {
  automation: Cpu,
  industry: TrendingDown,
  redundancy: Activity,
  geographic: Globe,
};

function RiskCard({
  title,
  icon: IconKey,
  dimension,
}: {
  title: string;
  icon: keyof typeof riskIcons;
  dimension: RiskDimension;
}) {
  const colors = riskColors[dimension.level];
  const Icon = riskIcons[IconKey];
  const percentage = (dimension.score / 10) * 100;

  return (
    <div className={`rounded-2xl ${colors.bg} border ${colors.border} p-5 hover:scale-[1.02] transition-all`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${colors.bg}`}>
            <Icon className={`w-5 h-5 ${colors.text}`} />
          </div>
          <h4 className="text-sm font-semibold text-white">{title}</h4>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${colors.pill}`}>
          {dimension.level.toUpperCase()}
        </span>
      </div>

      {/* Score bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500">Risk Level</span>
          <span className={`text-sm font-bold ${colors.text}`}>{dimension.score}/10</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.bar} rounded-full transition-all duration-1000`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed mb-3">{dimension.description}</p>

      {/* Factors */}
      <div className="space-y-1.5">
        {dimension.factors.map((factor, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${colors.bar} mt-1.5 flex-shrink-0`} />
            <span className="text-xs text-gray-400">{factor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RiskAnalyzer({ data }: Props) {
  const overallColors = riskColors[data.overallRisk];

  return (
    <div className="space-y-6">
      {/* Overall Risk Header */}
      <div className={`rounded-2xl ${overallColors.bg} border ${overallColors.border} p-6 md:p-8`}>
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${
            data.overallRisk === 'low'
              ? 'from-emerald-500 to-green-600'
              : data.overallRisk === 'medium'
              ? 'from-amber-500 to-orange-600'
              : 'from-red-500 to-rose-600'
          } flex items-center justify-center shadow-lg ${overallColors.glow}`}>
            {data.overallRisk === 'low' ? (
              <ShieldCheck className="w-10 h-10 text-white" />
            ) : data.overallRisk === 'high' ? (
              <AlertTriangle className="w-10 h-10 text-white" />
            ) : (
              <Activity className="w-10 h-10 text-white" />
            )}
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
              <h2 className="text-xl font-bold text-white">Overall Career Risk</h2>
              <span className={`text-xs px-3 py-1 rounded-full font-bold border ${overallColors.pill}`}>
                {data.overallRisk.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Combined risk score: <strong className={overallColors.text}>{data.overallScore}/10</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Risk Dimension Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <RiskCard title="Automation Risk" icon="automation" dimension={data.automationRisk} />
        <RiskCard title="Industry Decline" icon="industry" dimension={data.industryDecline} />
        <RiskCard title="Skill Redundancy" icon="redundancy" dimension={data.skillRedundancy} />
        <RiskCard title="Geographic Risk" icon="geographic" dimension={data.geographicRisk} />
      </div>
    </div>
  );
}
