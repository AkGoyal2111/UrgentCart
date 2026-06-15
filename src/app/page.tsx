"use client";

import { SituationInput } from "@/components/home/SituationInput";
import { DemoPresets } from "@/components/home/DemoPresets";
import { EmergencyQuickActions } from "@/components/home/EmergencyQuickActions";
import { TrendingSituations } from "@/components/home/TrendingSituations";
import { ReplenishmentBanner } from "@/components/home/ReplenishmentBanner";

export default function Home() {
  return (
    <div className="min-h-full bg-[#eaeded]">
      {/* Hero section */}
      <section className="bg-gradient-to-b from-[#232f3e] to-[#eaeded] px-4 pt-6 pb-10 sm:pt-8 sm:pb-12">
        <div className="max-w-3xl mx-auto text-center mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
            What do you need right now?
          </h1>
          <p className="text-sm text-gray-300">
            Describe your situation and get a ready-to-order cart in seconds
          </p>
        </div>

        <SituationInput />
        <DemoPresets />
      </section>

      {/* Content sections */}
      <div className="px-4 py-5 space-y-5 max-w-5xl mx-auto">
        <ReplenishmentBanner />

        {/* Emergency section */}
        <section className="bg-white rounded-lg shadow-sm border border-[#d5d9d9] p-4">
          <EmergencyQuickActions />
        </section>

        {/* Trending section */}
        <section className="bg-white rounded-lg shadow-sm border border-[#d5d9d9] p-4">
          <TrendingSituations />
        </section>
      </div>
    </div>
  );
}
