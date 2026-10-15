import React, { useState } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  SlidersHorizontal,
  Package,
  Layers,
  MapPin,
} from 'lucide-react';
import { useFoodBridge } from '../hooks/useFoodBridge';
import { FoodListingCard } from '../components/dashboard/FoodListingCard';
import { FoodListing, ListingStatus, FoodCategory } from '../types';

export const FoodSurplusPage: React.FC = () => {
  const { listings, setCurrentView, currentRole } = useFoodBridge();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxDistance, setMaxDistance] = useState<number>(10);

  const categories: (FoodCategory | 'All')[] = [
    'All',
    'Cooked Meals',
    'Bakery & Bread',
    'Fresh Produce',
    'Packaged Meals',
    'Dairy & Dessert',
    'Beverages',
  ];

  const tabs: { key: string; label: string; count?: number }[] = [
    { key: 'all', label: 'All Listings', count: listings.length },
    {
      key: 'urgent',
      label: 'Urgent',
      count: listings.filter((l) => l.status === 'urgent').length,
    },
    {
      key: 'active',
      label: 'Active',
      count: listings.filter((l) => l.status === 'active').length,
    },
    {
      key: 'accepted',
      label: 'Claimed',
      count: listings.filter((l) => l.status === 'accepted').length,
    },
    {
      key: 'completed',
      label: 'Completed',
      count: listings.filter((l) => l.status === 'completed').length,
    },
    {
      key: 'expired',
      label: 'Archived',
      count: listings.filter((l) => l.status === 'expired').length,
    },
  ];

  // Filtering logic
  const filteredListings = listings.filter((item) => {
    // Tab filter
    if (activeTab === 'urgent' && item.status !== 'urgent') return false;
    if (activeTab === 'active' && item.status !== 'active') return false;
    if (activeTab === 'accepted' && item.status !== 'accepted') return false;
    if (activeTab === 'completed' && item.status !== 'completed') return false;
    if (activeTab === 'expired' && item.status !== 'expired') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(q);
      const matchesProvider = item.providerName.toLowerCase().includes(q);
      const matchesDietary = item.dietaryType.toLowerCase().includes(q);
      if (!matchesTitle && !matchesProvider && !matchesDietary) return false;
    }

    // Category
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }

    // Distance
    if (item.distanceKm > maxDistance) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="fb-heading fb-heading-left text-3xl sm:text-4xl text-[#070e6a] dark:text-white">
            Food Surplus
          </h1>
        </div>

        <button
          onClick={() => setCurrentView('create-surplus')}
          className="flex items-center gap-2 py-2 px-4 rounded-full bg-[#4855fe] hover:bg-[#ffe537] hover:text-black text-white text-xs font-bold hover:brightness-105 shadow-sm transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish Surplus</span>
        </button>
      </div>

      {/* Filter Tabs (Functional segmented buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-[#070e6a] text-white dark:bg-[#ffe537] dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-mono ${
                    isActive
                      ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Search + Category + Max Distance Slider */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food, provider, diet"
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
          />
        </div>

        {/* Category Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Food Categories' : c}
              </option>
            ))}
          </select>
        </div>

        {/* Max Distance Slider */}
        <div className="sm:col-span-3 flex items-center gap-2 px-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span>Max Radius:</span>
              <span className="font-bold font-mono">{maxDistance} km</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#4855fe]"
            />
          </div>
        </div>
      </div>

      {/* Grid of Listings */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map((listing) => (
            <FoodListingCard
              key={listing.id}
              listing={listing}
              onFindReceiver={() => setCurrentView('ngos')}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Nothing nearby yet.
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            New listings will show up here.
          </p>
          <button
            onClick={() => {
              setActiveTab('all');
              setSearchQuery('');
              setSelectedCategory('All');
              setMaxDistance(15);
            }}
            className="text-xs font-semibold text-[#4855fe] hover:underline pt-2 dark:text-[#9ea6ff]"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};
