import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Utensils,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Info,
} from 'lucide-react';
import { useFoodBridge } from '../hooks/useFoodBridge';
import { FoodCategory, DietaryType, UrgencyLevel } from '../types';

export const CreateSurplusPage: React.FC = () => {
  const { createListing, currentUser, setCurrentView, addToast } = useFoodBridge();

  const [form, setForm] = useState({
    title: 'Fragrant Basmati Biryani & Cucumber Raita',
    category: 'Cooked Meals' as FoodCategory,
    quantityMeals: 95,
    preparedTime: '1:30 PM Today',
    availableUntil: '5:30 PM Today',
    dietaryType: 'Vegetarian' as DietaryType,
    temperatureHandling: 'Hot (>60°C)' as 'Hot (>60°C)' | 'Refrigerated (<4°C)' | 'Room Temp',
    pickupLocation: 'Main Kitchen Service Bay 3, North Campus',
    notes: 'Hot food safely packed in 4 commercial food-grade cambros. Ready for direct handover.',
    weightKg: 30,
    urgency: 'HIGH' as UrgencyLevel,
  });

  const [enteredPrepared, setEnteredPrepared] = useState<number>(500);

  // Live estimated surplus calculation on the right
  const liveEstimatedSurplus = Math.round(enteredPrepared * 0.16);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const created = createListing({
      title: form.title,
      category: form.category,
      quantityMeals: form.quantityMeals,
      weightKg: form.weightKg || Math.round(form.quantityMeals * 0.32),
      providerId: currentUser.id,
      providerName: currentUser.organization || currentUser.name,
      providerAddress: currentUser.location || 'North Campus Central Dining',
      distanceKm: 2.1,
      preparedTime: form.preparedTime,
      availableUntil: form.availableUntil,
      urgency: form.urgency,
      status: 'urgent',
      dietaryType: form.dietaryType,
      temperatureHandling: form.temperatureHandling,
      pickupLocation: form.pickupLocation,
      notes: form.notes,
      coordinates: { x: 40, y: 35 },
      matchScore: 96,
    });

    // Navigate to NGOs matching view
    setCurrentView('ngos');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="fb-heading fb-heading-left text-3xl sm:text-4xl text-[#070e6a] dark:text-white">
          New listing
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form */}
        <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Food name *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                placeholder="e.g. Rice, dal, veggies"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as FoodCategory })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                >
                  <option>Cooked Meals</option>
                  <option>Bakery & Bread</option>
                  <option>Fresh Produce</option>
                  <option>Packaged Meals</option>
                  <option>Dairy & Dessert</option>
                  <option>Beverages</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Portions *
                </label>
                <input
                  type="number"
                  required
                  min={5}
                  max={2000}
                  value={form.quantityMeals}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantityMeals: parseInt(e.target.value, 10) || 0,
                      weightKg: Math.round((parseInt(e.target.value, 10) || 0) * 0.32),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.weightKg}
                  onChange={(e) =>
                    setForm({ ...form, weightKg: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Diet
                </label>
                <select
                  value={form.dietaryType}
                  onChange={(e) =>
                    setForm({ ...form, dietaryType: e.target.value as DietaryType })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                >
                  <option>Vegetarian</option>
                  <option>Non-Vegetarian</option>
                  <option>Vegan</option>
                  <option>Jain Friendly</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Storage
                </label>
                <select
                  value={form.temperatureHandling}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      temperatureHandling: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                >
                  <option>Hot (&gt;60°C)</option>
                  <option>Refrigerated (&lt;4°C)</option>
                  <option>Room Temp</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Prepared Time
                </label>
                <input
                  type="text"
                  value={form.preparedTime}
                  onChange={(e) => setForm({ ...form, preparedTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                  placeholder="e.g. 1:30 PM Today"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Available until *
                </label>
                <input
                  type="text"
                  required
                  value={form.availableUntil}
                  onChange={(e) => setForm({ ...form, availableUntil: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                  placeholder="e.g. 5:30 PM Today"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Pickup spot *
              </label>
              <input
                type="text"
                required
                value={form.pickupLocation}
                onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                placeholder="e.g. Gate 2, kitchen ramp"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Notes
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                placeholder="Containers, allergens, contact"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-full bg-[#4855fe] hover:bg-[#ffe537] hover:text-black text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Publish & match</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live AI Assistance & Verification */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-teal-500/10 border border-[#4855fe]/30 space-y-3">
            <div className="flex items-center gap-2 text-[#4855fe] dark:text-[#9ea6ff]">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                AI Estimated Surplus
              </h3>
            </div>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-white dark:bg-[#0d1360] border border-teal-500/20">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[11px] text-slate-400">Meals Prepared:</span>
                  <input
                    type="number"
                    value={enteredPrepared}
                    onChange={(e) => setEnteredPrepared(parseInt(e.target.value, 10) || 0)}
                    className="w-20 px-1 text-right font-bold font-mono text-slate-900 dark:text-white border-b border-teal-500/50 bg-transparent focus:outline-hidden"
                  />
                </div>
                <div className="flex justify-between text-xs font-bold text-[#4855fe] pt-1 border-t border-slate-100 dark:border-slate-800 dark:text-[#9ea6ff]">
                  <span>AI Estimated Surplus:</span>
                  <span className="font-mono tabular-nums">{liveEstimatedSurplus} meals</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {enteredPrepared} prepared ≈ {liveEstimatedSurplus} surplus.
              </p>

              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    quantityMeals: liveEstimatedSurplus,
                    weightKg: Math.round(liveEstimatedSurplus * 0.32),
                  }));
                  addToast('AI Quantity Applied', `Set to ${liveEstimatedSurplus} surplus meals.`, 'info');
                }}
                className="w-full py-2 px-3 rounded-full bg-[#4855fe] text-white font-bold text-xs hover:bg-[#ffe537] hover:text-black transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply {liveEstimatedSurplus} meals</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Safety
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Nearby NGOs are notified instantly. Couriers bring insulated crates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
