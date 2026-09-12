"use client";

import React from "react";
import { 
  PlusCircle, 
  ArrowRight, 
  Factory, 
  Flame, 
  TrendingDown, 
  ShieldCheck, 
  Layers, 
  BarChart3,
  Shirt,
  Anvil,
  Utensils,
  Construction,
  FlaskConical,
  CheckCircle2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HistoricalAssessment, IndustryType } from "@/types/assessment";
import { formatEmissions, formatNumber } from "@/lib/utils";

export interface DashboardOverviewProps {
  onStartAssessment: (industry?: IndustryType) => void;
  onViewHistory: () => void;
  onSelectHistoryItem?: (assessmentId: string) => void;
  recentHistory: HistoricalAssessment[];
}

export function DashboardOverview({
  onStartAssessment,
  onViewHistory,
  onSelectHistoryItem,
  recentHistory,
}: DashboardOverviewProps) {
  const industries: {
    id: IndustryType;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
    typicalHotspot: string;
    sampleReduction: string;
  }[] = [
    {
      id: "textile",
      name: "Textile Manufacturing",
      description: "Spinning, weaving, wet processing, chemical dyeing, boiler steam & effluent treatment.",
      icon: Shirt,
      accent: "text-blue-700 bg-blue-50 border-blue-200",
      typicalHotspot: "Grid Electricity / Synthetic Fibres",
      sampleReduction: "18-32% CO₂e",
    },
    {
      id: "steel",
      name: "Steel Manufacturing",
      description: "Blast furnaces, electric arc furnaces, coke/DRI reduction, graphite electrodes & scrap feed.",
      icon: Anvil,
      accent: "text-amber-700 bg-amber-50 border-amber-200",
      typicalHotspot: "Coke / DRI Direct Reduction",
      sampleReduction: "25-40% CO₂e",
    },
    {
      id: "food_processing",
      name: "Food Processing",
      description: "Industrial steam boilers, refrigeration gas leakage, packaging lifecycle & organic effluent.",
      icon: Utensils,
      accent: "text-emerald-700 bg-emerald-50 border-emerald-200",
      typicalHotspot: "Steam Generation / Refrigerants",
      sampleReduction: "15-28% CO₂e",
    },
    {
      id: "cement",
      name: "Cement Manufacturing",
      description: "Limestone calcination, rotary kiln fuels, clinker grinding, clinker replacement ratios.",
      icon: Construction,
      accent: "text-stone-700 bg-stone-100 border-stone-200",
      typicalHotspot: "Process Calcination / Kiln Coal",
      sampleReduction: "20-35% CO₂e",
    },
    {
      id: "chemical",
      name: "Chemical Manufacturing",
      description: "Petrochemical cracking, catalytic reactors, high-temperature synthesis, solvent recovery & flaring.",
      icon: FlaskConical,
      accent: "text-purple-700 bg-purple-50 border-purple-200",
      typicalHotspot: "Feedstock Crackers / Flare Gas",
      sampleReduction: "22-38% CO₂e",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-slide">
      {/* Top Welcome / Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-7 text-white shadow-md border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/20 backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>HackOut 2026 • AI-Powered Industrial Carbon Intelligence</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Industrial Carbon Hotspot Intelligence
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Diagnose multi-scope carbon emission hotspots across heavy industrial facilities.
            Enter multi-category operational data to instantly compute primary & secondary hotspots, 
            Pareto emission rankings, and actionable decarbonization pathways.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              onClick={() => onStartAssessment()}
              leftIcon={<PlusCircle className="w-5 h-5" />}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md hover:shadow-lg transition-all"
            >
              Start New Assessment
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onViewHistory}
              leftIcon={<BarChart3 className="w-4 h-4" />}
              className="bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              View Facility History ({recentHistory.length})
            </Button>
          </div>
        </div>

        {/* Subtle decorative grid overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none hidden md:block" />
      </div>

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Target Industries</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Factory className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">5</span>
            <span className="text-xs text-slate-500">Sectors Covered</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Textile, Steel, Food, Cement, Chem
          </p>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Hotspot Diagnostic</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-700">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">Dynamic</span>
            <Badge variant="danger" size="sm">Primary + Secondary</Badge>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Real-time sensitivity analysis
          </p>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Avg Reduction Potential</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">28.4%</span>
            <span className="text-xs text-emerald-600 font-semibold">CO₂e Abatement</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Targeted ROI & Payback analysis
          </p>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Data Integrity</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">Scopes 1-3</span>
            <Badge variant="success" size="sm">Full Scope</Badge>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            GHG Protocol & ISO 14064 alignment
          </p>
        </Card>
      </div>

      {/* Select Industry Flow Trigger */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Select an Industrial Sector to Begin Assessment
            </h3>
            <p className="text-xs text-slate-500">
              Dynamic multi-category input models tailored to specific industrial processes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.id}
                onClick={() => onStartAssessment(ind.id)}
                className="group relative cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-2xs transition-all hover:border-emerald-600 hover:shadow-md hover:-translate-y-0.5 text-left"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-lg border ${ind.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {ind.sampleReduction}
                  </span>
                </div>

                <h4 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {ind.name}
                </h4>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed min-h-[36px]">
                  {ind.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
                  <span className="text-[11px] text-slate-400">
                    Hotspot: <strong className="text-slate-600 font-semibold">{ind.typicalHotspot}</strong>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold group-hover:translate-x-1 transition-transform">
                    Start <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Historical Activity Preview */}
      {recentHistory.length > 0 && (
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Recent Facility Assessments</CardTitle>
              <CardDescription>
                Quick access to recent carbon hotspot diagnostics
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onViewHistory}>
              View All History <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-medium">
                    <th className="py-2.5 px-3">Facility</th>
                    <th className="py-2.5 px-3">Industry</th>
                    <th className="py-2.5 px-3">Period</th>
                    <th className="py-2.5 px-3 text-right">Total Emissions</th>
                    <th className="py-2.5 px-3">Primary Hotspot</th>
                    <th className="py-2.5 px-3 text-right">Confidence</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentHistory.slice(0, 4).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {item.facilityName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {item.industryName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono">
                        {item.reportingPeriod}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {formatEmissions(item.total_co2e)}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant="danger" size="sm">
                          {item.primaryHotspotName} ({item.primaryHotspotPercentage}%)
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-mono font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {item.confidenceScore}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectHistoryItem && onSelectHistoryItem(item.id)}
                          className="h-7 text-[11px] px-2"
                        >
                          View Results
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
