import React, { useState } from 'react';
import {
  Truck,
  Phone,
  Navigation,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  Building2,
  Heart,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useFoodBridge } from '../hooks/useFoodBridge';
import { PickupCard } from '../components/dashboard/PickupCard';
import { GoogleMapView } from '../components/common/GoogleMapView';
import { PickupRecord } from '../types';

export const PickupTrackingPage: React.FC = () => {
  const { pickups, advancePickupStatus, addToast } = useFoodBridge();

  const [selectedPickupId, setSelectedPickupId] = useState<string>(
    pickups.find((p) => p.status === 'in_transit')?.id || pickups[0]?.id || 'FB-2048'
  );

  const selectedPickup =
    pickups.find((p) => p.id === selectedPickupId) || pickups[0];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="fb-heading fb-heading-left text-3xl sm:text-4xl text-[#070e6a] dark:text-white">
            Live pickups
          </h1>
        </div>

        {/* Quick selector of active pickups */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Viewing Pickup:</span>
          <select
            value={selectedPickupId}
            onChange={(e) => setSelectedPickupId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0d1360] text-xs font-mono font-bold text-slate-800 dark:text-slate-200"
          >
            {pickups.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.id} ({p.status.replace('_', ' ')}) - {p.quantityMeals} meals
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Spotlight Active Pickup Tracker Card */}
      {selectedPickup && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Detailed Tracking Card */}
          <div className="lg:col-span-5 space-y-4">
            <PickupCard pickup={selectedPickup} />

            {/* Courier Info Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Assigned Courier
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                  On trip
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#070e6a] text-white flex items-center justify-center font-bold text-sm">
                  {selectedPickup.volunteerName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {selectedPickup.volunteerName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {selectedPickup.volunteerPhone}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs">
                <span className="text-slate-500">Vehicle:</span>
                <strong className="text-slate-900 dark:text-white">Electric Cargo Van</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Thermal Kit:</span>
                <strong className="text-emerald-600">Insulated · &gt;60°C</strong>
              </div>
            </div>
          </div>

          {/* Interactive Route Map */}
          <div className="lg:col-span-7">
            <GoogleMapView
              activePickupId={selectedPickup.id}
              heightClass="h-96 md:h-[500px]"
            />
          </div>
        </div>
      )}

      {/* 3. All Pickups History Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          All Network Pickups ({pickups.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Pickup ID</th>
                <th className="py-2.5 px-3">Food Item</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Provider</th>
                <th className="py-2.5 px-3">Receiver NGO</th>
                <th className="py-2.5 px-3">Courier</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {pickups.map((p) => (
                <tr
                  key={p.id}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                    p.id === selectedPickupId ? 'bg-teal-50/40 dark:bg-teal-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-mono font-bold text-[#070e6a] dark:text-[#ffe537]">
                    #{p.id}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                    {p.foodTitle}
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums">
                    {p.quantityMeals} meals ({p.weightKg} kg)
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {p.providerName}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {p.ngoName}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                    {p.volunteerName}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        p.status === 'delivered'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : p.status === 'in_transit'
                          ? 'bg-amber-500/15 text-amber-600'
                          : 'bg-indigo-500/10 text-[#e04e00]'
                      }`}
                    >
                      {p.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedPickupId(p.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-semibold text-[#4855fe] hover:underline cursor-pointer dark:text-[#9ea6ff]"
                    >
                      Inspect Route
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
