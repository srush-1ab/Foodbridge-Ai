import React from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  Navigation,
  ArrowRight,
  MapPin,
  Building2,
  Check,
} from 'lucide-react';
import { PickupRecord, PickupStatus } from '../../types';
import { useFoodBridge } from '../../hooks/useFoodBridge';

interface PickupCardProps {
  pickup: PickupRecord;
  onSelectRoute?: (pickup: PickupRecord) => void;
}

export const PickupCard: React.FC<PickupCardProps> = ({ pickup, onSelectRoute }) => {
  const { advancePickupStatus, addToast } = useFoodBridge();

  const steps: { key: PickupStatus; label: string }[] = [
    { key: 'accepted', label: 'Accepted' },
    { key: 'assigned', label: 'Volunteer Assigned' },
    { key: 'in_transit', label: 'In Transit' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const statusOrder: Record<PickupStatus, number> = {
    accepted: 0,
    assigned: 1,
    in_transit: 2,
    delivered: 3,
  };

  const currentStepIdx = statusOrder[pickup.status];

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#4855fe]/10 text-[#4855fe] dark:text-[#9ea6ff]">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono">TRACKING ID</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight font-mono">
              Pickup #{pickup.id}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-500/10 text-[#4855fe] font-mono tabular-nums dark:text-[#9ea6ff]">
            {pickup.quantityMeals} meals ({pickup.weightKg} kg)
          </span>
        </div>
      </div>

      {/* Item title */}
      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-4">
        {pickup.foodTitle}
      </p>

      {/* 4-Step Visual Progress Timeline */}
      <div className="relative mb-5 px-1">
        <div className="absolute top-3 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-700 -z-0" />
        <div
          className="absolute top-3 left-4 h-0.5 bg-[#4855fe] transition-all duration-300 -z-0"
          style={{ width: `${(currentStepIdx / 3) * 85}%` }}
        />

        <div className="relative flex justify-between z-10">
          {steps.map((st, idx) => {
            const isCompleted = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={st.key} className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                    isCompleted
                      ? 'bg-[#4855fe] text-white'
                      : isCurrent
                      ? 'bg-[#070e6a] dark:bg-[#ffe537] text-white dark:text-slate-950 ring-4 ring-[#4855fe]/20'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <span
                  className={`text-[10px] mt-1.5 text-center leading-tight max-w-[65px] ${
                    isCurrent
                      ? 'font-bold text-slate-900 dark:text-white'
                      : 'text-slate-400'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Route & Volunteer Details */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs space-y-2 mb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#4855fe]" />
              <strong>Pickup:</strong> {pickup.providerName}
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#ff5a00]" />
              <strong>Drop:</strong> {pickup.ngoName}
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 block">EST. ARRIVAL</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {pickup.status === 'delivered' ? 'Completed' : `${pickup.etaMinutes} mins`}
            </span>
            <span className="text-[10px] text-slate-500 block font-mono tabular-nums">
              {pickup.distanceKm} km trip
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Courier: <strong>{pickup.volunteerName}</strong></span>
          <button
            onClick={() => addToast('Calling Volunteer', `Dialing ${pickup.volunteerPhone}...`, 'info')}
            className="flex items-center gap-1 text-[#4855fe] font-semibold hover:underline dark:text-[#9ea6ff]"
          >
            <Phone className="w-3 h-3" />
            <span>Contact</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="flex items-center gap-2">
        {onSelectRoute && (
          <button
            onClick={() => onSelectRoute(pickup)}
            className="flex-1 py-2 px-3 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
          >
            <Navigation className="w-3 h-3" />
            <span>View Route</span>
          </button>
        )}

        {pickup.status !== 'delivered' ? (
          <button
            onClick={() => advancePickupStatus(pickup.id)}
            className="flex-1 py-2 px-3 rounded-full bg-[#4855fe] hover:bg-[#ffe537] hover:text-black text-white text-xs font-bold hover:brightness-105 shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>
              {pickup.status === 'accepted'
                ? 'Assign Volunteer'
                : pickup.status === 'assigned'
                ? 'Start Transit'
                : 'Mark Complete ✓'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="w-full text-center py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Delivered</span>
          </div>
        )}
      </div>
    </div>
  );
};
