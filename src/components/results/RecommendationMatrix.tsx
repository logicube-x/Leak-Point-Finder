"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  DollarSign, 
  TrendingDown, 
  Clock, 
  Layers, 
  Recycle, 
  CheckCircle2, 
  Zap, 
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { Recommendation } from "@/types/assessment";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatEmissions, formatNumber, cn } from "@/lib/utils";

export interface RecommendationMatrixProps {
  recommendations: Recommendation[];
}

export function RecommendationMatrix({
  recommendations,
}: RecommendationMatrixProps) {
  const [selectedTier, setSelectedTier] = useState<string>("all");

  const filteredRecs =
    selectedTier === "all"
      ? recommendations
      : recommendations.filter((r) => r.tier.toLowerCase().includes(selectedTier));

  const getDifficultyBadgeVariant = (diff: string) => {
    if (diff === "Low") return "success";
    if (diff === "Medium") return "warning";
    return "danger";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Actionable Decarbonization & Hotspot Mitigation Roadmap
          </h3>
          <p className="text-xs text-slate-500">
            Targeted technical interventions prioritized by abatement potential, CAPEX, and payback ROI.
          </p>
        </div>

        {/* Tier filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start">
          {["all", "quick win", "modernization", "deep"].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-md transition-all capitalize",
                selectedTier === tier
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              {tier === "all" ? "All Pathways" : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Recommendation Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRecs.map((rec, index) => (
          <Card
            key={rec.id}
            className="border-slate-200 overflow-hidden shadow-2xs hover:border-slate-300 transition-all"
          >
            <div className="p-5">
              {/* Header row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" size="sm" className="bg-slate-900 text-white font-semibold">
                      {rec.tier}
                    </Badge>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Target: {rec.targetHotspot}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 pt-1">
                    {rec.title}
                  </h4>
                </div>

                {/* Qualitative Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                    <span className="text-slate-400">Difficulty:</span>
                    <Badge variant={getDifficultyBadgeVariant(rec.difficulty)} size="sm">
                      {rec.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                    <span className="text-slate-400">CAPEX:</span>
                    <strong className="font-semibold text-slate-800">{rec.capitalLevel}</strong>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 bg-emerald-50/60 px-2 py-1 rounded border border-emerald-200">
                    <Recycle className="w-3 h-3 text-emerald-600" />
                    <span className="font-semibold text-emerald-800">{rec.circularity}</span>
                  </div>
                </div>
              </div>

              {/* Action Plan & Technical Rationale */}
              <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Technical Rationale:
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed mt-0.5">
                      {rec.whyRelevant}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Implementation Action:
                    </span>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed mt-0.5">
                      {rec.actionPlan}
                    </p>
                  </div>
                </div>

                {/* Quantitative Impact Box */}
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/90 space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500">Estimated CAPEX:</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {rec.impact.estimatedCostRange}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500">CO₂e Abatement:</span>
                    <span className="font-mono font-bold text-emerald-700 text-xs">
                      -{rec.impact.potentialCo2ReductionPercent}% ({formatEmissions(rec.impact.potentialCo2ReductionTons)})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500">Annual Energy/Fuel Savings:</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {formatCurrency(rec.impact.annualSavingsUSD)}/yr
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500">Payback Period:</span>
                    <Badge variant="success" size="sm" className="font-mono font-bold">
                      {rec.impact.paybackPeriodYears}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
