import React from 'react';
import { CheckCircle2, Heart, Award, ArrowRight, X } from 'lucide-react';
import { useFoodBridge } from '../../hooks/useFoodBridge';

export const DeliverySuccessModal: React.FC = () => {
  const { completedDeliveryModal, closeDeliveryModal, setCurrentView } = useFoodBridge();

  if (!completedDeliveryModal) return null;

  const handleViewImpact = () => {
    closeDeliveryModal();
    setCurrentView('impact');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0d1360] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 text-center overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeDeliveryModal}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebratory Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          Food rescued 🎉
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-300 mb-6">
          Delivered safely.
        </p>

        {/* Key Realized Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
          <div>
            <p className="text-2xl font-black text-[#070e6a] dark:text-[#ffe537] font-mono tabular-nums">
              {completedDeliveryModal.quantityMeals}
            </p>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Meals Rescued
            </p>
          </div>

          <div>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono tabular-nums">
              {completedDeliveryModal.distanceKm} km
            </p>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Delivered
            </p>
          </div>

          <div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              1
            </p>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Org Supported
            </p>
          </div>
        </div>

        {/* Narrative Details */}
        <div className="text-left text-xs text-slate-600 dark:text-slate-300 space-y-1.5 mb-6 px-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Item:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[220px]">
              {completedDeliveryModal.foodTitle}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Receiver:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {completedDeliveryModal.ngoName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Courier:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {completedDeliveryModal.volunteerName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Waste saved:</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              {completedDeliveryModal.weightKg} kg CO₂-positive
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={closeDeliveryModal}
            className="flex-1 py-2.5 px-4 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={handleViewImpact}
            className="flex-1 py-2.5 px-4 rounded-full bg-[#4855fe] hover:bg-[#ffe537] hover:text-black text-white text-xs font-bold hover:brightness-105 shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <span>View Impact</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
