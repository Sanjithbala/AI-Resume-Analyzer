import { useState, useEffect } from 'react';
import { X, AlertTriangle, ShieldAlert, Info, CheckCircle2 } from 'lucide-react';
import type { CareerShieldAlert } from '../utils/types';

interface Props {
  alerts: CareerShieldAlert[];
}

const iconMap = {
  warning: AlertTriangle,
  danger: ShieldAlert,
  info: Info,
  success: CheckCircle2,
};

const colorMap = {
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: 'text-amber-400',
    bar: 'bg-amber-400',
  },
  danger: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: 'text-red-400',
    bar: 'bg-red-400',
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    bar: 'bg-blue-400',
  },
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: 'text-emerald-400',
    bar: 'bg-emerald-400',
  },
};

export default function NotificationToast({ alerts }: Props) {
  const [visible, setVisible] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    alerts.forEach((alert, idx) => {
      const timer = setTimeout(() => {
        setVisible((prev) => [...prev, alert.id]);
      }, idx * 600);
      timers.push(timer);
    });
    return () => timers.forEach(clearTimeout);
  }, [alerts]);

  const dismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const visibleAlerts = alerts.filter(
    (a) => visible.includes(a.id) && !dismissed.has(a.id)
  );

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {visibleAlerts.map((alert) => {
        const Icon = iconMap[alert.type];
        const colors = colorMap[alert.type];

        return (
          <div
            key={alert.id}
            className={`${colors.bg} border ${colors.border} rounded-2xl p-4 pointer-events-auto backdrop-blur-xl shadow-2xl animate-slide-in`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-1.5 rounded-lg ${colors.bg}`}>
                <Icon className={`w-4 h-4 ${colors.icon}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white truncate">{alert.title}</p>
                  <button
                    onClick={() => dismiss(alert.id)}
                    className="text-gray-500 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{alert.message}</p>
                <p className="text-[10px] text-gray-600 mt-2">{alert.timestamp}</p>
              </div>
            </div>
            <div className={`h-0.5 ${colors.bar} rounded-full mt-3 opacity-30`} />
          </div>
        );
      })}
    </div>
  );
}
