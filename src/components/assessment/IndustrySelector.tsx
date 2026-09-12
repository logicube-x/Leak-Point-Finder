"use client";

import React from "react";
import { 
  Shirt, 
  Anvil, 
  Utensils, 
  Construction, 
  FlaskConical, 
  CheckCircle,
  Flame,
  Layers,
  ArrowRight
} from "lucide-react";
import { IndustryType, IndustryMetadata } from "@/types/assessment";
import { INDUSTRIES_METADATA } from "@/services/assessmentService";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface IndustrySelectorProps {
  selectedIndustry: IndustryType | null;
  onSelect: (industry: IndustryType) => void;
}

export function IndustrySelector({
  selectedIndustry,
  onSelect,
}: IndustrySelectorProps) {
  const iconMap: Record<IndustryType, React.ComponentType<{ className?: string }>> = {
    textile: Shirt,
    steel: Anvil,
    food_processing: Utensils,
    cement: Construction,
    chemical: FlaskConical,
  };

  const industries = Object.values(INDUSTRIES_METADATA);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          Step 1: Select Facility Industry Sector
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Each sector uses an ISO-aligned GHG Protocol activity model with custom input parameters and specific emission factors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {industries.map((ind) => {
          const Icon = iconMap[ind.id];
          const isSelected = selectedIndustry === ind.id;

          return (
            <div
              key={ind.id}
              onClick={() => onSelect(ind.id)}
              className={cn(
                "group relative cursor-pointer rounded-xl border p-5 transition-all duration-200 ease-out text-left flex flex-col justify-between h-full",
                isSelected
                  ? "border-emerald-600 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-500/20 hover:-translate-y-1 hover:shadow-md"
                  : "border-slate-200 bg-white hover:border-emerald-500 hover:bg-slate-50/40 hover:shadow-md hover:-translate-y-1"
              )}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "p-2.5 rounded-lg border transition-colors duration-200",
                      isSelected
                        ? "bg-emerald-700 text-white border-emerald-800 shadow-2xs"
                        : "bg-slate-100 text-slate-700 border-slate-200 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-200"
                    )}
                  >
                    <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
                  </div>
                  {isSelected && (
                    <Badge variant="success" size="sm" className="gap-1 font-semibold">
                      <CheckCircle className="w-3 h-3" /> Selected
                    </Badge>
                  )}
                </div>

                <h4 className="mt-3.5 text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors duration-150">
                  {ind.name}
                </h4>
                <p className="text-[11px] font-medium text-emerald-700 mt-0.5 group-hover:text-emerald-800 transition-colors duration-150">
                  {ind.tagline}
                </p>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed min-h-[36px]">
                  {ind.description}
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">
                    Typical Hotspots: <strong className="font-semibold text-slate-700">{ind.typicalHotspots[0]}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate text-slate-500">{ind.scopeFocus}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
