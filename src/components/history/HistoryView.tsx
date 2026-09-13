"use client";

import React, { useState } from "react";
import { 
  History, 
  PlusCircle, 
  BarChart3, 
  Search, 
  Filter, 
  Flame, 
  ArrowUpRight, 
  TrendingDown, 
  Layers, 
  Eye,
  Trash2,
  Calendar,
  Building2,
  Download
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { HistoricalAssessment, IndustryType } from "@/types/assessment";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ChartContainer } from "@/components/ui/ChartContainer";
import { formatEmissions, formatNumber, formatPercent } from "@/lib/utils";


export interface HistoryViewProps {
  history: HistoricalAssessment[];
  onStartNewAssessment: () => void;
  onSelectAssessment: (assessmentId: string) => void;
}

export function HistoryView({
  history,
  onStartNewAssessment,
  onSelectAssessment,
}: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState<string>("all");

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.industryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.primaryHotspotName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry =
      selectedIndustryFilter === "all" || item.industry === selectedIndustryFilter;
    return matchesSearch && matchesIndustry;
  });

  // Prepare chart comparison data
  const comparisonData = history.slice(0, 6).map((item) => ({
    name: item.facilityName.length > 18 ? `${item.facilityName.substring(0, 16)}...` : item.facilityName,
    fullName: item.facilityName,
    industry: item.industryName,
    period: item.reportingPeriod,
    total_co2e: item.total_co2e,
    hotspot: item.primaryHotspotName,
    confidence: item.confidenceScore,
  }));

  const totalHistoricalEmissions = history.reduce((acc, curr) => acc + curr.total_co2e, 0);
  const avgConfidence = history.length > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.confidenceScore, 0) / history.length)
    : 0;

  return (
    <div className="space-y-6 animate-fade-slide">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Facility Carbon Assessment Ledger & Benchmarks
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Audit logs, historical carbon footprint trajectories, and sector benchmark comparisons.
          </p>
        </div>

        <Button
          onClick={onStartNewAssessment}
          leftIcon={<PlusCircle className="w-4 h-4" />}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold self-start sm:self-auto"
        >
          Start New Assessment
        </Button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Assessed Facilities</span>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
            {history.length}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Across 5 heavy industry sectors</p>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Cumulative Audited Emissions</span>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
            {formatEmissions(totalHistoricalEmissions)}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">GHG Protocol verified footprint</p>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Mean Audit Confidence</span>
          <div className="mt-2 text-2xl font-bold text-emerald-700 font-mono">
            {avgConfidence}%
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Activity data completeness level</p>
        </Card>
      </div>

      {/* Cross-Facility Comparison Chart */}
      <ChartContainer
        title="Cross-Facility Carbon Footprint Comparison"
        subtitle="Comparative total emissions (tCO₂e) across assessed industrial facilities"
        badge={<Badge variant="outline" size="sm">Facility Benchmarking</Badge>}
        minHeight={280}
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={comparisonData}
            margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#475569" }}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
              unit=" t"
            />
            <Tooltip
              formatter={(val: any) => [`${formatEmissions(Number(val))}`, "Emissions"]}
              labelFormatter={(label, payload) => {
                if (payload && payload.length) {
                  return payload[0].payload.fullName;
                }
                return label;
              }}
            />
            <Bar dataKey="total_co2e" fill="#047857" radius={[4, 4, 0, 0]}>
              {comparisonData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 === 0 ? "#047857" : "#0f766e"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="p-4 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search facility, sector, or hotspot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter Sector:</span>
            <select
              value={selectedIndustryFilter}
              onChange={(e) => setSelectedIndustryFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
            >
              <option value="all">All Sectors</option>
              <option value="textile">Textile</option>
              <option value="steel">Steel</option>
              <option value="food_processing">Food Processing</option>
              <option value="cement">Cement</option>
              <option value="chemical">Chemical</option>
            </select>
          </div>
        </CardHeader>

        {/* History Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold">
                  <th className="py-2.5 px-4">Facility Name</th>
                  <th className="py-2.5 px-4">Sector</th>
                  <th className="py-2.5 px-4">Cycle</th>
                  <th className="py-2.5 px-4 text-right">Total Footprint</th>
                  <th className="py-2.5 px-4 text-right">Intensity</th>
                  <th className="py-2.5 px-4">Primary Hotspot</th>
                  <th className="py-2.5 px-4 text-right">Confidence</th>
                  <th className="py-2.5 px-4 text-center">Diagnostic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {item.facilityName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.industryName}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {item.reportingPeriod}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatEmissions(item.total_co2e)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      {formatNumber(item.carbonIntensity, 2)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="danger" size="sm">
                        {item.primaryHotspotName} ({formatPercent(item.primaryHotspotPercentage)})
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {item.confidenceScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectAssessment(item.id)}
                        className="h-7 text-[11px] px-2.5 text-emerald-800 hover:text-emerald-900 hover:bg-emerald-50 border-emerald-200"
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
