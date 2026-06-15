'use client';

import { useGenerateCart } from '@/hooks/useGenerateCart';

const PRESETS = [
  { label: 'Guests Arriving', situation: 'guests arriving at home', icon: '🏠' },
  { label: 'Movie Night', situation: 'movie night at home', icon: '🍿' },
  { label: 'Exam Prep', situation: 'exam tomorrow need study fuel', icon: '📚' },
  { label: 'Weekend Trip', situation: 'weekend trip packing', icon: '🎒' },
  { label: 'House Party', situation: 'house party tonight', icon: '🥳' },
];

export function DemoPresets() {
  const { generate, isLoading } = useGenerateCart();

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
        ⚡ Quick Demo
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => generate(preset.situation, 'demo-preset')}
            disabled={isLoading}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#d5d9d9] bg-white text-sm font-medium text-[#0f1111] hover:bg-[#f7f8f8] hover:border-[#ff9900] hover:shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span>{preset.icon}</span>
            <span>{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
