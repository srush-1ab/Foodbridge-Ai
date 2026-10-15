import React, { useState } from 'react';
import { Sliders, AlertTriangle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { simulateWhatIf } from '../../services/aiService';
import { useFoodBridge } from '../../hooks/useFoodBridge';

interface WhatIfSimulatorProps {
  initialPrepared?: number;
  expectedAttendance?: number;
  historicalAvg?: number;
  onApplySimulation?: (prepared: number, surplus: number) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  initialPrepared = 500,
  expectedAttendance = 450,
  historicalAvg = 420,
  onApplySimulation,
}) => {
  const { setCurrentView } = useFoodBridge();
  const [sliderValue, setSliderValue] = useState<number>(initialPrepared);

  const simulation = simulateWhatIf(sliderValue, expectedAttendance, historicalAvg);

  const riskBadgeColors = {
    LOW: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    MEDIUM: 'text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    HIGH: 'text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#4855fe]/10 text-[#4855fe] dark:text-[#9ea6ff]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              Surplus simulator
            </h3>
          </div>
        </div>

        <span
          className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
            riskBadgeColors[simulation.riskLevel]
          }`}
        >
          {simulation.riskLevel} WASTE RISK
        </span>
      </div>

      {/* Interactive Slider */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-baseline">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Meals Prepared:
          </label>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-[#070e6a] dark:text-[#ffe537] font-mono tabular-nums">
              {sliderValue}
            </span>
            <span className="text-xs text-slate-400 font-medium">portions</span>
          </div>
        </div>

        <input
          type="range"
          min={300}
          max={750}
          step={10}
          value={sliderValue}
          onChange={(e) => setSliderValue(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#4855fe]"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>300 (lean)</span>
          <span>450 (Recommended)</span>
          <span>500 (plan)</span>
          <span>750 (Over-catering)</span>
        </div>
      </div>

      {/* Real-time Dynamic Simulation Readouts */}
      <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 mb-4">
        <div>
          <span className="text-[10px] text-slate-400 font-medium block">
            Expected Intake
          </span>
          <span className="text-base font-bold text-slate-800 dark:text-slate-100 font-mono tabular-nums">
            {simulation.expectedConsumption}
          </span>
          <span className="text-[10px] text-slate-500 block">meals eaten</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-medium block">
            Predicted Surplus
          </span>
          <span
            className={`text-base font-bold font-mono tabular-nums ${
              simulation.predictedSurplus > 50
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {simulation.predictedSurplus}
          </span>
          <span className="text-[10px] text-slate-500 block">surplus meals</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-medium block">
            Avoidable loss
          </span>
          <span className="text-base font-bold text-slate-800 dark:text-slate-100 font-mono tabular-nums">
            {simulation.wasteKg} kg
          </span>
          <span className="text-[10px] text-slate-500 block">approx weight</span>
        </div>
      </div>

      {/* Simulator Micro-Insight */}
      <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
        {sliderValue > 460 ? (
          <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            Preparing {sliderValue} meals leads to {simulation.predictedSurplus} surplus meals.
            Reducing towards 450 meals brings surplus to ~29 meals.
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            Well calibrated.
          </span>
        )}
      </p>

      {/* Action to create surplus listing directly */}
      <button
        onClick={() => {
          if (onApplySimulation) {
            onApplySimulation(sliderValue, simulation.predictedSurplus);
          } else {
            setCurrentView('create-surplus');
          }
        }}
        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#4855fe] dark:text-[#9ea6ff]" />
        <span>Create Surplus Listing ({simulation.predictedSurplus} meals)</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </button>
    </div>
  );
};
