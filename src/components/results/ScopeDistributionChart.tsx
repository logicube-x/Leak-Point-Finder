"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartContainer } from "@/components/ui/ChartContainer";
import { Badge } from "@/components/ui/Badge";
import { formatEmissions, formatNumber, formatPercent } from "@/lib/utils";

export interface ScopeDistributionChartProps {
  scopeBreakdown: {
    scope1: { tCO2e: number; percentage: number };
    scope2: { tCO2e: number; percentage: number };
    scope3: { tCO2e: number; percentage: number };
  };
}

interface TooltipPayloadItem {
  payload: {
    name: string;
    value: number;
    percentage: number;
    color: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1">
        <p className="font-bold text-slate-900">{item.name}</p>
        <div className="flex items-center justify-between gap-4 pt-1 font-mono">
          <span className="text-slate-600">{formatEmissions(item.value)}</span>
          <span className="font-bold text-emerald-700">{formatPercent(item.percentage)}</span>
        </div>
      </div>
    );
  }
  return null;
}

export function ScopeDistributionChart({
  scopeBreakdown,
}: ScopeDistributionChartProps) {
  const data = [
    {
      name: "Scope 1 (Direct Fuels & Calcination)",
      value: scopeBreakdown.scope1.tCO2e,
      percentage: Number(scopeBreakdown.scope1.percentage),
      color: "#2563eb", // Blue
    },
    {
      name: "Scope 2 (Purchased Electricity & Steam)",
      value: scopeBreakdown.scope2.tCO2e,
      percentage: Number(scopeBreakdown.scope2.percentage),
      color: "#9333ea", // Purple
    },
    {
      name: "Scope 3 (Upstream Feedstocks & Logistics)",
      value: scopeBreakdown.scope3.tCO2e,
      percentage: Number(scopeBreakdown.scope3.percentage),
      color: "#d97706", // Amber
    },
  ];

  return (
    <ChartContainer
      title="GHG Protocol Scope Distribution"
      subtitle="Breakdown across Direct (Scope 1), Indirect Energy (Scope 2), and Value Chain (Scope 3)"
      badge={<Badge variant="outline" size="sm">Scopes 1-3</Badge>}
      minHeight={290}
    >
      <ResponsiveContainer width="100%" height={290}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: 12, fontSize: 11 }}
            formatter={(value, entry: any) => (
              <span className="text-slate-700 font-medium">
                {value}: <strong className="font-mono">{formatPercent(entry.payload.percentage)}</strong>
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

