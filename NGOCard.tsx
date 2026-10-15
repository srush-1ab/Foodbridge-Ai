import React, { useState } from 'react';
import {
  Heart,
  MapPin,
  Users,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { NGO } from '../../types';
import { useFoodBridge } from '../../hooks/useFoodBridge';

interface NGOCardProps {
  ngo: NGO;
  listingIdToMatch?: string;
  onSelect?: (ngo: NGO) => void;
}

export const NGOCard: React.FC<NGOCardProps> = ({
  ngo,
  listingIdToMatch,
  onSelect,
}) => {
  const { acceptDonation, setCurrentView } = useFoodBridge();
  const [expanded, setExpanded] = useState(false);

  const handleAccept = () => {
    if (onSelect) {
      onSelect(ngo);
    } else if (listingIdToMatch) {
      acceptDonation(listingIdToMatch, ngo.id);
      setCurrentView('pickups');
    } else {
      acceptDonation('FL-1001', ngo.id);
      setCurrentView('pickups');
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between">
      <div>
        {/* Shelter Photo Thumbnail */}
        <div className="relative h-28 w-[calc(100%+2.5rem)] -mx-5 -mt-5 mb-3.5 overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-800">
          <img
            src={
              ngo.imageUrl ||
              'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80'
            }
            alt={ngo.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-slate-900 shadow-xs">
              {ngo.type}
            </span>
          </div>
          <div className="absolute top-2.5 right-2.5">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/95 text-white font-extrabold text-[10px] shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              {ngo.matchScore}% Match
            </span>
          </div>
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px]">
            <span className="font-semibold text-white drop-shadow-xs">
              {ngo.distanceKm} km from provider
            </span>
            <span className="text-emerald-300 font-bold drop-shadow-xs">
              {ngo.capacityMealsDaily} capacity
            </span>
          </div>
        </div>

        {/* Header with Title */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              {ngo.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Reliability Score: <span className="font-bold text-emerald-600 font-mono">{ngo.reliabilityScore}%</span>
            </p>
          </div>
        </div>

        {/* Capacity & Demand Stats */}
        <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Daily Capacity</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
              {ngo.capacityMealsDaily} meals
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Current Need</span>
            <span className="font-bold text-rose-600 dark:text-rose-400 font-mono tabular-nums">
              {ngo.currentDemandMeals} meals today
            </span>
          </div>
        </div>

        {/* Dietary Match & Contact Details */}
        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{ngo.address}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {ngo.contactPerson} ({ngo.contactPhone})
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <span>Dietary:</span>
            <span>{ngo.preferredDietary.join(', ')}</span>
          </div>
        </div>

        {/* Expandable Scoring Factors */}
        <div className="mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#4855fe] hover:underline dark:text-[#9ea6ff]"
          >
            <span>Why match?</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {expanded && (
            <div className="mt-2 p-3 rounded-lg bg-teal-50/50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900 text-[11px] text-slate-600 dark:text-slate-300 space-y-1 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Within 5 km radius ({ngo.distanceKm} km away)</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Immediate capacity of {ngo.capacityMealsDaily} servings</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Diet and category match</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>High reliability score ({ngo.reliabilityScore}%) with zero missed pickups</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={handleAccept}
          className="w-full py-2 px-3 rounded-full bg-[#4855fe] hover:bg-[#ffe537] hover:text-black text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Assign</span>
        </button>
      </div>
    </div>
  );
};
