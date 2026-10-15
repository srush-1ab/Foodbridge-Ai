import React, { useState } from 'react';
import {
  Truck,
  Heart,
  Navigation,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  Building2,
  Award,
  Zap,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useFoodBridge } from '../hooks/useFoodBridge';
import { PickupCard } from '../components/dashboard/PickupCard';
import { GoogleMapView } from '../components/common/GoogleMapView';

export const VolunteerDashboard: React.FC = () => {
  const { currentUser, pickups, advancePickupStatus, acceptDonation, setCurrentView, addToast } =
    useFoodBridge();

  const [acceptedVolTrip, setAcceptedVolTrip] = useState<boolean>(false);

  // Active delivery for the volunteer
  const activePickup =
    pickups.find((p) => p.status === 'in_transit' || p.status === 'assigned') ||
    (acceptedVolTrip ? pickups[0] : null);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="fb-heading fb-heading-left text-3xl sm:text-4xl text-[#070e6a] dark:text-white">
            Hi {currentUser.name.split(' ')[0]} 🚚
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Sector 4 Hub
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            On duty
          </span>
        </div>
      </div>

      {/* 2. Top Volunteer Metrics (4 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Pickups Completed
          </p>
          <p className="text-2xl font-black text-[#070e6a] dark:text-[#ffe537] font-mono tabular-nums mt-1">
            42
          </p>
          <span className="text-[10px] text-slate-400 font-medium">100% on time</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Meals Delivered
          </p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-1">
            1,820
          </p>
          <span className="text-[10px] text-slate-400 font-medium">6 shelters</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Distance Covered
          </p>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono tabular-nums mt-1">
            126 km
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Zero emission</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            Impact Score
          </p>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono tabular-nums mt-1">
            94
          </p>
          <span className="text-[10px] text-indigo-500 font-medium dark:text-[#9ea6ff]">Top 5%</span>
        </div>
      </div>

      {/* 3. Active Delivery Screen or Available Rescue Missions */}
      {activePickup ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Active run
            </h3>
            <span className="text-xs font-mono font-bold text-[#4855fe] dark:text-[#9ea6ff]">
              ETA ~{activePickup.etaMinutes} mins
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 space-y-4">
              <PickupCard pickup={activePickup} />

              <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#4855fe] dark:text-[#9ea6ff]" />
                  Verification
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  Check the thermal seal and meal count at {activePickup.ngoName}.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <GoogleMapView activePickupId={activePickup.id} heightClass="h-96 md:h-[500px]" />
            </div>
          </div>
        </div>
      ) : (
        /* Available Urgent Pickups */
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Available pickups
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Urgent Card 1 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1360] border border-rose-300 dark:border-rose-900/60 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 font-extrabold text-[11px] animate-pulse">
                  URGENT
                </span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  86 meals (28 kg)
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Pickup:</span>
                  <strong className="text-slate-900 dark:text-white">ABC College Hostel</strong>
                  <span className="text-slate-400 font-mono">(North Campus)</span>
                </div>

                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#e04e00] shrink-0" />
                  <span>Drop:</span>
                  <strong className="text-slate-900 dark:text-white">
                    Hope Community Kitchen
                  </strong>
                  <span className="text-slate-400 font-mono">(Civil Lines)</span>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>4.2 km · 15 min</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    acceptDonation('FL-1001', 'ngo_hope');
                    setAcceptedVolTrip(true);
                    addToast(
                      'Mission Accepted! 🚚',
                      'Navigating to ABC College Hostel loading bay.',
                      'success'
                    );
                  }}
                  className="flex-1 py-2.5 px-4 rounded-full bg-[#4855fe] hover:bg-[#ffe537] hover:text-black text-white text-xs font-bold hover:brightness-105 shadow-sm transition-all cursor-pointer"
                >
                  Accept pickup
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold text-[11px]">
                  STANDARD RESCUE
                </span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  45 meals (14 kg)
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Pickup:</span>
                  <strong className="text-slate-900 dark:text-white">Green Bowl Artisan Cafe</strong>
                </div>

                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#e04e00] shrink-0" />
                  <span>Drop:</span>
                  <strong className="text-slate-900 dark:text-white">
                    Helping Hands Foundation
                  </strong>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>2.8 km · Bakery</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    acceptDonation('FL-1002', 'ngo_helping');
                    setAcceptedVolTrip(true);
                    addToast(
                      'Mission Accepted! 🚚',
                      'Navigating to Green Bowl Artisan Cafe.',
                      'success'
                    );
                  }}
                  className="flex-1 py-2.5 px-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 shadow-xs transition-opacity cursor-pointer"
                >
                  Accept pickup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
