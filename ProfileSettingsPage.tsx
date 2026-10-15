import React, { useState } from 'react';
import {
  User as UserIcon,
  Building2,
  Mail,
  Phone,
  MapPin,
  Sliders,
  Moon,
  Sun,
  RotateCcw,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { useFoodBridge } from '../hooks/useFoodBridge';
import { UserRole } from '../types';

export const ProfileSettingsPage: React.FC = () => {
  const {
    currentUser,
    currentRole,
    switchRole,
    darkMode,
    setDarkMode,
    resetDemoData,
    addToast,
  } = useFoodBridge();

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    organization: currentUser.organization,
    phone: currentUser.phone,
    location: currentUser.location,
    pickupRadiusKm: currentUser.pickupRadiusKm || 10,
  });

  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>([
    'Vegetarian',
    'Cooked Meals',
  ]);

  const [notifSms, setNotifSms] = useState(true);
  const [notifPush, setNotifPush] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Profile Updated', 'Your organizational preferences are saved.', 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="fb-heading fb-heading-left text-3xl sm:text-4xl text-[#070e6a] dark:text-white">
          Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Profile Form */}
        <div className="md:col-span-7 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-[#070e6a] text-white flex items-center justify-center font-bold text-lg">
              {formData.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {formData.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                Active Role: <span className="text-[#4855fe] font-semibold dark:text-[#9ea6ff]">{currentRole}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Organization
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
              />
            </div>

            {/* Pickup Radius Slider */}
            <div className="pt-2">
              <div className="flex justify-between items-baseline mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Pickup radius
                </label>
                <span className="text-xs font-mono font-bold text-[#4855fe] dark:text-[#9ea6ff]">
                  {formData.pickupRadiusKm} km
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={25}
                value={formData.pickupRadiusKm}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pickupRadiusKm: parseInt(e.target.value, 10),
                  })
                }
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#4855fe]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-full bg-[#070e6a] dark:bg-[#ffe537] text-white dark:text-slate-950 text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </form>
        </div>

        {/* Right: System & Demo Settings */}
        <div className="md:col-span-5 space-y-6">
          {/* Theme & Display Preferences */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Preferences
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Theme Appearance
                </p>
                <p className="text-[11px] text-slate-400">
                  {darkMode ? 'Dark slate active' : 'Clean light active'}
                </p>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{darkMode ? 'Light' : 'Dark'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Urgent SMS
                </p>
                <p className="text-[11px] text-slate-400">Alerts for expiry &lt; 2 hrs</p>
              </div>
              <input
                type="checkbox"
                checked={notifSms}
                onChange={(e) => setNotifSms(e.target.checked)}
                className="w-4 h-4 rounded text-[#4855fe] accent-[#4855fe] dark:text-[#9ea6ff]"
              />
            </div>
          </div>

          {/* Simulation Dataset Management Panel */}
          <div className="p-5 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-3">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Demo data
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Changes are saved in your browser. Reset to reload sample data.
            </p>

            <button
              onClick={resetDemoData}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-white dark:bg-[#0d1360] border border-teal-300 dark:border-teal-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-teal-600 dark:text-[#9ea6ff]" />
              <span>Reset data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
