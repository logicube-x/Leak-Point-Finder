"use client";

import React from "react";
import { HelpCircle, Sliders, Cpu, Sun, Flame, Settings } from "lucide-react";
import { IndustryType } from "@/types/assessment";
import { Card } from "@/components/ui/Card";

export interface DynamicQuestionValues {
  boilerFuelType?: string;
  boilerAgeYears?: number;
  hasRooftopSolar?: string;
  gridReliabilityRating?: string;
  heatRecoveryInstalled?: string;
  effluentTreatmentType?: string;
}

export interface DynamicQuestionsProps {
  industry: IndustryType;
  values: DynamicQuestionValues;
  onChange: (key: keyof DynamicQuestionValues, val: any) => void;
}

export function DynamicQuestions({
  industry,
  values,
  onChange,
}: DynamicQuestionsProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-emerald-600" />
          Dynamic Facility Architecture & Technology Questions
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Adaptive operational details tailored to {industry.replace("_", " ").toUpperCase()} manufacturing setup for cause analysis and targeted mitigation models.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Boiler & Thermal Primary Fuel */}
        <Card className="p-4 border border-slate-200 bg-white space-y-2">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" /> Primary Thermal / Boiler Energy Source
          </label>
          <select
            value={values.boilerFuelType || "natural_gas"}
            onChange={(e) => onChange("boilerFuelType", e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="natural_gas">Natural Gas (High efficiency boiler)</option>
            <option value="coal">Sub-bituminous Coal / Petcoke</option>
            <option value="diesel">Heavy Fuel Oil (HFO) / Mineral Diesel</option>
            <option value="biomass">Agro-Biomass / Rice Husk / Wood Pellets</option>
            <option value="electric">Electric Steam Generator</option>
          </select>
          <p className="text-[11px] text-slate-500">
            Determines combustion emission intensity and potential fuel-switching ROI.
          </p>
        </Card>

        {/* Equipment Vintage */}
        <Card className="p-4 border border-slate-200 bg-white space-y-2">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-600" /> Primary Mechanical Equipment Age
          </label>
          <select
            value={values.boilerAgeYears || 8}
            onChange={(e) => onChange("boilerAgeYears", Number(e.target.value))}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 focus:ring-2 focus:ring-emerald-500"
          >
            <option value={3}>Modern (&lt; 5 years old)</option>
            <option value={8}>Standard Operational (5 - 12 years old)</option>
            <option value={15}>Legacy Equipment (&gt; 12 years old)</option>
          </select>
          <p className="text-[11px] text-slate-500">
            Older equipment carries 15-30% efficiency penalty recoverable via VFDs.
          </p>
        </Card>

        {/* Renewable Solar Availability */}
        <Card className="p-4 border border-slate-200 bg-white space-y-2">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-500" /> On-Site Rooftop Solar Feasibility
          </label>
          <select
            value={values.hasRooftopSolar || "feasible_uninstalled"}
            onChange={(e) => onChange("hasRooftopSolar", e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="installed">Rooftop Solar Currently Installed (&gt; 20% grid reduction)</option>
            <option value="feasible_uninstalled">Feasible Rooftop Area Available (Uninstalled)</option>
            <option value="space_constrained">Space Constrained (Off-site PPA required)</option>
          </select>
          <p className="text-[11px] text-slate-500">
            Used to model Solar PPA capital investment and Scope 2 reduction scenario.
          </p>
        </Card>

        {/* Heat Recovery Integration */}
        <Card className="p-4 border border-slate-200 bg-white space-y-2">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-slate-700" /> Waste Heat & Steam Recovery Systems
          </label>
          <select
            value={values.heatRecoveryInstalled || "none"}
            onChange={(e) => onChange("heatRecoveryInstalled", e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="none">No Heat Recovery Systems Currently Operating</option>
            <option value="partial">Economizers / Flue Gas Recovery Only</option>
            <option value="full">Full Closed-Loop Pinch Heat Exchangers</option>
          </select>
          <p className="text-[11px] text-slate-500">
            Assesses thermal leak points and secondary waste heat recovery potential.
          </p>
        </Card>
      </div>
    </div>
  );
}
