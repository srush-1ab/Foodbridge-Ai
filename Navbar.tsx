import React, { useState } from 'react';
import {
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  PlusCircle,
  ArrowRight,
  ChevronDown,
  Building2,
  Heart,
  Truck,
  Award,
} from 'lucide-react';
import { Logo } from './Logo';
import { useFoodBridge } from '../../hooks/useFoodBridge';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    switchRole,
    currentView,
    setCurrentView,
    unreadCount,
    darkMode,
    setDarkMode,
    addToast,
  } = useFoodBridge();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const isLanding = currentView === 'landing';

  const navLinks = [
    { label: 'Surplus', view: 'food-surplus' },
    { label: 'Predictor', view: 'ai-predictor' },
    { label: 'NGOs', view: 'ngos' },
    { label: 'Deliveries', view: 'pickups' },
    { label: 'Impact', view: 'impact' },
  ];

  const roleDetails: Record<UserRole, { label: string; desc: string; icon: any; color: string }> = {
    provider: { label: 'Provider', desc: 'ABC College Hostel', icon: Building2, color: 'text-[#4855fe] bg-[#4855fe]/10' },
    ngo: { label: 'NGO', desc: 'Hope Community Kitchen', icon: Heart, color: 'text-[#e04e00] bg-[#ff5a00]/10' },
    volunteer: { label: 'Courier', desc: 'Electric Cargo Squad', icon: Truck, color: 'text-emerald-600 bg-emerald-500/10' },
    admin: { label: 'Admin', desc: 'Sustainability Alliance', icon: Award, color: 'text-amber-700 bg-[#ffe537]/40' },
  };

  const handleNavClick = (view: string) => {
    setMobileMenuOpen(false);
    setCurrentView(view);
  };

  const iconBtn =
    'relative p-2 rounded-full text-white/90 hover:text-[#ffe537] hover:bg-white/10 transition-colors';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#4855fe] dark:bg-[#070e6a] text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-[72px] flex items-center justify-between gap-4">
        <button onClick={() => setCurrentView('landing')} className="shrink-0 text-left focus:outline-hidden">
          <span className="sm:hidden"><Logo size="sm" light /></span>
          <span className="hidden sm:block"><Logo size="md" light /></span>
        </button>

        <nav className="hidden lg:flex items-center gap-8 text-sm">
          {navLinks.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`py-1 whitespace-nowrap font-semibold border-b-2 transition-colors ${
                  isActive
                    ? 'text-[#ffe537] border-[#ffe537]'
                    : 'text-white border-transparent hover:text-[#ffe537]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={() => setDarkMode(!darkMode)} aria-label="Toggle color theme" className={iconBtn}>
            {darkMode ? <Sun className="w-[18px] h-[18px] text-[#ffe537]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>

          <button onClick={() => setCurrentView('notifications')} aria-label="Open notifications" className={iconBtn}>
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#ff5a00] ring-2 ring-[#4855fe] dark:ring-[#070e6a]" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-full border border-white/50 hover:bg-white/10 text-xs font-semibold transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#ffe537]" />
              <span className="hidden sm:inline">{roleDetails[currentRole].label}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#0d1360] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-2 z-50">
                <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Switch role
                </p>
                {(['provider', 'ngo', 'volunteer', 'admin'] as UserRole[]).map((r) => {
                  const info = roleDetails[r];
                  const Icon = info.icon;
                  const isActive = currentRole === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setRoleDropdownOpen(false);
                        addToast('Role switched', `Now ${info.label}.`, 'info');
                      }}
                      className={`w-full text-left p-2 rounded-2xl text-xs flex items-center gap-3 transition-colors ${
                        isActive ? 'bg-[#4855fe]/10 font-bold' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${info.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold leading-tight">{info.label}</p>
                        <p className="text-[10px] text-slate-400 truncate">{info.desc}</p>
                      </div>
                      {isActive && <span className="w-2 h-2 rounded-full bg-[#4855fe] dark:bg-[#ffe537]" />}
                    </button>
                  );
                })}
                <div className="border-t border-slate-100 dark:border-white/10 mt-1 pt-1">
                  <button
                    onClick={() => { setRoleDropdownOpen(false); setCurrentView('profile'); }}
                    className="w-full text-left px-3 py-2 rounded-2xl text-xs hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { setRoleDropdownOpen(false); setCurrentView('auth'); }}
                    className="w-full text-left px-3 py-2 rounded-2xl text-xs hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            )}
          </div>

          {isLanding ? (
            <button onClick={() => setCurrentView('overview')} className="hidden sm:inline-flex fb-btn-yellow">
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button onClick={() => setCurrentView('create-surplus')} className="hidden sm:inline-flex fb-btn-yellow">
              <PlusCircle className="w-4 h-4" />
              <span>Post</span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            className={`lg:hidden ${iconBtn}`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fb-overlay lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="absolute top-5 right-5 p-2 text-white hover:text-[#ffe537]"
          >
            <X className="w-8 h-8" />
          </button>
          {navLinks.map((item) => (
            <button key={item.view} onClick={() => handleNavClick(item.view)} className="link">
              {item.label}
            </button>
          ))}
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => { setMobileMenuOpen(false); setCurrentView('create-surplus'); }}
              className="fb-btn-yellow"
            >
              Post Surplus
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); setCurrentView('overview'); }}
              className="fb-btn-ghost"
            >
              Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
