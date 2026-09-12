"use client";

import React, { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Flame, 
  ShieldCheck, 
  PlusCircle, 
  History, 
  Download, 
  Share2, 
  Layers, 
  TrendingDown, 
  BarChart3,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";
import { AssessmentResult } from "@/types/assessment";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { HotspotSpotlight } from "./HotspotSpotlight";
import { EmissionsBreakdownChart } from "./EmissionsBreakdownChart";
import { ScopeDistributionChart } from "./ScopeDistributionChart";
import { RecommendationMatrix } from "./RecommendationMatrix";
import { formatEmissions, formatNumber } from "@/lib/utils";

export interface ResultsViewProps {
  result: AssessmentResult;
  onNewAssessment: () => void;
  onViewHistory: () => void;
}

export function ResultsView({
  result,
  onNewAssessment,
  onViewHistory,
}: ResultsViewProps) {
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Carbon_Assessment_${result.facilityName.replace(/\s+/g, "_")}_${result.reportingPeriod}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-slide">
      {/* Top Action & Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 w-fit mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Diagnostic Execution Complete • GHG Protocol Scope 1-3 Verified</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {result.facilityName}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {result.facilityLocation}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {result.reportingPeriod}
            </span>
            <span>•</span>
            <Badge variant="success" size="sm">
              {result.industryName}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJSON}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Audit JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewHistory}
            leftIcon={<History className="w-3.5 h-3.5" />}
          >
            History Log
          </Button>
          <Button
            size="sm"
            onClick={onNewAssessment}
            leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
          >
            New Assessment
          </Button>
        </div>
      </div>

      {/* Hero KPI Summary Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Carbon Footprint */}
        <Card className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Carbon Footprint</span>
            <Badge variant="danger" size="sm">Scopes 1, 2 & 3</Badge>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-emerald-400">
              <AnimatedCounter value={result.total_co2e} decimals={1} suffix=" tCO₂e" />
            </div>
            <p className="mt-1 text-[11px] text-slate-300">
              Total greenhouse gas emissions in reporting period
            </p>
          </div>
        </Card>

        {/* Specific Carbon Intensity */}
        <Card className="p-5 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Carbon Intensity</span>
            <Badge variant="outline" size="sm">Specific KPI</Badge>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              <AnimatedCounter value={result.carbonIntensity} decimals={2} />
              <span className="text-xs font-normal text-slate-500 ml-1">tCO₂e / unit</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Normalized per {result.productionUnit}
            </p>
          </div>
        </Card>

        {/* Primary Hotspot Dominance */}
        <Card className="p-5 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Primary Hotspot Share</span>
            <Badge variant="danger" size="sm">Key Driver</Badge>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-600">
              <AnimatedCounter value={result.primary_hotspot.percentage} decimals={1} suffix="%" />
            </div>
            <p className="mt-1 text-[11px] font-medium text-slate-700 truncate">
              {result.primary_hotspot.source}
            </p>
          </div>
        </Card>

        {/* Data Confidence Score */}
        <Card className="p-5 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Data Confidence Score</span>
            <Badge variant="success" size="sm">{result.confidence.level}</Badge>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700">
              <AnimatedCounter value={result.confidence.score} decimals={0} suffix="%" />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {result.confidence.verifiedPointsCount} verified input points processed
            </p>
          </div>
        </Card>
      </div>

      {/* Hotspot Spotlight (Primary & Secondary) */}
      <HotspotSpotlight
        primary={result.primary_hotspot}
        secondary={result.secondary_hotspot}
        totalTCO2e={result.total_co2e}
      />

      {/* Charts Section: Pareto Breakdown + Scope Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EmissionsBreakdownChart sources={result.emission_breakdown} />
        <ScopeDistributionChart scopeBreakdown={result.scope_breakdown} />
      </div>

      {/* Emission-Source Ranking Table */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Emission Source Diagnostic Ledger</CardTitle>
            <CardDescription>
              Complete ranking of all facility emission vectors with scope and intensity mapping
            </CardDescription>
          </div>
          <Badge variant="outline" size="sm">
            {result.emission_breakdown.length} Vectors Tracked
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold">
                  <th className="py-2.5 px-4">Rank</th>
                  <th className="py-2.5 px-4">Emission Vector</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Scope</th>
                  <th className="py-2.5 px-4 text-right">Reported Activity</th>
                  <th className="py-2.5 px-4 text-right">Calculated tCO₂e</th>
                  <th className="py-2.5 px-4 text-right">Share (%)</th>
                  <th className="py-2.5 px-4">Contribution Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {result.emission_breakdown.map((src, idx) => (
                  <tr
                    key={src.id}
                    className={
                      src.isHotspot
                        ? idx === 0
                          ? "bg-rose-50/40 hover:bg-rose-50/70"
                          : "bg-amber-50/40 hover:bg-amber-50/70"
                        : "hover:bg-slate-50/60"
                    }
                  >
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-500">
                      #{idx + 1}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      {src.name}
                      {idx === 0 && (
                        <Badge variant="critical" size="sm">Primary Hotspot</Badge>
                      )}
                      {idx === 1 && (
                        <Badge variant="warning" size="sm">Secondary Hotspot</Badge>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{src.categoryLabel}</td>
                    <td className="py-2.5 px-4">
                      <Badge
                        variant={
                          src.scope === "Scope 1"
                            ? "scope1"
                            : src.scope === "Scope 2"
                            ? "scope2"
                            : "scope3"
                        }
                        size="sm"
                      >
                        {src.scope}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                      {formatNumber(src.value, 1)} {src.unit}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      {formatEmissions(src.tCO2e)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      {src.percentage}%
                    </td>
                    <td className="py-2.5 px-4 w-32">
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            idx === 0
                              ? "bg-rose-600"
                              : idx === 1
                              ? "bg-amber-500"
                              : "bg-emerald-600"
                          }`}
                          style={{ width: `${Math.min(100, src.percentage)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Decarbonization Recommendations Matrix */}
      <RecommendationMatrix recommendations={result.recommendations} />
    </div>
  );
}
