import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  ChevronRight,
  Sparkles,
  Bell,
} from 'lucide-react';
import type { CareerShieldResult } from '../utils/types';
import ScoreGauge from './ScoreGauge';

interface Props {
  data: CareerShieldResult;
}

const priorityConfig = {
  critical: { bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-300', label: 'CRITICAL' },
  high: { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-300', label: 'HIGH' },
  medium: { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-300', label: 'MEDIUM' },
};

const alertTypeConfig = {
  warning: { icon: AlertTriangle, bg: 'bg-amber-500/10', border: 'border-amber-500/20', iconColor: 'text-amber-400' },
  danger: { icon: ShieldAlert, bg: 'bg-red-500/10', border: 'border-red-500/20', iconColor: 'text-red-400' },
  info: { icon: Bell, bg: 'bg-blue-500/10', border: 'border-blue-500/20', iconColor: 'text-blue-400' },
  success: { icon: ShieldCheck, bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', iconColor: 'text-emerald-400' },
};

export default function CareerShield({ data }: Props) {
  const { safetyScore, alerts, protectionPlan, riskSummary } = data;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-600/5" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <ScoreGauge score={safetyScore} label="Career Safety Score" size="lg" delay={200} />
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">AI Career Shield™</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">{riskSummary}</p>
          </div>
        </div>
      </div>

      {/* Alert Feed — Telegram Style */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-amber-500/20">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Risk Alerts</h3>
          <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300">
            {alerts.length}
          </span>
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const config = alertTypeConfig[alert.type];
            const Icon = config.icon;
            return (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-4 rounded-xl ${config.bg} border ${config.border} transition-all hover:scale-[1.01]`}
              >
                <div className="p-1.5 rounded-lg bg-white/5 flex-shrink-0">
                  <Icon className={`w-4 h-4 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{alert.title}</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{alert.message}</p>
                </div>
                <span className="text-[10px] text-gray-600 flex-shrink-0">{alert.timestamp}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Protection Plan */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-cyan-500/20">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Skill Protection Plan</h3>
        </div>

        {/* Urgent Skills */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {protectionPlan.urgentSkills.map((skill, idx) => {
            const pc = priorityConfig[skill.priority];
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl ${pc.bg} border ${pc.border} hover:scale-[1.01] transition-all`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <ChevronRight className={`w-3.5 h-3.5 ${pc.text}`} />
                  <span className="text-sm font-medium text-white">{skill.name}</span>
                  <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold ${pc.bg} ${pc.text} border ${pc.border}`}>
                    {pc.label}
                  </span>
                </div>
                <p className="text-xs text-gray-400 ml-5.5">{skill.reason}</p>
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        {protectionPlan.timeline.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Learning Timeline
            </h4>
            {protectionPlan.timeline.map((phase, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />
                  {idx < protectionPlan.timeline.length - 1 && (
                    <div className="w-0.5 h-full min-h-8 bg-white/10" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-white">{phase.phase}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {phase.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full text-[11px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {protectionPlan.estimatedTimeMonths > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-400">
              Estimated total: <strong className="text-white">{protectionPlan.estimatedTimeMonths} months</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
