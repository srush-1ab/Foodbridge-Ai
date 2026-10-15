import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Heart,
  Truck,
  Award,
  Lock,
  Mail,
  User as UserIcon,
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { useFoodBridge } from '../hooks/useFoodBridge';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const { switchRole, setCurrentView, addToast } = useFoodBridge();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('provider');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole(role);
    addToast(
      isRegister ? 'Account created' : 'Signed in',
      `Welcome to FoodBridge AI (${role} mode).`,
      'success'
    );
    setCurrentView('overview');
  };

  const demoAccounts: { role: UserRole; name: string; org: string; icon: any }[] = [
    {
      role: 'provider',
      name: 'Rahul Sharma',
      org: 'ABC College Hostel',
      icon: Building2,
    },
    {
      role: 'ngo',
      name: 'Ananya Deshmukh',
      org: 'Hope Community Kitchen',
      icon: Heart,
    },
    {
      role: 'volunteer',
      name: 'Arjun Mehta',
      org: 'Rapid Rescue Couriers',
      icon: Truck,
    },
    {
      role: 'admin',
      name: 'Dr. Sunita Rao',
      org: 'City Operations Coordinator',
      icon: Award,
    },
  ];

  return (
    <div className="flex-1 fb-hero dark:bg-[#050836] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-4xl bg-white dark:bg-[#0d1360] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Branding Hero Column */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#070e6a] to-[#0a1180] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <Logo size="lg" showTagline light />

            <div className="space-y-3 pt-6">
              <h2 className="text-3xl leading-tight">
                Predict surplus before it becomes waste.
              </h2>
            </div>
          </div>

          {/* Quick Demo Accounts Block */}
          <div className="relative z-10 pt-8 border-t border-white/10 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-teal-300">
              Quick sign in
            </p>
            <div className="space-y-1.5">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.role}
                    onClick={() => {
                      switchRole(acc.role);
                      addToast('Signed in', `${acc.name} · ${acc.org}`, 'info');
                      setCurrentView('overview');
                    }}
                    className="w-full text-left p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-[#4855fe] dark:text-[#9ea6ff]" />
                      <span className="font-semibold">{acc.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-300 capitalize">{acc.role}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {isRegister ? 'Register' : 'Sign in'}
              </h3>

              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs font-semibold text-[#4855fe] hover:underline dark:text-[#9ea6ff]"
              >
                {isRegister ? 'Have an account? Sign in' : 'New here? Register'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#4855fe]"
                  >
                    <option value="provider">Provider</option>
                    <option value="ngo">NGO</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-full bg-[#4855fe] hover:bg-[#ffe537] hover:text-black text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{isRegister ? 'Register' : 'Sign in'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={() => setCurrentView('landing')}
              className="hover:text-slate-600 dark:hover:text-slate-200 underline underline-offset-2"
            >
              ← Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
