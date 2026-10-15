import React from 'react';
import {
  Sparkles,
  TrendingDown,
  ArrowRight,
  PlusCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Package,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useFoodBridge } from '../hooks/useFoodBridge';
import { FoodListingCard } from '../components/dashboard/FoodListingCard';
import { GENERATE_30_DAYS_ANALYTICS } from '../data/initialData';

export const ProviderDashboard: React.FC = () => {
  const { currentUser, listings, setCurrentView, addToast } = useFoodBridge();

  const weeklyData = GENERATE_30_DAYS_ANALYTICS().slice(-7);

  const providerListings = listings.filter((l) => l.providerName.includes('ABC') || l.providerId === currentUser.id);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="fb-heading fb-heading-left text-3xl sm:text-4xl text-[#070e6a] dark:text-white">
            Good evening, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {currentUser.organization}
          </p>
        </div>

        <button
          onClick={() => setCurrentView('create-surplus')}
          className="flex items-center gap-2 py-2.5 px-4 rounded-full bg-[#4855fe] hover:bg-[#ffe537] hover:text-black text-white text-xs font-bold hover:brightness-105 shadow-sm transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish surplus</span>
        </button>
      </div>

      {/* 2. Top Metric Cards (5 Key Indicators) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Meals Prepared
          </p>
          <p className="text-2xl font-black text-[#070e6a] dark:text-white font-mono tabular-nums mt-1">
            520
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Tonight's dinner</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            Predicted Surplus
          </p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono tabular-nums mt-1">
            86
          </p>
          <span className="text-[10px] text-rose-500 font-medium">High potential</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-[#4855fe] dark:text-[#9ea6ff]">
            Meals Rescued
          </p>
          <p className="text-2xl font-black text-[#4855fe] font-mono tabular-nums mt-1 dark:text-[#9ea6ff]">
            74
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">To Hope Kitchen</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Waste Prevented
          </p>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono tabular-nums mt-1">
            18 kg
          </p>
          <span className="text-[10px] text-slate-400 font-medium">45 kg CO₂ saved</span>
        </div>

        <div className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            AI Accuracy
          </p>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono tabular-nums mt-1">
            91%
          </p>
          <span className="text-[10px] text-indigo-500 font-medium dark:text-[#9ea6ff]">14-day verified</span>
        </div>
      </div>

      {/* 3. Hero Cards: AI Surplus Forecast & AI Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main AI Forecast Card */}
        <div className="lg:col-span-7 rounded-2xl bg-gradient-to-br from-[#070e6a] to-[#0a1180] text-white p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-teal-400/20 text-[#4855fe] dark:text-[#9ea6ff]">
                  <Brain className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                  AI Surplus Forecast
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                High opportunity
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 py-3 border-y border-white/10 text-center">
              <div>
                <p className="text-[11px] text-slate-300 font-medium">Prepared</p>
                <p className="text-xl sm:text-2xl font-black font-mono tabular-nums text-white mt-0.5">
                  520
                </p>
                <p className="text-[10px] text-slate-400">meals</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-300 font-medium">Expected Intake</p>
                <p className="text-xl sm:text-2xl font-black font-mono tabular-nums text-teal-300 mt-0.5">
                  434
                </p>
                <p className="text-[10px] text-slate-400">meals eaten</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-300 font-medium">Predicted Surplus</p>
                <p className="text-xl sm:text-2xl font-black font-mono tabular-nums text-amber-300 mt-0.5">
                  86
                </p>
                <p className="text-[10px] text-slate-400">portions</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Demand is tapering. List surplus now so shelters can collect before 9:30 PM.
            </p>
          </div>

          <div className="pt-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-teal-300">
              <Sparkles className="w-4 h-4" />
              <span>91% confidence</span>
            </div>

            <button
              onClick={() => setCurrentView('create-surplus')}
              className="py-2.5 px-4 rounded-full bg-[#4855fe] hover:bg-[#ffe537] hover:text-black text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Create listing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* AI Recommendation Card */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Recommendation
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Tomorrow · Dinner</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              Cook ~8% less tomorrow
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Saturday attendance drops. Cook ~475 instead of 520 to avoid ~45 surplus meals and save ~$140.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Batch:</span>
                <strong className="text-slate-900 dark:text-white font-mono">475 meals</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waste cut:</span>
                <strong className="text-emerald-600 font-mono">~14.5 kg food</strong>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentView('ai-predictor')}
              className="w-full py-2.5 px-4 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Chart: Weekly Prepared vs Consumed vs Surplus */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Weekly balance
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Last 7 Days</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0d1360',
                  borderColor: '#2a34b8',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="prepared" name="Prepared Meals" fill="#aab1ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="consumed" name="Consumed" fill="#4855fe" radius={[4, 4, 0, 0]} />
              <Bar dataKey="surplus" name="Surplus" fill="#f5c400" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rescued" name="Rescued to NGOs" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Recent Activity & Active Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Active listings
            </h3>
          </div>

          <button
            onClick={() => setCurrentView('food-surplus')}
            className="text-xs font-semibold text-[#4855fe] hover:underline cursor-pointer dark:text-[#9ea6ff]"
          >
            View all {listings.length} listings →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {providerListings.slice(0, 3).map((item) => (
            <FoodListingCard
              key={item.id}
              listing={item}
              onFindReceiver={() => setCurrentView('ngos')}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
