import React from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { useFoodBridge } from '../../hooks/useFoodBridge';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFoodBridge();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-[#0d1360] border border-slate-200 dark:border-slate-700 shadow-xl animate-in slide-in-from-right duration-200"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {isError && <XCircle className="w-4 h-4 text-rose-500" />}
              {isWarning && <AlertCircle className="w-4 h-4 text-amber-500" />}
              {!isSuccess && !isError && !isWarning && (
                <Info className="w-4 h-4 text-[#4855fe] dark:text-[#9ea6ff]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {toast.title}
              </p>
              {toast.message && (
                <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5 leading-snug">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
