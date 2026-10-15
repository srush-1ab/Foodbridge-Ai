import React from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Truck,
  Sparkles,
  Check,
} from 'lucide-react';
import { useFoodBridge } from '../hooks/useFoodBridge';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentView,
  } = useFoodBridge();

  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'accepted':
        return <HeartHandshake className="w-4 h-4 text-indigo-500 dark:text-[#9ea6ff]" />;
      case 'volunteer':
        return <Truck className="w-4 h-4 text-emerald-500" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-teal-500 dark:text-[#9ea6ff]" />;
      case 'ai_insight':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="fb-heading fb-heading-left text-3xl sm:text-4xl text-[#070e6a] dark:text-white">
            Notifications
          </h1>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors self-start sm:self-auto"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              markNotificationRead(item.id);
              if (item.targetView) setCurrentView(item.targetView);
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              !item.read
                ? 'bg-white dark:bg-[#0d1360] border-[#4855fe]/40 shadow-xs'
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
            }`}
          >
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
              {getIcon(item.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {item.title}
                </h3>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                  {item.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {item.message}
              </p>
            </div>

            {!item.read && (
              <span className="w-2 h-2 rounded-full bg-[#4855fe] shrink-0 mt-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
