"use client";

import React, { useState } from "react";
import { 
  Zap, 
  Layers, 
  Cpu, 
  Recycle, 
  Truck, 
  Factory, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Info,
  CheckCircle2
} from "lucide-react";
import { 
  IndustryType, 
  EmissionCategory, 
  FormFieldDef 
} from "@/types/assessment";
import { INDUSTRY_FIELD_DEFINITIONS, INDUSTRIES_METADATA } from "@/services/assessmentService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface IndustryFormFieldsProps {
  industry: IndustryType;
  values: Record<string, number>;
  facilityName: string;
  facilityLocation: string;
  reportingPeriod: string;
  annualProductionVolume: number;
  onFacilityNameChange: (val: string) => void;
  onFacilityLocationChange: (val: string) => void;
  onReportingPeriodChange: (val: string) => void;
  onProductionVolumeChange: (val: number) => void;
  onFieldValueChange: (key: string, val: number) => void;
  onLoadPreset: () => void;
  validationErrors?: Record<string, string>;
}

export function IndustryFormFields({
  industry,
  values,
  facilityName,
  facilityLocation,
  reportingPeriod,
  annualProductionVolume,
  onFacilityNameChange,
  onFacilityLocationChange,
  onReportingPeriodChange,
  onProductionVolumeChange,
  onFieldValueChange,
  onLoadPreset,
  validationErrors = {},
}: IndustryFormFieldsProps) {
  const fields = INDUSTRY_FIELD_DEFINITIONS[industry] || [];
  const meta = INDUSTRIES_METADATA[industry];

  // Collapsible category state: all open by default or collapsible
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const categories: {
    id: EmissionCategory;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    color: string;
  }[] = [
    {
      id: "production",
      title: "Production & Facility Metrics",
      icon: Factory,
      description: "Output baseline and facility capacity",
      color: "text-slate-700 bg-slate-100",
    },
    {
      id: "energy",
      title: "Energy & Fuel Combustion (Scope 1 & 2)",
      icon: Zap,
      description: "Electricity, natural gas, steam, coal, heavy fuel oils",
      color: "text-amber-700 bg-amber-50",
    },
    {
      id: "materials",
      title: "Raw Materials & Feedstocks (Scope 3 Upstream)",
      icon: Layers,
      description: "Primary virgin raw materials, ores, polymers, and chemicals",
      color: "text-blue-700 bg-blue-50",
    },
    {
      id: "process_utilities",
      title: "Process Gases, Utilities & Cooling",
      icon: Cpu,
      description: "Refrigerants, compressed air, industrial gases, electrodes",
      color: "text-purple-700 bg-purple-50",
    },
    {
      id: "waste_circularity",
      title: "Waste, Effluents & Circular Credits",
      icon: Recycle,
      description: "Solid waste, effluent COD/BOD, byproduct reuse and recycled offsets",
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      id: "transport",
      title: "Logistics & Fleet Transport",
      icon: Truck,
      description: "Inbound supply chain and finished product freight logistics",
      color: "text-orange-700 bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Facility Metadata Card */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Facility & Reporting Boundary</CardTitle>
            <CardDescription>
              Basic facility profile and accounting period for {meta.name}
            </CardDescription>
          </div>
          <Button
            variant="subtle-green"
            size="sm"
            onClick={onLoadPreset}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-700" />}
            className="text-xs font-semibold"
          >
            Auto-fill Standard Industry Baseline
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <Input
            label="Facility / Plant Name"
            placeholder="e.g. Apex Industrial Unit 2"
            value={facilityName}
            isRequired
            onChange={(e) => onFacilityNameChange(e.target.value)}
            error={validationErrors.facilityName}
          />
          <Input
            label="Plant Location / Region"
            placeholder="e.g. Gujarat Industrial Corridor"
            value={facilityLocation}
            isRequired
            onChange={(e) => onFacilityLocationChange(e.target.value)}
            error={validationErrors.facilityLocation}
          />
          <Input
            label="Reporting Period"
            placeholder="e.g. FY 2025-26"
            value={reportingPeriod}
            isRequired
            onChange={(e) => onReportingPeriodChange(e.target.value)}
            error={validationErrors.reportingPeriod}
          />
        </CardContent>
      </Card>

      {/* Categorized Progressive Form Sections */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const catFields = fields.filter((f) => f.category === cat.id);
          if (catFields.length === 0) return null;

          const isCollapsed = collapsedCategories[cat.id] || false;
          const Icon = cat.icon;

          // Count filled
          const filledCount = catFields.filter(
            (f) => values[f.key] !== undefined && Number(values[f.key]) > 0
          ).length;

          return (
            <Card
              key={cat.id}
              className="border-slate-200 overflow-hidden transition-all duration-150 shadow-2xs"
            >
              {/* Category Header Accordion Button */}
              <div
                onClick={() => toggleCategory(cat.id)}
                className="flex items-center justify-between p-4 bg-slate-50/70 border-b border-slate-100 cursor-pointer hover:bg-slate-100/70 select-none transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg border border-slate-200/80", cat.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-none">
                      {cat.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" size="sm" className="font-mono text-[11px]">
                    {filledCount} / {catFields.length} active
                  </Badge>
                  <button
                    type="button"
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  >
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Form Inputs Grid */}
              {!isCollapsed && (
                <CardContent className="p-4 sm:p-5 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catFields.map((field) => {
                      const val = values[field.key] !== undefined ? values[field.key] : "";
                      const error = validationErrors[field.key];

                      return (
                        <div key={field.key} className="space-y-1">
                          <Input
                            label={field.label}
                            unit={field.unit}
                            type="number"
                            min="0"
                            step="any"
                            placeholder={field.placeholder}
                            helperText={field.helperText}
                            isRequired={field.required}
                            value={val}
                            error={error}
                            onChange={(e) => {
                              const num = parseFloat(e.target.value);
                              onFieldValueChange(field.key, isNaN(num) ? 0 : num);
                              if (field.key === "annual_production") {
                                onProductionVolumeChange(isNaN(num) ? 0 : num);
                              }
                            }}
                          />
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 px-0.5">
                            <span className="font-medium text-slate-500">{field.scope}</span>
                            {field.emissionFactorKgPerUnit !== 0 && (
                              <span className="font-mono">
                                Factor: {field.emissionFactorKgPerUnit > 0 ? field.emissionFactorKgPerUnit : `Credit (${field.emissionFactorKgPerUnit})`} kg CO₂e/{field.unit}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
