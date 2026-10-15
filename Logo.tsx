import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  light = false,
}) => {
  const iconSizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  const textSizes = { sm: 'text-xl', md: 'text-2xl', lg: 'text-3xl' };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${iconSizes[size]} flex items-center justify-center rounded-full bg-[#ffe537] shrink-0`}
      >
        <svg viewBox="0 0 36 36" fill="none" className="w-3/5 h-3/5">
          <path d="M5 26 C11 8 25 8 31 26" stroke="#070e6a" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="10" cy="20" r="2.6" fill="#4855fe" />
          <circle cx="26" cy="20" r="2.6" fill="#4855fe" />
          <line x1="4" y1="28" x2="32" y2="28" stroke="#070e6a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span
          className={`${textSizes[size]} font-display ${
            light ? 'text-white' : 'text-[#070e6a] dark:text-white'
          }`}
        >
          FoodBridge
          <span className={light ? 'text-[#ffe537]' : 'text-[#4855fe] dark:text-[#ffe537]'}> AI</span>
        </span>
        {showTagline && (
          <span className="text-[10px] font-medium opacity-70 tracking-widest uppercase mt-1">
            Predict · Prevent · Rescue
          </span>
        )}
      </div>
    </div>
  );
};
