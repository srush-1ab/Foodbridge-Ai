import React, { useState } from 'react';
import {
  MapPin,
  Truck,
  Heart,
  AlertTriangle,
  Building2,
  Navigation,
  X,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { FoodListing, NGO, Volunteer, PickupRecord } from '../../types';
import { useFoodBridge } from '../../hooks/useFoodBridge';

interface InteractiveMapProps {
  listings?: FoodListing[];
  ngos?: NGO[];
  volunteers?: Volunteer[];
  pickups?: PickupRecord[];
  activePickupId?: string;
  className?: string;
  heightClass?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  listings: propListings,
  ngos: propNgos,
  volunteers: propVolunteers,
  pickups: propPickups,
  activePickupId,
  className = '',
  heightClass = 'h-96 md:h-[460px]',
}) => {
  const {
    listings: contextListings,
    ngos: contextNgos,
    volunteers: contextVolunteers,
    pickups: contextPickups,
    setCurrentView,
    acceptDonation,
  } = useFoodBridge();

  const listings = propListings || contextListings;
  const ngos = propNgos || contextNgos;
  const volunteers = propVolunteers || contextVolunteers;
  const pickups = propPickups || contextPickups;

  const [filter, setFilter] = useState<'all' | 'providers' | 'ngos' | 'urgent' | 'couriers'>('all');
  const [selectedNode, setSelectedNode] = useState<{
    type: 'provider' | 'ngo' | 'courier';
    data: any;
    coords: { x: number; y: number };
  } | null>(null);

  // Active pickup for route drawing
  const currentActivePickup = activePickupId
    ? pickups.find((p) => p.id === activePickupId)
    : pickups.find((p) => p.status === 'in_transit') || pickups[0];

  return (
    <div
      className={`relative w-full ${heightClass} rounded-2xl overflow-hidden bg-[#070c47] border border-slate-700/60 shadow-lg select-none ${className}`}
    >
      {/* SVG Canvas for Map Topology */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Grid pattern */}
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#2a34b8" strokeWidth="0.3" />
          </pattern>

          {/* Glowing line gradient */}
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4855fe" />
            <stop offset="50%" stopColor="#f5c400" />
            <stop offset="100%" stopColor="#ff5a00" />
          </linearGradient>

          {/* Pulse marker filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Map Background Grid */}
        <rect width="100" height="100" fill="#070c47" />
        <rect width="100" height="100" fill="url(#grid)" />

        {/* River Curve */}
        <path
          d="M 0 45 Q 30 55 50 40 T 100 50"
          fill="none"
          stroke="#2a34b8"
          strokeWidth="3.5"
          opacity="0.8"
        />

        {/* Secondary arterial roads */}
        <path d="M 15 0 L 25 100" fill="none" stroke="#2a34b8" strokeWidth="0.8" />
        <path d="M 75 0 L 85 100" fill="none" stroke="#2a34b8" strokeWidth="0.8" />
        <path d="M 0 25 L 100 35" fill="none" stroke="#2a34b8" strokeWidth="0.8" />
        <path d="M 0 75 L 100 65" fill="none" stroke="#2a34b8" strokeWidth="0.8" />

        {/* Major Express Highway */}
        <path
          d="M 5 85 Q 40 20 95 15"
          fill="none"
          stroke="#2a34b8"
          strokeWidth="1.6"
          strokeDasharray="2 1"
        />

        {/* Active Route Vector Line if pickup exists */}
        {currentActivePickup && (
          <g>
            <path
              d={`M ${currentActivePickup.providerCoords.x} ${currentActivePickup.providerCoords.y} 
                  Q ${currentActivePickup.courierCoords.x} ${currentActivePickup.courierCoords.y} 
                  ${currentActivePickup.ngoCoords.x} ${currentActivePickup.ngoCoords.y}`}
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="0.9"
              strokeDasharray="1.5 1"
              className="animate-pulse"
            />
            {/* Courier animated waypoint dot */}
            <circle
              cx={currentActivePickup.courierCoords.x}
              cy={currentActivePickup.courierCoords.y}
              r="1.2"
              fill="#22C55E"
              filter="url(#glow)"
            />
          </g>
        )}
      </svg>

      {/* Map Control Overlays */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 p-1 bg-[#0d1360]/90 backdrop-blur-md rounded-xl border border-slate-700/60 shadow-md">
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
            filter === 'all'
              ? 'bg-[#4855fe] text-white font-bold'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          All Hubs
        </button>
        <button
          onClick={() => setFilter('providers')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
            filter === 'providers'
              ? 'bg-[#4855fe] text-white font-bold'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          Providers
        </button>
        <button
          onClick={() => setFilter('ngos')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
            filter === 'ngos'
              ? 'bg-[#ff5a00] text-white font-bold'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          NGOs
        </button>
        <button
          onClick={() => setFilter('urgent')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
            filter === 'urgent'
              ? 'bg-[#EF4444] text-white font-bold'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          Urgent Food
        </button>
        <button
          onClick={() => setFilter('couriers')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
            filter === 'couriers'
              ? 'bg-[#22C55E] text-slate-950 font-bold'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          Couriers
        </button>
      </div>

      {/* Legend Badge */}
      <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-3 px-3 py-1.5 bg-[#0d1360]/80 backdrop-blur-md rounded-xl border border-slate-700/60 text-[10px] text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#4855fe]" />
          <span>Provider</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#ff5a00]" />
          <span>NGO Receiver</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
          <span>Urgent Surplus</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span>Volunteer Courier</span>
        </div>
      </div>

      {/* Interactive Markers Container */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Provider / Surplus Markers */}
        {(filter === 'all' || filter === 'providers' || filter === 'urgent') &&
          listings.map((item) => {
            const isUrgent = item.urgency === 'HIGH' || item.urgency === 'CRITICAL';
            if (filter === 'urgent' && !isUrgent) return null;

            return (
              <button
                key={item.id}
                onClick={() =>
                  setSelectedNode({
                    type: 'provider',
                    data: item,
                    coords: item.coordinates,
                  })
                }
                style={{
                  left: `${item.coordinates.x}%`,
                  top: `${item.coordinates.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute pointer-events-auto p-1 group focus:outline-hidden"
                title={`${item.providerName} - ${item.quantityMeals} meals`}
              >
                <div className="relative flex items-center justify-center">
                  {isUrgent && (
                    <span className="absolute w-7 h-7 rounded-full bg-rose-500/30 animate-ping" />
                  )}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-md transition-transform group-hover:scale-125 border ${
                      isUrgent
                        ? 'bg-rose-500 border-rose-300'
                        : 'bg-[#4855fe] border-teal-300'
                    }`}
                  >
                    🍛
                  </div>
                </div>
              </button>
            );
          })}

        {/* NGO Markers */}
        {(filter === 'all' || filter === 'ngos') &&
          ngos.map((ngo) => (
            <button
              key={ngo.id}
              onClick={() =>
                setSelectedNode({
                  type: 'ngo',
                  data: ngo,
                  coords: ngo.coordinates,
                })
              }
              style={{
                left: `${ngo.coordinates.x}%`,
                top: `${ngo.coordinates.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute pointer-events-auto p-1 group focus:outline-hidden"
              title={`${ngo.name} - Capacity: ${ngo.capacityMealsDaily}`}
            >
              <div className="w-6 h-6 rounded-full bg-[#ff5a00] border border-indigo-300 text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-125 text-[10px]">
                <Heart className="w-3.5 h-3.5 fill-current" />
              </div>
            </button>
          ))}

        {/* Volunteer Couriers */}
        {(filter === 'all' || filter === 'couriers') &&
          volunteers.map((vol) => (
            <button
              key={vol.id}
              onClick={() =>
                setSelectedNode({
                  type: 'courier',
                  data: vol,
                  coords: vol.coordinates,
                })
              }
              style={{
                left: `${vol.coordinates.x}%`,
                top: `${vol.coordinates.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute pointer-events-auto p-1 group focus:outline-hidden"
              title={`${vol.name} - ${vol.vehicleType}`}
            >
              <div className="w-6 h-6 rounded-full bg-[#22C55E] border border-emerald-300 text-slate-950 flex items-center justify-center shadow-md transition-transform group-hover:scale-125">
                <Truck className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
      </div>

      {/* Selected Node Details Card Popup */}
      {selectedNode && (
        <div className="absolute bottom-3 right-3 z-30 max-w-xs w-full bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-4 animate-in slide-in-from-bottom duration-150">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4855fe] dark:text-[#9ea6ff]">
                {selectedNode.type === 'provider'
                  ? 'Surplus Food Hub'
                  : selectedNode.type === 'ngo'
                  ? 'Community Receiver'
                  : 'Rescue Courier'}
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {selectedNode.data.name || selectedNode.data.title || selectedNode.data.providerName}
              </h4>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {selectedNode.type === 'provider' && (
            <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300 mb-3">
              <p>
                <strong>Provider:</strong> {selectedNode.data.providerName}
              </p>
              <p>
                <strong>Quantity:</strong> {selectedNode.data.quantityMeals} meals ({selectedNode.data.weightKg} kg)
              </p>
              <p>
                <strong>Available until:</strong> {selectedNode.data.availableUntil}
              </p>
              <p>
                <strong>Urgency:</strong>{' '}
                <span className={selectedNode.data.urgency === 'HIGH' ? 'text-rose-500 font-bold' : ''}>
                  {selectedNode.data.urgency}
                </span>
              </p>
            </div>
          )}

          {selectedNode.type === 'ngo' && (
            <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300 mb-3">
              <p>
                <strong>Type:</strong> {selectedNode.data.type}
              </p>
              <p>
                <strong>Daily Capacity:</strong> {selectedNode.data.capacityMealsDaily} meals
              </p>
              <p>
                <strong>Current Demand:</strong> {selectedNode.data.currentDemandMeals} meals
              </p>
              <p>
                <strong>Contact:</strong> {selectedNode.data.contactPerson} ({selectedNode.data.contactPhone})
              </p>
            </div>
          )}

          {selectedNode.type === 'courier' && (
            <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300 mb-3">
              <p>
                <strong>Vehicle:</strong> {selectedNode.data.vehicleType}
              </p>
              <p>
                <strong>Completed Pickups:</strong> {selectedNode.data.completedPickups}
              </p>
              <p>
                <strong>Impact Score:</strong> {selectedNode.data.impactScore} / 100
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (selectedNode.type === 'provider') setCurrentView('food-surplus');
                else if (selectedNode.type === 'ngo') setCurrentView('ngos');
                else setCurrentView('pickups');
              }}
              className="w-full py-1.5 px-3 rounded-full bg-[#070e6a] dark:bg-[#ffe537] text-white dark:text-slate-950 text-xs font-semibold hover:brightness-105 transition-all text-center"
            >
              Open Full Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
