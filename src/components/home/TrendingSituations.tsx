"use client";

import trending from "@/data/trending.json";
import { useGenerateCart } from "@/hooks/useGenerateCart";

export function TrendingSituations() {
  const { generate, isLoading } = useGenerateCart();

  return (
    <section className="w-full">
      <h2 className="text-lg font-bold text-[#0f1111] mb-3">
        Trending Situations
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {trending.map((situation, index) => (
          <button
            key={situation.id}
            onClick={() => generate(situation.title, 'trending')}
            disabled={isLoading}
            className="group text-left rounded-lg border border-[#d5d9d9] bg-white p-3.5 hover:shadow-md hover:border-[#ff9900] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed transition-all animate-fade-in-up"
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
            aria-label={`Generate cart for: ${situation.title}`}
          >
            <span className="text-2xl mb-2 block" role="img" aria-hidden="true">
              {situation.emoji}
            </span>
            <h3 className="font-semibold text-sm text-[#0f1111] group-hover:text-[#c45500] transition-colors leading-tight">
              {situation.title}
            </h3>
            <p className="text-xs text-[#565959] mt-1 leading-relaxed line-clamp-2">
              {situation.description}
            </p>
            <p className="text-[10px] text-[#ff9900] font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Generate cart →
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
