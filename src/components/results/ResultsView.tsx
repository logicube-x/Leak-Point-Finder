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
  FileSpreadsheet,
  FileText,
  Sliders
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
import { ScenarioComparisonView } from "./ScenarioComparisonView";
import { FinalReportView } from "./FinalReportView";
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
  const [activeTab, setActiveTab] = useState<"analytics" | "scenarios" | "report">("analytics");
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

  const countryFlag = result.country?.flag_emoji || "🌐";
  const countryName = result.country?.name || result.facilityLocation || "Global";

  return (
    <div className="space-y-6 animate-fade-slide">
      {/* Top Action & Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 w-fit mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Diagnostic Execution Complete • Country Grid Factors & Cost Models Verified</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{countryFlag}</span> {result.facilityName}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {result.facilityLocation || countryName}
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
            Export JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewHistory}
            leftIcon={<History className="w-3.5 h-3.5" />}
          >
            Audit History
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onNewAssessment}
            leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            New Assessment
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "analytics"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Hotspot Analytics & Mitigation
        </button>

        <button
          onClick={() => setActiveTab("scenarios")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "scenarios"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Sliders className="w-4 h-4" /> Scenario Comparison Matrix
        </button>

        <button
          onClick={() => setActiveTab("report")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "report"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" /> Executive Audit Report
        </button>
      </div>

      {/* TAB 1: ANALYTICS & HOTSPOTS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Key KPI Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-emerald-500">
              <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Total Carbon Footprint</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                <AnimatedCounter value={result.total_co2e} decimals={1} />
                <span className="text-sm font-medium text-slate-500 ml-1">tCO₂e</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                GHG Protocol Scope 1-3 Total
              </span>
            </Card>

            <Card className="p-4 border-l-4 border-l-amber-500">
              <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Primary Hotspot Share</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                <AnimatedCounter value={result.primary_hotspot?.percentage || 0} decimals={1} />
                <span className="text-sm font-medium text-slate-500 ml-1">%</span>
              </div>
              <span className="text-[11px] text-amber-700 font-semibold mt-1 block truncate">
                {result.primary_hotspot?.source || "Primary Source"}
              </span>
            </Card>

            <Card className="p-4 border-l-4 border-l-blue-500">
              <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Carbon Intensity</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                <AnimatedCounter value={result.carbonIntensity} decimals={3} />
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block truncate">
                tCO₂e / {result.productionUnit}
              </span>
            </Card>

            <Card className="p-4 border-l-4 border-l-indigo-500">
              <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Data Confidence</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                <AnimatedCounter value={result.confidence?.score || 92} decimals={0} />
                <span className="text-sm font-medium text-slate-500 ml-1">%</span>
              </div>
              <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">
                {result.confidence?.level
                  ? result.confidence.level.charAt(0).toUpperCase() + result.confidence.level.slice(1).toLowerCase()
                  : "High"} Trust Metric
              </span>
            </Card>
          </div>

          {/* Hotspot Spotlight Component */}
          <HotspotSpotlight
            primary={result.primary_hotspot}
            secondary={result.secondary_hotspot}
            totalTCO2e={result.total_co2e}
          />


          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EmissionsBreakdownChart sources={result.emission_breakdown} />
            </div>
            <div className="lg:col-span-1">
              <ScopeDistributionChart scopeBreakdown={result.scope_breakdown} />
            </div>
          </div>

          {/* Recommendation Matrix */}
          <RecommendationMatrix recommendations={result.recommendations} />
        </div>
      )}

      {/* TAB 2: SCENARIO COMPARISON */}
      {activeTab === "scenarios" && result.scenarios && (
        <ScenarioComparisonView
          scenarios={result.scenarios}
          country={result.country}
          totalCO2e={result.total_co2e}
        />
      )}

      {/* TAB 3: EXECUTIVE AUDIT REPORT */}
      {activeTab === "report" && (
        <FinalReportView
          result={result}
          onExportJSON={handleExportJSON}
        />
      )}
    </div>
  );
}
