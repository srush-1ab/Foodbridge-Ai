import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Building2,
  AlertCircle,
  CheckCircle,
  Truck,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Eye,
  Trash2,
  X,
  Phone,
} from 'lucide-react';
import { FoodListing } from '../../types';
import { useFoodBridge } from '../../hooks/useFoodBridge';

interface FoodListingCardProps {
  listing: FoodListing;
  onFindReceiver?: (listing: FoodListing) => void;
  onAccept?: (listing: FoodListing) => void;
}

export const FoodListingCard: React.FC<FoodListingCardProps> = ({
  listing,
  onFindReceiver,
  onAccept,
}) => {
  const { currentRole, setCurrentView, acceptDonation, deleteListing, addToast } = useFoodBridge();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const urgencyStyles = {
    LOW: 'text-slate-600 dark:text-slate-400',
    MEDIUM: 'text-amber-600 dark:text-amber-400 font-semibold',
    HIGH: 'text-rose-600 dark:text-rose-400 font-bold',
    CRITICAL: 'text-rose-700 dark:text-rose-300 font-extrabold animate-pulse',
  };

  const statusBadges: Record<string, { label: string; color: string }> = {
    active: { label: 'Active', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    urgent: { label: 'Urgent Rescue', color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold' },
    accepted: { label: 'Claimed', color: 'bg-indigo-500/10 text-[#e04e00]' },
    in_transit: { label: 'In Transit', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
    completed: { label: 'Rescued ✓', color: 'bg-emerald-500/10 text-emerald-600' },
    expired: { label: 'Archived', color: 'bg-slate-500/10 text-slate-500' },
  };

  const categoryEmoji: Record<string, string> = {
    'Cooked Meals': '🍛',
    'Bakery & Bread': '🥖',
    'Fresh Produce': '🥗',
    'Packaged Meals': '🍱',
    'Dairy & Dessert': '🥛',
    Beverages: '🧃',
  };

  const badge = statusBadges[listing.status] || statusBadges.active;

  return (
    <>
      <div className="group relative rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 hover:border-[#4855fe]/40 dark:hover:border-[#ffe537]/40 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between">
        <div>
          {/* Real Food Image Thumbnail */}
          <div className="relative h-36 w-[calc(100%+2.5rem)] -mx-5 -mt-5 mb-3.5 overflow-hidden rounded-tl-2xl rounded-tr-[2.5rem] rounded-bl-[2.5rem] bg-slate-100 dark:bg-slate-800">
            <img
              src={
                listing.imageUrl ||
                (listing.category === 'Bakery & Bread'
                  ? 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
                  : listing.category === 'Fresh Produce'
                  ? 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
                  : listing.category === 'Dairy & Dessert'
                  ? 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80'
                  : 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80')
              }
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-slate-900 shadow-xs">
                {categoryEmoji[listing.category] || '🍱'} {listing.dietaryType}
              </span>
            </div>
            <div className="absolute top-2.5 right-2.5">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${badge.color} bg-white/95 dark:bg-slate-900/90 shadow-xs`}>
                {badge.label}
              </span>
            </div>
            <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px]">
              <span className="font-extrabold text-white drop-shadow-xs font-mono">
                {listing.quantityMeals} Portions ({listing.weightKg} kg)
              </span>
              <span className="text-teal-200 font-semibold drop-shadow-xs">
                {listing.distanceKm} km away
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#4855fe] transition-colors mb-2">
            {listing.title}
          </h3>

          {/* Quantity & Weight Highlight */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-black text-[#070e6a] dark:text-white font-mono tabular-nums">
              {listing.quantityMeals}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              portions ({listing.weightKg} kg)
            </span>
          </div>

          {/* Location & Time Metadata */}
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {listing.providerName}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-mono tabular-nums">
                {listing.distanceKm} km away
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Available until:</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {listing.availableUntil}
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4855fe] shrink-0 dark:text-[#9ea6ff]" />
              <span>Handling:</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {listing.temperatureHandling}
              </span>
            </div>
          </div>

          {listing.notes && (
            <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 italic">
              "{listing.notes}"
            </p>
          )}
        </div>

        {/* Action Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          {listing.status === 'urgent' || listing.status === 'active' ? (
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={() => setDetailsOpen(true)}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="View Full Details"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (onAccept) onAccept(listing);
                  else {
                    acceptDonation(listing.id, 'ngo_hope');
                    setCurrentView('pickups');
                  }
                }}
                className="flex-1 py-2 px-3 rounded-full bg-[#4855fe] hover:bg-[#ffe537] hover:text-black text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Claim</span>
              </button>

              <button
                onClick={() => {
                  if (onFindReceiver) onFindReceiver(listing);
                  else setCurrentView('ngos');
                }}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                title="Find Matching NGOs"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : listing.status === 'accepted' ? (
            <div className="w-full flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              <span>Claimed by {listing.acceptedByNgoName || 'Hope Kitchen'}</span>
              <button
                onClick={() => setCurrentView('pickups')}
                className="text-[#4855fe] hover:underline font-bold cursor-pointer dark:text-[#9ea6ff]"
              >
                Track →
              </button>
            </div>
          ) : listing.status === 'completed' ? (
            <div className="w-full flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>Safely Rescued</span>
              </span>
              <button
                onClick={() => setCurrentView('impact')}
                className="text-xs text-[#070e6a] dark:text-[#ffe537] hover:underline font-bold cursor-pointer"
              >
                View Impact →
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Expired</span>
          )}
        </div>
      </div>

      {/* Details Modal Dialog */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0d1360] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4855fe] dark:text-[#9ea6ff]">
                  Surplus Food Details · {listing.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mt-1">
                  {listing.title}
                </h3>
              </div>
              <button
                onClick={() => setDetailsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-center">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Quantity</p>
                <p className="text-lg font-extrabold text-[#070e6a] dark:text-white font-mono">
                  {listing.quantityMeals}
                </p>
                <p className="text-[10px] text-slate-500">servings</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Weight</p>
                <p className="text-lg font-extrabold text-[#4855fe] font-mono dark:text-[#9ea6ff]">
                  {listing.weightKg} kg
                </p>
                <p className="text-[10px] text-slate-500">net weight</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Dietary</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {listing.dietaryType}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Provider:</span>
                <strong className="text-slate-900 dark:text-white">{listing.providerName}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Address:</span>
                <span>{listing.providerAddress}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Pickup Location:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {listing.pickupLocation}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Available Until:</span>
                <strong className="text-rose-600 dark:text-rose-400 font-mono">
                  {listing.availableUntil}
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Thermal Handling:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">
                  {listing.temperatureHandling}
                </span>
              </div>
              {listing.notes && (
                <div className="pt-1">
                  <span className="text-slate-400 block mb-1">Notes:</span>
                  <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 italic">
                    "{listing.notes}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDetailsOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  acceptDonation(listing.id, 'ngo_hope');
                  setDetailsOpen(false);
                  setCurrentView('pickups');
                }}
                className="flex-1 py-2.5 px-4 rounded-full bg-[#4855fe] hover:bg-[#ffe537] hover:text-black text-white text-xs font-bold shadow-md hover:brightness-105 cursor-pointer"
              >
                Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
