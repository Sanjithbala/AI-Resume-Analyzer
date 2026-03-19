import { useState, useMemo } from 'react';
import {
  Shield,
  AlertTriangle,
  Rocket,
  Scale,
  Award,
  User,
  ArrowLeft,
  Bell,
  Menu,
  X,
  FileText,
} from 'lucide-react';
import type { AnalysisResult } from '../utils/analyzer';
import type { DashboardTab } from '../utils/types';
import {
  computeCareerShield,
  computeRiskAnalysis,
  computeDecisionEngine as _cde,
  computeReputationScore,
  computeDigitalTwin,
} from '../utils/careerEngine';
import CareerShield from './CareerShield';
import RiskAnalyzer from './RiskAnalyzer';
import CareerSimulation from './CareerSimulation';
import DecisionEngine from './DecisionEngine';
import ReputationScore from './ReputationScore';
import DigitalTwin from './DigitalTwin';
import NotificationToast from './NotificationToast';

interface Props {
  result: AnalysisResult;
  resumeText: string;
  fileName: string;
  onReset: () => void;
}

const tabs: { id: DashboardTab; label: string; icon: typeof Shield; color: string }[] = [
  { id: 'shield', label: 'Career Shield', icon: Shield, color: 'text-cyan-400' },
  { id: 'risk', label: 'Risk Analyzer', icon: AlertTriangle, color: 'text-amber-400' },
  { id: 'simulation', label: 'Simulation', icon: Rocket, color: 'text-purple-400' },
  { id: 'decision', label: 'Decision Engine', icon: Scale, color: 'text-indigo-400' },
  { id: 'reputation', label: 'Reputation', icon: Award, color: 'text-pink-400' },
  { id: 'twin', label: 'Digital Twin', icon: User, color: 'text-teal-400' },
];

export default function Dashboard({ result, resumeText, fileName, onReset }: Props) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('shield');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);

  // Compute all module data
  const shieldData = useMemo(() => computeCareerShield(resumeText, result.overallScore), [resumeText, result.overallScore]);
  const riskData = useMemo(() => computeRiskAnalysis(resumeText), [resumeText]);
  const reputationData = useMemo(() => computeReputationScore(resumeText), [resumeText]);
  const twinData = useMemo(() => computeDigitalTwin(resumeText), [resumeText]);

  const scoreColor = result.overallScore >= 7
    ? 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
    : result.overallScore >= 4
    ? 'text-amber-400 bg-amber-500/20 border-amber-500/30'
    : 'text-red-400 bg-red-500/20 border-red-500/30';

  const renderContent = () => {
    switch (activeTab) {
      case 'shield':
        return <CareerShield data={shieldData} />;
      case 'risk':
        return <RiskAnalyzer data={riskData} />;
      case 'simulation':
        return <CareerSimulation resumeText={resumeText} />;
      case 'decision':
        return <DecisionEngine resumeText={resumeText} />;
      case 'reputation':
        return <ReputationScore data={reputationData} />;
      case 'twin':
        return <DigitalTwin data={twinData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white">
      {/* Notification Toasts */}
      {showNotifications && (
        <NotificationToast alerts={shieldData.alerts.slice(0, 3)} />
      )}

      {/* Top Bar */}
      <header className="border-b border-white/5 backdrop-blur-xl bg-gray-950/70 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">New Analysis</span>
            </button>
            <div className="h-5 w-px bg-white/10 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <div className="p-1 rounded bg-gradient-to-r from-cyan-500 to-blue-600">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold">
                Path4Career <span className="text-cyan-400">AI Career Shield™</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* File Badge */}
            {fileName && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                <FileText className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-400">{fileName}</span>
              </div>
            )}

            {/* Score Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${scoreColor}`}>
              <Shield className="w-3 h-3" />
              {result.overallScore.toFixed(1)}/10
            </div>

            {/* Notification Toggle */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                showNotifications ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-400'
              }`}
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar — Desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0 border-r border-white/5 min-h-[calc(100vh-57px)] sticky top-[57px] bg-gray-950/50 backdrop-blur-xl">
          <nav className="p-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/[0.06] text-white border border-white/10'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? tab.color : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="absolute left-0 top-[57px] w-64 h-full bg-gray-950 border-r border-white/5 p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white/[0.06] text-white border border-white/10'
                          : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] border border-transparent'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? tab.color : ''}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">
          {/* Mobile Tab Bar */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide -mx-4 px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                    isActive
                      ? 'bg-white/[0.08] text-white border border-white/10'
                      : 'bg-white/[0.03] text-gray-500 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? tab.color : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Module Content */}
          {renderContent()}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-600">
              Results are based on heuristic analysis. For comprehensive evaluation, consult career experts.
            </p>
            <button
              onClick={() => window.print()}
              className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              Download Report
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
