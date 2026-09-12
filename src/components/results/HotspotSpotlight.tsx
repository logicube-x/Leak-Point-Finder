"use client";

import React from "react";
import { 
  Flame, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  Target,
  Sparkles,
  Info
} from "lucide-react";
import { Hotspot } from "@/types/assessment";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatEmissions, formatNumber } from "@/lib/utils";

export interface HotspotSpotlightProps {
  primary: Hotspot;
  secondary: Hotspot;
  totalTCO2e: number;
}

export function HotspotSpotlight({
  primary,
  secondary,
  totalTCO2e,
}: HotspotSpotlightProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Primary Hotspot Card */}
      <div className="relative overflow-hidden rounded-xl border-2 border-rose-500/80 bg-gradient-to-b from-rose-50/50 via-white to-white p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-rose-600 animate-ping" />
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              Primary Carbon Hotspot (#1 Driver)
            </span>
          </div>
          <Badge variant="critical" size="sm">
            {primary.severity} Severity
          </Badge>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {primary.source}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <Badge variant="outline" size="sm">{primary.categoryLabel}</Badge>
              <Badge variant="scope1" size="sm">{primary.scope}</Badge>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black font-mono text-rose-700">
              {primary.percentage}%
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              {formatEmissions(primary.tCO2e)}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-rose-100/70 space-y-2">
          <p className="text-xs text-slate-700 leading-relaxed">
            <strong className="font-semibold text-rose-900">Diagnostic Root Cause: </strong>
            {primary.keyDriver}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200/80">
            <TrendingUp className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="font-medium text-[11px]">
              Sector Benchmark: <strong className="font-bold">{primary.benchmarkComparison}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Hotspot Card */}
      <div className="relative overflow-hidden rounded-xl border border-amber-300 bg-gradient-to-b from-amber-50/40 via-white to-white p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Secondary Carbon Hotspot (#2 Driver)
            </span>
          </div>
          <Badge variant="warning" size="sm">
            {secondary.severity} Priority
          </Badge>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {secondary.source}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <Badge variant="outline" size="sm">{secondary.categoryLabel}</Badge>
              <Badge variant="scope2" size="sm">{secondary.scope}</Badge>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-700">
              {secondary.percentage}%
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              {formatEmissions(secondary.tCO2e)}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-100/70 space-y-2">
          <p className="text-xs text-slate-700 leading-relaxed">
            <strong className="font-semibold text-amber-950">Diagnostic Root Cause: </strong>
            {secondary.keyDriver}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100/80 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Target className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="font-medium text-[11px]">
              Sector Benchmark: <strong className="font-semibold">{secondary.benchmarkComparison}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
