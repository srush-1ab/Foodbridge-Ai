import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Users,
  Building2,
  CheckCircle2,
  Scale,
  Sparkles,
  MapPin,
  Heart,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useFoodBridge } from '../hooks/useFoodBridge';
import {
  GENERATE_30_DAYS_ANALYTICS,
  TOP_SURPLUS_ZONES,
} from '../data/initialData';
import { GoogleMapView } from '../components/common/GoogleMapView';

export const ImpactAnalyticsPage: React.FC = () => {
  const { setCurrentView } = useFoodBridge();
  const [timeRange, setTimeRange] = useState<'30d' | '14d' | '7d'>('30d');

  const fullData = GENERATE_30_DAYS_ANALYTICS();
  const displayData =
    timeRange === '7d'
      ? fullData.slice(-7)
      : timeRange === '14d'
      ? fullData.slice(-14)
      : fullData;

  const categoryDistribution = [
    { name: 'Cooked Meals', value: 14850, color: '#070e6a' },
    { name: 'Bakery & Bread', value: 6240, color: '#4855fe' },
    { name: 'Fresh Produce', value: 5120, color: '#22C55E' },
    { name: 'Packaged Meals', value: 3110, color: '#ff5a00' },
    { name: 'Dairy & Dessert', value: 2100, color: '#f5c400' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="fb-heading fb-heading-left text-3xl sm:text-4xl text-[#070e6a] dark:text-white">
            Impact
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-700">
            {(['7d', '14d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  timeRange === r
                    ? 'bg-[#070e6a] text-white dark:bg-[#ffe537] dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const csvContent =
                'data:text/csv;charset=utf-8,' +
                'Date,Day,Prepared,Consumed,Surplus,Rescued\n' +
                displayData
                  .map(
                    (d) =>
                      `${d.date},${d.day},${d.prepared},${d.consumed},${d.surplus},${d.rescued}`
                  )
                  .join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', `foodbridge_impact_${timeRange}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-3 py-1.5 rounded-full bg-[#4855fe] text-white font-bold text-xs hover:bg-[#ffe537] hover:text-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Top 6 Primary Impact KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Meals Rescued
          </p>
          <p className="text-2xl font-black text-[#070e6a] dark:text-[#ffe537] font-mono tabular-nums mt-1">
            31,420
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">+18% this month</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Food Saved
          </p>
          <p className="text-2xl font-black text-[#4855fe] font-mono tabular-nums mt-1 dark:text-[#9ea6ff]">
            12,850 kg
          </p>
          <span className="text-[10px] text-slate-400 font-medium">32.1 tons CO₂ eq</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Providers
          </p>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono tabular-nums mt-1">
            182
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Hostels & Hotels</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            NGOs Supported
          </p>
          <p className="text-2xl font-black text-[#e04e00] font-mono tabular-nums mt-1">
            64
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Shelters & Kitchens</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Successful Pickups
          </p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-1">
            94%
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">&lt;35 min avg</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            AI Accuracy
          </p>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono tabular-nums mt-1">
            91%
          </p>
          <span className="text-[10px] text-indigo-500 font-medium dark:text-[#9ea6ff]">Demand forecast</span>
        </div>
      </div>

      {/* 3. Primary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Food Rescued Over Time (Area Chart) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Surplus vs rescued ({timeRange.toUpperCase()})
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-600 font-bold">92% Net Salvage</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRescued" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4855fe" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4855fe" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSurplus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f5c400" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f5c400" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
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
                <Area
                  type="monotone"
                  dataKey="surplus"
                  name="Total Surplus Meals"
                  stroke="#f5c400"
                  fillOpacity={1}
                  fill="url(#colorSurplus)"
                />
                <Area
                  type="monotone"
                  dataKey="rescued"
                  name="Successfully Rescued"
                  stroke="#4855fe"
                  fillOpacity={1}
                  fill="url(#colorRescued)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Meals by Category (Pie Chart) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              By category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              31,420 meals rescued
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d1360',
                      borderColor: '#2a34b8',
                      color: '#fff',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            {categoryDistribution.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-slate-600 dark:text-slate-300">{c.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {c.value.toLocaleString()} meals
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Top Surplus Zones & Spatial Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Top Zones List */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Top zones
            </h3>
          </div>

          <div className="space-y-3">
            {TOP_SURPLUS_ZONES.map((zone, idx) => (
              <div
                key={zone.zoneId}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    #{idx + 1} {zone.name}
                  </span>
                  <span className="font-mono font-bold text-[#4855fe] dark:text-[#9ea6ff]">
                    {zone.rescueRatePercent}% rescued
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{zone.activeProviders} active dining facilities</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300">
                    {zone.totalSurplusMeals.toLocaleString()} meals
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-[#070e6a] to-[#4855fe]"
                    style={{ width: `${zone.rescueRatePercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* City Network Map */}
        <div className="lg:col-span-7">
          <GoogleMapView heightClass="h-96 md:h-[450px]" />
        </div>
      </div>

      {/* 5. Impact Storytelling Section */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#070e6a] via-[#0a1180] to-[#070c47] text-white shadow-xl space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4855fe] dark:text-[#9ea6ff]">
            Human Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Every rescued meal tells a story.
          </h2>
        </div>

        {/* Narrative Chain Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
          <div className="p-3">
            <p className="text-3xl font-black font-mono text-teal-300">92 Meals</p>
            <p className="text-xs font-semibold text-slate-200 mt-1">Rescued from banquet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">ABC Convention Center</p>
          </div>

          <div className="p-3 border-y md:border-y-0 md:border-x border-white/10">
            <p className="text-3xl font-black font-mono text-indigo-300">3 Centers</p>
            <p className="text-xs font-semibold text-slate-200 mt-1">Community kitchens served</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Hope, Roshni & Jan Seva</p>
          </div>

          <div className="p-3">
            <p className="text-3xl font-black font-mono text-emerald-400">92 People</p>
            <p className="text-xs font-semibold text-slate-200 mt-1">Warm dinner delivered</p>
            <p className="text-[11px] text-slate-400 mt-0.5">In under 45 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
};
