import React, { useState } from 'react';
import {
  ArrowRight,
  TrendingDown,
  Clock,
  Network,
  Scale,
  HeartHandshake,
  Truck,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { useFoodBridge } from '../hooks/useFoodBridge';
import { WhatIfSimulator } from '../components/dashboard/WhatIfSimulator';
import { GoogleMapView } from '../components/common/GoogleMapView';
import { Logo } from '../components/common/Logo';

const STATS = [
  { img: 'slider-img1.png', value: '12,850+', label: 'Meals rescued' },
  { img: 'slider-img2.png', value: '4,320 kg', label: 'Food saved' },
  { img: 'slider-img3.png', value: '182', label: 'Providers' },
  { img: 'slider-img4.png', value: '64', label: 'NGOs' },
];

const PROBLEMS = [
  { icon: TrendingDown, label: 'Unpredictable demand' },
  { icon: Clock, label: 'Short shelf life' },
  { icon: Network, label: 'Disconnected kitchens' },
  { icon: Scale, label: 'Over-catering' },
];

const STEPS = [
  { title: 'Predict', img: 'r1.jpg', view: 'ai-predictor', text: 'Forecast surplus 8 hours ahead.' },
  { title: 'Match', img: 'r2.jpg', view: 'ngos', text: 'Find the best NGO within 5 km.' },
  { title: 'Rescue', img: 'r3.jpg', view: 'pickups', text: 'Volunteers pick up, live tracked.' },
  { title: 'Impact', img: 'n1.jpg', view: 'impact', text: 'ESG and emissions, logged.' },
];

export const LandingPage: React.FC = () => {
  const { setCurrentView, switchRole } = useFoodBridge();
  const [activeRoleTab, setActiveRoleTab] = useState<'provider' | 'ngo' | 'volunteer'>('provider');

  const roleTabs = [
    {
      id: 'provider' as const,
      tab: 'Providers',
      icon: Building2,
      title: 'Hostels, restaurants, hotels',
      points: ['Demand forecasting', 'One-click surplus listing', 'Auto ESG receipts'],
      cta: 'Provider dashboard',
      onClick: () => { switchRole('provider'); setCurrentView('overview'); },
    },
    {
      id: 'ngo' as const,
      tab: 'NGOs',
      icon: HeartHandshake,
      title: 'Shelters and pantries',
      points: ['Transparent match scores', 'One-tap claim', 'Live courier ETA'],
      cta: 'NGO dashboard',
      onClick: () => { switchRole('ngo'); setCurrentView('overview'); },
    },
    {
      id: 'volunteer' as const,
      tab: 'Couriers',
      icon: Truck,
      title: 'Food rescue volunteers',
      points: ['Smart route sequencing', 'Thermal bag support', 'Impact leaderboard'],
      cta: 'Volunteer hub',
      onClick: () => { switchRole('volunteer'); setCurrentView('volunteer'); },
    },
  ];
  const role = roleTabs.find((r) => r.id === activeRoleTab)!;
  const RoleIcon = role.icon;

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="fb-hero pt-10 pb-44 md:pb-56 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
            Predict surplus.
            <br />
            <span className="text-[#ffe537]">Rescue more food.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/90">
            Predict it. Match it. Feed communities.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => setCurrentView('create-surplus')} className="fb-btn-yellow">
              Start rescuing <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => setCurrentView('food-surplus')} className="fb-btn-ghost">
              Browse food
            </button>
            <button onClick={() => setCurrentView('ai-predictor')} className="fb-btn-ghost">
              Try predictor
            </button>
          </div>
        </div>
      </section>

      {/* Stat bubbles overlapping the hero curve */}
      <section className="relative z-10 -mt-40 md:-mt-52 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {STATS.map((s, i) => (
            <div key={s.label} className={`text-center ${i % 3 === 0 ? 'md:mt-10' : ''}`}>
              <div className="relative aspect-square rounded-full overflow-hidden border-[8px] border-[#1a1a19] shadow-xl">
                <img src={`/images/${s.img}`} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#070e6a]/55 flex flex-col items-center justify-center text-white">
                  <span className="font-bold text-xl sm:text-2xl">{s.value}</span>
                  <span className="text-[11px] sm:text-xs font-medium tracking-wide">{s.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-4 text-center">
        <h2 className="fb-heading text-3xl sm:text-4xl">Why food gets wasted</h2>
        <div className="max-w-4xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {PROBLEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <span className="fb-circle !w-14 !h-14">
                <Icon className="w-5 h-5" />
              </span>
              <p className="text-sm font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-4 pb-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="fb-heading text-3xl sm:text-4xl">How it works</h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.title} className="flex flex-col items-center">
                <img
                  src={`/images/${s.img}`}
                  alt=""
                  className="fb-img-leaf w-full aspect-[4/5] object-cover shadow-lg"
                />
                <div className="mt-4 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-[#ff5a00]">0{i + 1}</span>
                  <h3 className="font-display text-xl">{s.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-300">{s.text}</p>
                  <button
                    onClick={() => setCurrentView(s.view)}
                    aria-label={`Open ${s.title}`}
                    className="fb-circle mt-3"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulator on indigo wave */}
      <section className="fb-wave-dark py-32 md:py-48 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-4 space-y-5">
            <h2 className="text-3xl sm:text-4xl">
              <span className="text-[#ffe537]">Test the</span>
              <br />
              forecast
            </h2>
            <p className="text-sm text-white/90">Drag the slider. Watch surplus change.</p>
            <button
              onClick={() => {
                switchRole('provider');
                setCurrentView('ai-predictor');
              }}
              className="fb-btn-yellow"
            >
              Open predictor <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="lg:col-span-8">
            <WhatIfSimulator
              initialPrepared={500}
              expectedAttendance={450}
              historicalAvg={420}
              onApplySimulation={(prepared, surplus) => {
                switchRole('provider');
                setCurrentView('create-surplus');
              }}
            />
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="fb-heading text-3xl sm:text-4xl">One platform, three roles</h2>

          <div className="mt-8"><div className="inline-flex p-1 rounded-full bg-slate-100 dark:bg-white/10">
            {roleTabs.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRoleTab(r.id)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors ${
                  activeRoleTab === r.id
                    ? 'bg-[#4855fe] text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#4855fe]'
                }`}
              >
                {r.tab}
              </button>
            ))}
          </div></div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center text-left">
            <img
              src="/images/about-img.jpg"
              alt=""
              className="fb-img-leaf w-full max-h-80 object-cover shadow-lg order-2 md:order-1"
            />
            <div className="order-1 md:order-2 space-y-4">
              <span className="fb-circle !w-12 !h-12">
                <RoleIcon className="w-5 h-5" />
              </span>
              <h3 className="font-display text-2xl">{role.title}</h3>
              <ul className="space-y-2 text-sm">
                {role.points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4855fe] dark:text-[#ffe537]" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <button onClick={role.onClick} className="fb-btn-indigo">
                {role.cta} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="px-4 pb-20 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <h2 className="fb-heading text-3xl sm:text-4xl">Rescue map</h2>
          <button onClick={() => setCurrentView('food-surplus')} className="fb-btn-indigo">
            Browse surplus <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <GoogleMapView heightClass="h-96 md:h-[500px]" />
      </section>

      {/* CTA + footer */}
      <footer className="text-white text-center">
        <div className="bg-[#070e6a]" aria-hidden="true">
          <div className="h-16 md:h-24 bg-white dark:bg-[#050836] rounded-b-[50%_/_100%]" />
        </div>
        <div className="bg-[#070e6a] px-4 pt-14 pb-14">
          <h2 className="text-3xl sm:text-5xl">
            Turn surplus <span className="text-[#ffe537]">into support.</span>
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                switchRole('provider');
                setCurrentView('overview');
              }}
              className="fb-btn-yellow"
            >
              Launch FoodBridge
            </button>
            <button onClick={() => setCurrentView('food-surplus')} className="fb-btn-ghost">
              Live surplus
            </button>
          </div>
        </div>
        <div className="bg-[#070e6a] border-t border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-5">
            <Logo size="sm" light />
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {[
                ['Surplus', 'food-surplus'],
                ['Predictor', 'ai-predictor'],
                ['NGOs', 'ngos'],
                ['Deliveries', 'pickups'],
                ['Impact', 'impact'],
              ].map(([label, view]) => (
                <li key={view}>
                  <button onClick={() => setCurrentView(view)} className="hover:text-[#ffe537] transition-colors">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-xs text-white/60">© FoodBridge AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
