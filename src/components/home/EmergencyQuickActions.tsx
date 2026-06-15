"use client";

import Link from "next/link";
import emergencies from "@/data/emergencies.json";

export function EmergencyQuickActions() {
  const topEmergencies = emergencies.slice(0, 4);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-[#0f1111]">
          Emergency Kits
        </h2>
        <Link href="/emergency" className="text-xs font-medium text-[#007185] hover:text-[#c45500] hover:underline">
          See all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {topEmergencies.map((emergency) => (
          <Link
            key={emergency.id}
            href={`/emergency/${emergency.id}`}
            className="group rounded-lg border border-[#d5d9d9] bg-white p-3 hover:shadow-md hover:border-[#cc0c39]/30 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl" role="img" aria-label={emergency.title}>
                {emergency.icon}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-[#0f1111] group-hover:text-[#c45500] transition-colors truncate">
                  {emergency.title}
                </h3>
                <span className="text-[10px] text-[#565959]">
                  {emergency.itemCount} items
                </span>
              </div>
            </div>
            <p className="text-xs text-[#565959] leading-relaxed line-clamp-2">
              {emergency.description}
            </p>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-[10px] font-semibold text-[#007600] bg-[#007600]/5 px-1.5 py-0.5 rounded">
                ⚡ Instant
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
