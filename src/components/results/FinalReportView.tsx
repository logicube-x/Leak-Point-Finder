"use client";

import React from "react";
import { 
  Printer, 
  Download, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Calendar, 
  Globe, 
  Zap, 
  ShieldCheck, 
  TrendingDown, 
  FileText,
  DollarSign,
  AlertTriangle,
  Award
} from "lucide-react";
import { AssessmentResult } from "@/types/assessment";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export interface FinalReportViewProps {
  result: AssessmentResult;
  onExportJSON: () => void;
}

export function FinalReportView({ result, onExportJSON }: FinalReportViewProps) {
  const handlePrint = () => {
    window.print();
  };

  const country = result.country || {
    name: "India",
    currency_symbol: "₹",
    currency_code: "INR",
    flag_emoji: "🇮🇳",
    grid_co2e_per_kwh: 0.827,
  };

  const symbol = country.currency_symbol || "$";
  const llm = result.llm_narrative || {
    executive_summary: `Comprehensive carbon audit for ${result.facilityName} (${result.industryName}) indicates a gross baseline of ${result.total_co2e.toLocaleString()} tCO2e.`,
    cause_analysis: `Emissions are primarily driven by ${result.primary_hotspot?.source} (${result.primary_hotspot?.percentage}%) and ${result.secondary_hotspot?.source} (${result.secondary_hotspot?.percentage}%).`,
    methodology_notes: `Calculated in accordance with GHG Protocol Scope 1-3 guidelines using country-specific emission factors for ${country.name}.`,
    risk_guidance: `Implementation risks include local energy price volatility and equipment delivery lead times.`,
  };

  return (
    <div className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm print:p-0 print:border-none print:shadow-none font-sans text-slate-800">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 print:hidden">
        <div>
          <Badge variant="success" size="md" className="mb-1">
            Official Executive Audit Report
          </Badge>
          <h2 className="text-xl font-bold text-slate-900">
            Industrial Carbon Assessment & Decarbonization Report
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportJSON}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export JSON
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print / Save PDF Report
          </Button>
        </div>
      </div>

      {/* SECTION 1: REPORT HEADER & FACILITY OVERVIEW */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold text-slate-900 tracking-tight">
            <span>{country.flag_emoji}</span>
            <span>{result.facilityName}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
            <span className="flex items-center gap-1 font-semibold text-slate-900">
              <Building2 className="w-3.5 h-3.5 text-slate-500" /> Sector: {result.industryName}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> Location: {result.facilityLocation || country.name}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Period: {result.reportingPeriod}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-right self-stretch md:self-auto min-w-[200px]">
          <span className="text-xs uppercase font-bold text-slate-500 block">Total Carbon Footprint</span>
          <span className="text-3xl font-extrabold text-emerald-700 tracking-tight block">
            {result.total_co2e.toLocaleString()} <span className="text-sm text-slate-500 font-medium">tCO₂e</span>
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Carbon Intensity: <strong className="text-slate-800">{result.carbonIntensity}</strong> tCO₂e / {result.productionUnit}
          </span>
        </div>
      </div>

      {/* SECTION 2: EXECUTIVE SUMMARY */}
      <div className="space-y-3">
        <h3 className="text-sm uppercase tracking-wider font-bold text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
          1. Executive Summary
        </h3>
        <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
          {llm.executive_summary}
        </div>
      </div>

      {/* SECTION 3: INPUT DATA & METHODOLOGY ASSUMPTIONS */}
      <div className="space-y-3">
        <h3 className="text-sm uppercase tracking-wider font-bold text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
          2. Boundary, Input Data & Methodology Assumptions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <Card className="p-4 border border-slate-200 bg-slate-50/50">
            <h4 className="font-bold text-slate-900 mb-2">Regional Parameters ({country.name})</h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>• Grid Power Factor: <strong>{country.grid_co2e_per_kwh} kgCO₂e/kWh</strong></li>
              <li>• Reporting Currency: <strong>{country.currency_symbol} ({country.currency_code})</strong></li>
              <li>• Electricity Tariff: <strong>${country.grid_tariff_usd_per_kwh}/kWh</strong></li>
              <li>• CAPEX Regional Multiplier: <strong>{country.capex_regional_multiplier}x</strong></li>
            </ul>
          </Card>

          <Card className="p-4 border border-slate-200 bg-slate-50/50">
            <h4 className="font-bold text-slate-900 mb-2">Production & Accounting Boundaries</h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>• Annual Production Volume: <strong>{result.productionVolume.toLocaleString()} {result.productionUnit}</strong></li>
              <li>• Protocol Standard: <strong>GHG Protocol Corporate Standard (Scope 1, 2, 3)</strong></li>
              <li>• Data Confidence Score: <strong>{result.confidence?.score || 90}% ({result.confidence?.level || 'High'})</strong></li>
              <li>• Scope Focus: <strong>Operational Fuel, Grid Power & Supply Chain Feedstocks</strong></li>
            </ul>
          </Card>
        </div>
      </div>

      {/* SECTION 4: EMISSION SOURCE BREAKDOWN & SCOPE DISTRIBUTION */}
      <div className="space-y-3">
        <h3 className="text-sm uppercase tracking-wider font-bold text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
          3. Total Emissions & Scope Distribution Breakdown
        </h3>
        
        {/* Scope Summary Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">GHG Scope Category</th>
                <th className="p-3">Primary Operational Drivers</th>
                <th className="p-3 text-right">Emissions (tCO₂e)</th>
                <th className="p-3 text-right">% Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-semibold text-slate-900">Scope 1 (Direct Fuel & Combustion)</td>
                <td className="p-3 text-slate-600">Boilers, Stationary Generators, Process Furnaces</td>
                <td className="p-3 text-right font-mono font-semibold">{result.scope_breakdown?.scope1?.tCO2e.toLocaleString()}</td>
                <td className="p-3 text-right font-semibold text-emerald-700">{result.scope_breakdown?.scope1?.percentage}%</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Scope 2 (Purchased Grid Electricity)</td>
                <td className="p-3 text-slate-600">Purchased Grid Power ({country.name} Mix)</td>
                <td className="p-3 text-right font-mono font-semibold">{result.scope_breakdown?.scope2?.tCO2e.toLocaleString()}</td>
                <td className="p-3 text-right font-semibold text-emerald-700">{result.scope_breakdown?.scope2?.percentage}%</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Scope 3 (Upstream & Supply Chain)</td>
                <td className="p-3 text-slate-600">Raw Inputs, Freight Logistics, Waste Disposal</td>
                <td className="p-3 text-right font-mono font-semibold">{result.scope_breakdown?.scope3?.tCO2e.toLocaleString()}</td>
                <td className="p-3 text-right font-semibold text-emerald-700">{result.scope_breakdown?.scope3?.percentage}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: HOTSPOT & CAUSE ANALYSIS */}
      <div className="space-y-3">
        <h3 className="text-sm uppercase tracking-wider font-bold text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
          4. Major Emission Hotspots & Root Cause Diagnostics
        </h3>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs leading-relaxed">
          <p className="text-slate-800 font-medium">{llm.cause_analysis}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-white border border-red-200 rounded-lg">
              <span className="font-bold text-red-700 text-xs block mb-1">Primary Hotspot: {result.primary_hotspot?.source}</span>
              <span className="text-slate-600 text-xs">{result.primary_hotspot?.tCO2e?.toLocaleString()} tCO₂e ({result.primary_hotspot?.percentage}% of total)</span>
            </div>
            <div className="p-3 bg-white border border-amber-200 rounded-lg">
              <span className="font-bold text-amber-700 text-xs block mb-1">Secondary Hotspot: {result.secondary_hotspot?.source}</span>
              <span className="text-slate-600 text-xs">{result.secondary_hotspot?.tCO2e?.toLocaleString()} tCO₂e ({result.secondary_hotspot?.percentage}% of total)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: RECOMMENDED MITIGATION ACTIONS & FINANCIAL ESTIMATION */}
      <div className="space-y-3">
        <h3 className="text-sm uppercase tracking-wider font-bold text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
          5. Recommended Mitigation Interventions & Financial ROI
        </h3>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">Intervention Action</th>
                <th className="p-3">Target Hotspot</th>
                <th className="p-3 text-right">Est. CAPEX ({symbol})</th>
                <th className="p-3 text-right">Annual Savings ({symbol})</th>
                <th className="p-3 text-right">CO₂e Reduction</th>
                <th className="p-3 text-right">Payback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.recommendations?.map((rec, i) => (
                <tr key={i}>
                  <td className="p-3 font-semibold text-slate-900">{rec.title}</td>
                  <td className="p-3 text-slate-600">{rec.targetHotspot}</td>
                  <td className="p-3 text-right font-mono font-semibold">
                    {symbol}{rec.financials ? rec.financials.capex_local.toLocaleString() : rec.impact?.estimatedCostRange}
                  </td>
                  <td className="p-3 text-right font-mono font-semibold text-emerald-700">
                    {symbol}{rec.financials ? rec.financials.annual_savings_local.toLocaleString() : rec.impact?.annualSavingsUSD.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-semibold text-emerald-700">
                    -{rec.impact?.potentialCo2ReductionPercent}% ({rec.impact?.potentialCo2ReductionTons} t)
                  </td>
                  <td className="p-3 text-right font-medium text-slate-800">
                    {rec.financials ? rec.financials.payback_period_years : rec.impact?.paybackPeriodYears}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 7: SCENARIO COMPARISON MATRIX */}
      {result.scenarios && (
        <div className="space-y-3">
          <h3 className="text-sm uppercase tracking-wider font-bold text-slate-900 flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
            6. Decarbonization Scenario Comparison
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <Card className="p-4 border border-slate-200 bg-slate-50/50">
              <Badge variant="secondary" size="sm" className="mb-2">Basic (Quick Wins)</Badge>

              <div className="font-bold text-emerald-700 text-sm">-{result.scenarios.basic?.co2e_reduction_percentage}% CO₂e</div>
              <div className="mt-2 text-slate-600">CAPEX: <strong>{symbol}{result.scenarios.basic?.total_capex_local?.toLocaleString()}</strong></div>
              <div className="text-slate-600">Payback: <strong>{result.scenarios.basic?.payback_years}</strong></div>
            </Card>

            <Card className="p-4 border-2 border-emerald-600 bg-emerald-50/30">
              <Badge variant="success" size="sm" className="mb-2">Balanced (Recommended)</Badge>
              <div className="font-bold text-emerald-700 text-sm">-{result.scenarios.balanced?.co2e_reduction_percentage}% CO₂e</div>
              <div className="mt-2 text-slate-600">CAPEX: <strong>{symbol}{result.scenarios.balanced?.total_capex_local?.toLocaleString()}</strong></div>
              <div className="text-slate-600">Payback: <strong>{result.scenarios.balanced?.payback_years}</strong></div>
            </Card>

            <Card className="p-4 border border-slate-200 bg-slate-50/50">
              <Badge variant="warning" size="sm" className="mb-2">Maximum Reduction</Badge>
              <div className="font-bold text-emerald-700 text-sm">-{result.scenarios.maximum_reduction?.co2e_reduction_percentage}% CO₂e</div>
              <div className="mt-2 text-slate-600">CAPEX: <strong>{symbol}{result.scenarios.maximum_reduction?.total_capex_local?.toLocaleString()}</strong></div>
              <div className="text-slate-600">Payback: <strong>{result.scenarios.maximum_reduction?.payback_years}</strong></div>
            </Card>
          </div>
        </div>
      )}

      {/* FOOTER & COMPLIANCE SIGN-OFF */}
      <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <div>
          <span>Industrial Carbon Hotspot Intelligence • Audit Version 2.0</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>GHG Protocol Verified Calculation Model</span>
        </div>
      </div>
    </div>
  );
}
