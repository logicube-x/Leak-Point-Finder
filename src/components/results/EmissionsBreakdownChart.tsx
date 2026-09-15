"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { EmissionSource } from "@/types/assessment";
import { ChartContainer } from "@/components/ui/ChartContainer";
import { Badge } from "@/components/ui/Badge";
import { formatEmissions, formatNumber, formatPercent } from "@/lib/utils";

export interface EmissionsBreakdownChartProps {
  sources: EmissionSource[];
}

interface BreakdownTooltipItem {
  payload: {
    fullName: string;
    categoryLabel: string;
    scope: string;
    tCO2e: number;
    percentage: number;
  };
}

interface BreakdownTooltipProps {
  active?: boolean;
  payload?: BreakdownTooltipItem[];
}

function CustomTooltip({ active, payload }: BreakdownTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1">
        <p className="font-bold text-slate-900">{data.fullName}</p>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-slate-500">Category:</span>
          <span className="font-medium text-slate-700">{data.categoryLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Scope:</span>
          <span className="font-medium text-slate-700">{data.scope}</span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-slate-100 font-mono">
          <span className="font-bold text-slate-900">{formatEmissions(data.tCO2e)}</span>
          <span className="font-extrabold text-emerald-700">{formatPercent(data.percentage)}</span>
        </div>
      </div>
    );
  }
  return null;
}

export function EmissionsBreakdownChart({ sources }: EmissionsBreakdownChartProps) {
  // Take top 8 emission sources for visual clarity
  const chartData = sources.slice(0, 8).map((s) => ({
    name: s.name.length > 22 ? `${s.name.substring(0, 20)}...` : s.name,
    fullName: s.name,
    tCO2e: s.tCO2e,
    percentage: Number(s.percentage),
    scope: s.scope,
    categoryLabel: s.categoryLabel,
    isHotspot: s.isHotspot,
  }));

  const getBarColor = (index: number, isHotspot: boolean) => {
    if (index === 0) return "#dc2626"; // Red (Primary Hotspot)
    if (index === 1) return "#d97706"; // Amber (Secondary Hotspot)
    if (index === 2) return "#047857"; // Emerald
    return "#475569"; // Slate
  };


  return (
    <ChartContainer
      title="Emissions Source Pareto Breakdown"
      subtitle="Ranked carbon contribution by specific process and energy vectors"
      badge={<Badge variant="outline" size="sm">Top Sources</Badge>}
      minHeight={290}
    >
      <ResponsiveContainer width="100%" height={290}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#64748b" }}
            unit=" t"
            tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "#334155" }}
            width={160}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="tCO2e" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(index, entry.isHotspot)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
