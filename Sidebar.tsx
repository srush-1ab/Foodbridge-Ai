import React from 'react';
import {
  LayoutDashboard,
  Brain,
  Package,
  HeartHandshake,
  Truck,
  TrendingUp,
  Bell,
  Settings,
  PlusCircle,
  Building2,
} from 'lucide-react';
import { useFoodBridge } from '../../hooks/useFoodBridge';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { currentView, setCurrentView, currentUser, currentRole, unreadCount, listings, pickups } =
    useFoodBridge();

  const activeSurplusCount = listings.filter((l) => l.status === 'urgent' || l.status === 'active').length;
  const inTransitCount = pickups.filter((p) => p.status === 'in_transit' || p.status === 'assigned').length;

  const menuItems = [
    { id: 'overview', label: currentRole === 'admin' ? 'Command' : 'Overview', icon: LayoutDashboard, badge: null as string | null },
    { id: 'ai-predictor', label: 'Predictor', icon: Brain, badge: null },
    { id: 'food-surplus', label: 'Surplus', icon: Package, badge: activeSurplusCount > 0 ? String(activeSurplusCount) : null },
    { id: 'ngos', label: currentRole === 'ngo' ? 'Supplies' : 'NGOs', icon: HeartHandshake, badge: null },
    { id: 'pickups', label: 'Pickups', icon: Truck, badge: inTransitCount > 0 ? String(inTransitCount) : null },
    { id: 'impact', label: 'Impact', icon: TrendingUp, badge: null },
    { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadCount > 0 ? String(unreadCount) : null, alert: true },
    { id: 'profile', label: 'Profile', icon: Settings, badge: null },
  ];

  return (
    <aside className={`w-60 shrink-0 flex flex-col justify-between gap-6 py-6 pl-4 pr-2 select-none ${className}`}>
      <div className="space-y-5">
        <button
          onClick={() => setCurrentView('create-surplus')}
          className="w-full fb-btn-indigo !py-3"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Surplus</span>
        </button>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#4855fe] text-white shadow-md shadow-[#4855fe]/25'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-[#4855fe]/10 dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#ffe537]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </span>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full tabular-nums ${
                      item.alert ? 'bg-[#ff5a00] text-white' : 'bg-[#ffe537] text-black'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <button
        onClick={() => setCurrentView('profile')}
        className="w-full flex items-center gap-3 p-2 rounded-full hover:bg-[#4855fe]/10 dark:hover:bg-white/5 text-left transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-[#070e6a] text-[#ffe537] flex items-center justify-center text-sm font-bold shrink-0">
          {currentUser.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
            <Building2 className="w-3 h-3 shrink-0" />
            <span className="truncate">{currentUser.organization}</span>
          </p>
        </div>
      </button>
    </aside>
  );
};
