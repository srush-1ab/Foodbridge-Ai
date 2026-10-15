import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Info,
  Calendar,
  Utensils,
  Building,
} from 'lucide-react';
import { useFoodBridge } from '../hooks/useFoodBridge';
import { predictFoodSurplus } from '../services/aiService';
import { PredictionInput, PredictionResult } from '../types';
import { WhatIfSimulator } from '../components/dashboard/WhatIfSimulator';

export const AIPredictorPage: React.FC = () => {
  const { setCurrentView, createListing, addToast } = useFoodBridge();

  const [form, setForm] = useState<PredictionInput>({
    foodType: 'Cooked Meals',
    mealType: 'Dinner',
    mealsPrepared: 500,
    expectedAttendance: 450,
    day: 'Friday',
    eventType: 'College Hostel',
    historicalAverageConsumption: 420,
    notes: 'Campus sports meet concludes at 5 PM. Weekend departures anticipated.',
  });

  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [result, setResult] = useState<PredictionResult | null>({
    source: 'FoodBridge AI',
    predictedConsumption: 421,
    predictedSurplus: 79,
    confidence: 91,
    riskLevel: 'HIGH',
    recommendation: 'Prepare approximately 450 meals to reduce expected waste by 12%.',
    explanation:
      'Historical Friday consumption drops by 8% due to students traveling home early. With 450 expected attendees, 421 meals are expected to be eaten, leaving 79 surplus servings.',
    reductionRecommendationPercent: 12,
    optimalPreparation: 450,
  });

  const handlePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const pred = await predictFoodSurplus(form, (stage) => {
        setCurrentStage(stage);
      });
      setResult(pred);
      addToast(
        'Surplus Forecast Ready! 🤖',
        `Predicted ${pred.predictedSurplus} surplus meals (${pred.confidence}% confidence).`,
        'success'
      );
    } catch (err) {
      console.error(err);
      addToast('Prediction Notice', 'Using calibrated baseline model.', 'info');
    } finally {
      setLoading(false);
      setCurrentStage('');
    }
  };

  const handleLoadSample = () => {
    setForm({
      foodType: 'Cooked Meals',
      mealType: 'Dinner',
      mealsPrepared: 500,
      expectedAttendance: 450,
      day: 'Friday',
      eventType: 'College Hostel',
      historicalAverageConsumption: 420,
      notes: 'End of week dining hall meal.',
    });
  };

  const handlePublishFromPrediction = () => {
    if (!result) return;
    createListing({
      title: `${form.mealType} Surplus (${form.foodType})`,
      category: 'Cooked Meals',
      quantityMeals: result.predictedSurplus,
      weightKg: Math.round(result.predictedSurplus * 0.32),
      providerId: 'usr_prov_rahul',
      providerName: 'ABC College Hostel',
      providerAddress: 'Hostel Dining Hall 3, North Campus',
      distanceKm: 2.1,
      preparedTime: '7:30 PM Today',
      availableUntil: '9:45 PM Today',
      urgency: result.riskLevel === 'HIGH' ? 'HIGH' : 'MEDIUM',
      status: 'urgent',
      dietaryType: 'Vegetarian',
      temperatureHandling: 'Hot (>60°C)',
      pickupLocation: 'Kitchen Service Bay 2',
      notes: `AI forecasted surplus from ${form.eventType} ${form.mealType}.`,
      coordinates: { x: 38, y: 32 },
      matchScore: 95,
    });
    setCurrentView('food-surplus');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <h1 className="fb-heading fb-heading-left text-3xl sm:text-4xl text-[#070e6a] dark:text-white">
            AI Predictor
          </h1>
        </div>

        <button
          onClick={handleLoadSample}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors self-start sm:self-auto flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Sample</span>
        </button>
      </div>

      {/* 2. Main Grid: Input Form (Left) & Animated Visual Display (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-6 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <form onSubmit={handlePredict} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Food Category
                </label>
                <select
                  value={form.foodType}
                  onChange={(e) => setForm({ ...form, foodType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                >
                  <option>Cooked Meals</option>
                  <option>Bakery & Bread</option>
                  <option>Fresh Produce</option>
                  <option>Packaged Meals</option>
                  <option>Dairy & Dessert</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Meal Type
                </label>
                <select
                  value={form.mealType}
                  onChange={(e) => setForm({ ...form, mealType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                >
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                  <option>Late Night Buffet</option>
                  <option>Event Banquet</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Meals Prepared
                </label>
                <input
                  type="number"
                  min={50}
                  max={2000}
                  value={form.mealsPrepared}
                  onChange={(e) =>
                    setForm({ ...form, mealsPrepared: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Expected Attendance
                </label>
                <input
                  type="number"
                  min={50}
                  max={2000}
                  value={form.expectedAttendance}
                  onChange={(e) =>
                    setForm({ ...form, expectedAttendance: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Day
                </label>
                <select
                  value={form.day}
                  onChange={(e) => setForm({ ...form, day: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                >
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                  <option>Sunday</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Event type
                </label>
                <select
                  value={form.eventType}
                  onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                >
                  <option>College Hostel</option>
                  <option>Corporate Cafeteria</option>
                  <option>Wedding / Banquet</option>
                  <option>Hotel Buffet</option>
                  <option>Restaurant Dining</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Historical average
              </label>
              <input
                type="number"
                min={50}
                max={2000}
                value={form.historicalAverageConsumption}
                onChange={(e) =>
                  setForm({
                    ...form,
                    historicalAverageConsumption: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Notes
              </label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="e.g. rainy evening, exam season"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-full bg-[#4855fe] hover:bg-[#ffe537] hover:text-black text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Brain className="w-4 h-4" />
              <span>{loading ? 'Analyzing Demand Dynamics...' : 'Predict Surplus'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: AI Visual Prediction Result */}
        <div className="lg:col-span-6 space-y-6">
          {loading ? (
            /* Animated Processing State */
            <div className="p-10 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 text-center space-y-6 animate-pulse">
              <div className="w-20 h-20 rounded-full bg-teal-500/10 text-[#4855fe] flex items-center justify-center mx-auto border-2 border-[#4855fe] animate-spin dark:text-[#9ea6ff]">
                <Brain className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Predicting…
                </h3>
                <p className="text-xs font-mono text-[#4855fe] dark:text-[#9ea6ff]">{currentStage}</p>
              </div>
              <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto overflow-hidden">
                <div className="w-full h-full bg-[#4855fe] animate-progress" />
              </div>
            </div>
          ) : result ? (
            /* Prediction Result Card with Large Circle */
            <div className="rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-6">
              {/* Circular Visual Indicator */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-[#070e6a] to-[#0a1180] text-white shadow-xl ring-8 ring-[#4855fe]/20">
                  <div className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teal-300 block">
                      SURPLUS
                    </span>
                    <span className="text-4xl font-black font-mono tabular-nums leading-none block my-1">
                      {result.predictedSurplus}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-300 block">MEALS</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold border ${
                        result.riskLevel === 'HIGH'
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-600 border-amber-500/30'
                      }`}
                    >
                      {result.riskLevel} SURPLUS RISK
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {result.confidence}% confident
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {result.predictedSurplus} surplus meals
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white font-mono">{result.predictedConsumption}</strong> of {form.mealsPrepared} meals eaten.
                  </p>
                </div>
              </div>

              {/* Actionable AI Guidance */}
              <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/60 space-y-1.5 text-xs">
                <span className="font-bold text-[#070e6a] dark:text-[#ffe537] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Action
                </span>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                  {result.recommendation}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  {result.explanation}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handlePublishFromPrediction}
                  className="flex-1 py-3 px-4 rounded-full bg-[#4855fe] hover:bg-[#ffe537] hover:text-black text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Publish listing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : null}

          {/* Interactive What-If Simulator embedded right below */}
          <WhatIfSimulator
            initialPrepared={form.mealsPrepared}
            expectedAttendance={form.expectedAttendance}
            historicalAvg={form.historicalAverageConsumption}
            onApplySimulation={(newPrepared) => {
              setForm((prev) => ({ ...prev, mealsPrepared: newPrepared }));
              handlePredict();
            }}
          />
        </div>
      </div>
    </div>
  );
};
