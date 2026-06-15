"use client";

import { useState, FormEvent } from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { useGenerateCart } from "@/hooks/useGenerateCart";

export function SituationInput() {
  const [situation, setSituation] = useState("");
  const { generate, isLoading } = useGenerateCart();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    generate(situation, 'home');
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-[#d5d9d9] p-4 sm:p-5">
        {/* AI badge */}
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles className="h-4 w-4 text-[#ff9900]" />
          <span className="text-xs font-semibold text-[#565959] uppercase tracking-wide">
            AI-powered cart builder
          </span>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1">
            <input
              type="text"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="What's your situation today?"
              className="w-full h-11 sm:h-12 px-4 text-sm sm:text-base rounded-md border border-[#888c8c] bg-white placeholder:text-[#888c8c] text-[#0f1111] focus:outline-none focus:ring-2 focus:ring-[#ff9900] focus:border-[#ff9900] transition-all"
              disabled={isLoading}
              aria-label="Describe your situation"
              minLength={3}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || situation.trim().length < 3}
            className="h-11 sm:h-12 px-6 rounded-md btn-amazon-yellow font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-[0.97] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[140px]"
            aria-label="Generate cart"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Generate Cart
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Validation hint */}
        {situation.length > 0 && situation.trim().length < 3 && (
          <p className="text-xs text-[#565959] mt-2">
            Type at least 3 characters to describe your situation
          </p>
        )}

        {/* Loading state */}
        {isLoading && (
          <p className="text-sm text-[#ff9900] font-medium mt-3 animate-pulse text-center">
            ✨ AI is building your cart...
          </p>
        )}
      </div>
    </div>
  );
}
