import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  Compass,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useFoodBridge } from '../hooks/useFoodBridge';
import { NGOCard } from '../components/dashboard/NGOCard';
import { FoodListingCard } from '../components/dashboard/FoodListingCard';
import { GoogleMapView } from '../components/common/GoogleMapView';

export const NGODashboard: React.FC = () => {
  const { currentUser, listings, ngos, acceptDonation, setCurrentView, addToast } =
    useFoodBridge();

  const [activeTab, setActiveTab] = useState<'opportunities' | 'smart-matching' | 'map'>(
    'opportunities'
  );
  const [selectedDietary, setSelectedDietary] = useState<string>('All');

  // Available surplus opportunities for this NGO
  const availableOpportunities = listings.filter(
    (l) => l.status === 'urgent' || l.status === 'active'
  );

  const filteredOpportunities = availableOpportunities.filter((item) => {
    if (selectedDietary !== 'All' && item.dietaryType !== selectedDietary) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="fb-heading fb-heading-left text-3xl sm:text-4xl text-[#070e6a] dark:text-white">
            Good evening, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {currentUser.organization}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('smart-matching')}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-full bg-indigo-500/10 text-[#e04e00] border border-indigo-500/20 text-xs font-bold hover:bg-indigo-500/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Match radar</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metrics (4 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Nearby
          </p>
          <p className="text-2xl font-black text-[#070e6a] dark:text-[#ffe537] font-mono tabular-nums mt-1">
            {availableOpportunities.length}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Ready now</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Accepted Today
          </p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-1">
            7
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Verified</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            Meals Received
          </p>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono tabular-nums mt-1">
            1,240
          </p>
          <span className="text-[10px] text-slate-400 font-medium">This month</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            People Served
          </p>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono tabular-nums mt-1">
            980
          </p>
          <span className="text-[10px] text-slate-400 font-medium">People reached</span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-3.5 py-2 text-xs font-bold rounded-full transition-colors cursor-pointer ${
            activeTab === 'opportunities'
              ? 'bg-[#070e6a] text-white dark:bg-[#ffe537] dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Nearby ({availableOpportunities.length})
        </button>

        <button
          onClick={() => setActiveTab('smart-matching')}
          className={`px-3.5 py-2 text-xs font-bold rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'smart-matching'
              ? 'bg-[#070e6a] text-white dark:bg-[#ffe537] dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Matching</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`px-3.5 py-2 text-xs font-bold rounded-full transition-colors cursor-pointer ${
            activeTab === 'map'
              ? 'bg-[#070e6a] text-white dark:bg-[#ffe537] dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Live map
        </button>
      </div>

      {/* Tab 1: Nearby Food Opportunities */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sorted by AI match score.
            </p>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Dietary:</span>
              <select
                value={selectedDietary}
                onChange={(e) => setSelectedDietary(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0d1360] text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Diets</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Jain Friendly">Jain Friendly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOpportunities.map((listing) => (
              <FoodListingCard
                key={listing.id}
                listing={listing}
                onAccept={(item) => {
                  acceptDonation(item.id, currentUser.id);
                  setCurrentView('pickups');
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Smart Matching Engine */}
      {activeTab === 'smart-matching' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#070e6a] to-[#0a1180] text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#4855fe]/20 text-[#4855fe] dark:text-[#9ea6ff]">
                  <Compass className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold">Smart matching</h3>
                  <p className="text-xs text-slate-300">
                    Finding the best match…
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#4855fe] text-white font-extrabold text-xs">
                RADAR ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-white/10 text-center text-xs">
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-[10px] text-slate-400 block">Radius</span>
                <span className="font-bold text-white">≤ 5.0 km</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-[10px] text-slate-400 block">Capacity Fit</span>
                <span className="font-bold text-teal-300">100% matched</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-[10px] text-slate-400 block">Dietary Rule</span>
                <span className="font-bold text-white">Strict Veg</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-[10px] text-slate-400 block">Thermal Safe</span>
                <span className="font-bold text-emerald-400">&gt;60°C Hot</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-[10px] text-slate-400 block">Volunteer</span>
                <span className="font-bold text-white">Auto-dispatched</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-[10px] text-slate-400 block">Reliability</span>
                <span className="font-bold text-indigo-300">98% Score</span>
              </div>
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Ranked NGOs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ngos.map((n) => (
              <NGOCard key={n.id} ngo={n} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Spatial Map */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <GoogleMapView heightClass="h-96 md:h-[500px]" />
        </div>
      )}
    </div>
  );
};
