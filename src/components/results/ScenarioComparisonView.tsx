"use client";

import React, { useState } from "react";
import { 
  TrendingDown, 
  Zap, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { ScenarioComparison, ScenarioMetrics, CountryInfo } from "@/types/assessment";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export interface ScenarioComparisonViewProps {
  scenarios: ScenarioComparison;
  country: CountryInfo;
  totalCO2e: number;
}

export function ScenarioComparisonView({
  scenarios,
  country,
  totalCO2e,
}: ScenarioComparisonViewProps) {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<"basic" | "balanced" | "maximum_reduction">("balanced");

  if (!scenarios) return null;

  const symbol = country?.currency_symbol || "$";
  const scenarioList: { key: "basic" | "balanced" | "maximum_reduction"; data: ScenarioMetrics; tag: string; variant: "secondary" | "success" | "warning" }[] = [
    { key: "basic", data: scenarios.basic, tag: "Low CAPEX / Quick Wins", variant: "secondary" },
    { key: "balanced", data: scenarios.balanced, tag: "Optimal ROI (Recommended)", variant: "success" },
    { key: "maximum_reduction", data: scenarios.maximum_reduction, tag: "Deep Decarbonization", variant: "warning" },
  ];

  const activeScenario = scenarios[selectedScenarioKey] || scenarios.balanced;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> Strategic Decarbonization Scenarios
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Scenario Trade-Off & Financial Comparison
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Compare 3 capital pathways evaluated specifically for {country?.name || "your region"} using local energy tariffs ({symbol}) and regional equipment multipliers.
            </p>
          </div>
          <Badge variant="success" size="md" className="self-start sm:self-auto font-mono text-sm py-1.5 px-3">
            Base Footprint: {totalCO2e.toLocaleString()} tCO₂e
          </Badge>
        </div>
      </div>


      {/* Side by Side Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarioList.map(({ key, data, tag, variant }) => {
          const isSelected = selectedScenarioKey === key;
          return (
            <Card
              key={key}
              onClick={() => setSelectedScenarioKey(key)}
              className={`p-5 cursor-pointer transition-all duration-200 relative border ${
                isSelected
                  ? "border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-md"
                  : "border-slate-200 bg-slate-50/50 hover:border-emerald-300 hover:bg-white"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 bg-emerald-600 text-white p-1 rounded-full shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}

              <div className="mb-4">
                <Badge variant={variant} size="sm" className="mb-2">
                  {tag}
                </Badge>
                <h4 className="font-bold text-slate-900 text-lg">{data.name}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{data.description}</p>
              </div>

              {/* Main Metrics */}
              <div className="space-y-3 border-t border-slate-100 pt-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">CO₂e Reduction:</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    -{data.co2e_reduction_percentage}% ({data.co2e_reduction_tco2e.toLocaleString()} tCO₂e)
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total Estimated CAPEX:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {symbol}{data.total_capex_local.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Annual Savings:</span>
                  <span className="font-mono font-semibold text-emerald-600">
                    {symbol}{data.total_annual_savings_local.toLocaleString()}/yr
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Simple Payback:</span>
                  <span className="font-semibold text-slate-900 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" /> {data.payback_years}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Active Scenario Detail Breakdown */}
      <Card className="p-6 border border-slate-200 bg-white">
        <h4 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          Included Interventions for {activeScenario.name}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeScenario.actions.map((actTitle, i) => (
            <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                {i + 1}
              </span>
              <span>{actTitle}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
