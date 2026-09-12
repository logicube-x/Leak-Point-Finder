"use client";

import React from "react";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  ArrowLeft, 
  Flame, 
  ShieldCheck, 
  Sparkles,
  Edit3
} from "lucide-react";
import { 
  IndustryType, 
  FactoryAssessmentInput, 
  FormFieldDef 
} from "@/types/assessment";
import { INDUSTRY_FIELD_DEFINITIONS, INDUSTRIES_METADATA } from "@/services/assessmentService";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";

export interface ReviewSummaryProps {
  input: FactoryAssessmentInput;
  onBackToEdit: () => void;
  onSubmitAnalyze: () => void;
  isAnalyzing: boolean;
}

export function ReviewSummary({
  input,
  onBackToEdit,
  onSubmitAnalyze,
  isAnalyzing,
}: ReviewSummaryProps) {
  const meta = INDUSTRIES_METADATA[input.industry];
  const fields = INDUSTRY_FIELD_DEFINITIONS[input.industry] || [];

  // Group inputs by category
  const categories = [
    { key: "production", label: "Production Output" },
    { key: "energy", label: "Energy & Fuels" },
    { key: "materials", label: "Materials & Feedstocks" },
    { key: "process_utilities", label: "Process & Utilities" },
    { key: "waste_circularity", label: "Waste & Circularity" },
    { key: "transport", label: "Transport & Logistics" },
  ];

  const totalFilled = fields.filter((f) => (input.fields[f.key] || 0) > 0).length;

  return (
    <div className="space-y-6 animate-fade-slide">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 text-white shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> Ready for Diagnostic Engine
          </div>
          <h3 className="text-lg font-bold text-white">
            Pre-Analysis Review & Boundary Verification
          </h3>
          <p className="text-xs text-slate-300">
            Verify facility operational data before computing Scope 1-3 hotspots and decarbonization recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={onBackToEdit}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
          >
            Edit Inputs
          </Button>
          <Button
            size="md"
            onClick={onSubmitAnalyze}
            isLoading={isAnalyzing}
            leftIcon={<Sparkles className="w-4 h-4" />}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-sm"
          >
            Run Hotspot Analysis
          </Button>
        </div>
      </div>

      {/* Facility Header Card */}
      <Card className="border-slate-200">
        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Facility Name</span>
            <p className="text-sm font-bold text-slate-900">{input.facilityName}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Location / Corridor</span>
            <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {input.facilityLocation}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Reporting Cycle</span>
            <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {input.reportingPeriod}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Sector Model</span>
            <div>
              <Badge variant="success" size="sm" className="font-semibold">
                {meta.name}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categorized Inputs Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const catFields = fields.filter((f) => f.category === cat.key);
          if (catFields.length === 0) return null;

          return (
            <Card key={cat.key} className="border-slate-200 overflow-hidden shadow-2xs">
              <CardHeader className="p-3.5 px-4 bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {cat.label}
                </CardTitle>
                <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                  {catFields.length} parameters
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-slate-100">
                    {catFields.map((field) => {
                      const val = input.fields[field.key] !== undefined ? input.fields[field.key] : 0;
                      return (
                        <tr key={field.key} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 font-medium text-slate-700">
                            {field.label}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-semibold text-slate-900">
                            {val > 0 ? (
                              <span>
                                {formatNumber(val, 1)} <span className="text-slate-500 text-[11px] font-normal">{field.unit}</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">0 {field.unit}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom CTA Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-600 text-white">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
              Data Audit Ready ({totalFilled} active data points)
            </h4>
            <p className="text-xs text-emerald-800">
              Ready to execute dynamic GHG Protocol emission factor calculations and identify primary/secondary hotspots.
            </p>
          </div>
        </div>

        <Button
          size="lg"
          onClick={onSubmitAnalyze}
          isLoading={isAnalyzing}
          leftIcon={<Flame className="w-4 h-4 text-amber-300" />}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md"
        >
          Execute Analysis
        </Button>
      </div>
    </div>
  );
}
