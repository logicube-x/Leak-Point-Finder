"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw,
  Factory,
  Layers,
  FileCheck
} from "lucide-react";
import { 
  IndustryType, 
  FactoryAssessmentInput, 
  AssessmentResult 
} from "@/types/assessment";
import { 
  assessmentService, 
  INDUSTRIES_METADATA, 
  INDUSTRY_FIELD_DEFINITIONS 
} from "@/services/assessmentService";
import { StepIndicator, StepItem } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IndustrySelector } from "./IndustrySelector";
import { IndustryFormFields } from "./IndustryFormFields";
import { ReviewSummary } from "./ReviewSummary";
import { LoadingState, ErrorState } from "@/components/ui/FeedbackStates";

export interface AssessmentWizardProps {
  initialIndustry?: IndustryType | null;
  onAnalysisComplete: (result: AssessmentResult) => void;
  onCancel: () => void;
}

export function AssessmentWizard({
  initialIndustry = null,
  onAnalysisComplete,
  onCancel,
}: AssessmentWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(initialIndustry);
  const [facilityName, setFacilityName] = useState("Industrial Manufacturing Complex");
  const [facilityLocation, setFacilityLocation] = useState("Industrial Corridor Zone, Sector 4");
  const [reportingPeriod, setReportingPeriod] = useState("FY 2025-26");
  const [annualProductionVolume, setAnnualProductionVolume] = useState<number>(10000);
  const [fieldValues, setFieldValues] = useState<Record<string, number>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const wizardSteps: StepItem[] = [
    { id: "industry", title: "Select Sector", description: "Choose industrial activity" },
    { id: "data_entry", title: "Operational Data", description: "Enter facility inputs & fuel" },
    { id: "review", title: "Audit & Analyze", description: "Verify & run hotspot engine" },
  ];

  // Initialize field values when industry changes
  useEffect(() => {
    if (selectedIndustry) {
      loadDefaultValuesForIndustry(selectedIndustry);
    }
  }, [selectedIndustry]);

  const loadDefaultValuesForIndustry = (ind: IndustryType) => {
    const fields = INDUSTRY_FIELD_DEFINITIONS[ind] || [];
    const defaults: Record<string, number> = {};
    let prodVol = 10000;

    fields.forEach((f) => {
      defaults[f.key] = f.defaultValue || 0;
      if (f.key === "annual_production") {
        prodVol = f.defaultValue || 10000;
      }
    });

    setFieldValues(defaults);
    setAnnualProductionVolume(prodVol);

    // Update facility demo names appropriately
    if (ind === "textile") {
      setFacilityName("Apex Textile Mills - Spinning & Dyeing Unit");
      setFacilityLocation("Tirupur Textile Park, Tamil Nadu");
    } else if (ind === "steel") {
      setFacilityName("Kalinga Integrated Steelworks - Mill 2");
      setFacilityLocation("Jajpur Industrial Complex, Odisha");
    } else if (ind === "food_processing") {
      setFacilityName("Heritage Agro Foods & Beverages Processing Plant");
      setFacilityLocation("Pune Food Cluster, Maharashtra");
    } else if (ind === "cement") {
      setFacilityName("Vindhya Cement Clinker & Grinding Works");
      setFacilityLocation("Rewa Industrial Zone, Madhya Pradesh");
    } else if (ind === "chemical") {
      setFacilityName("Gujarat Specialty Olefins & Reagents Complex");
      setFacilityLocation("Dahej PCPIR Corridor, Gujarat");
    }
  };

  const handleFieldValueChange = (key: string, val: number) => {
    setFieldValues((prev) => ({
      ...prev,
      [key]: val,
    }));
    // Clear validation error if any
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!facilityName.trim()) {
      errors.facilityName = "Facility name is required";
    }
    if (!facilityLocation.trim()) {
      errors.facilityLocation = "Location is required";
    }
    if (!reportingPeriod.trim()) {
      errors.reportingPeriod = "Reporting period is required";
    }

    const fields = selectedIndustry ? (INDUSTRY_FIELD_DEFINITIONS[selectedIndustry] || []) : [];
    fields.forEach((f) => {
      if (f.required && (fieldValues[f.key] === undefined || fieldValues[f.key] <= 0)) {
        errors[f.key] = `${f.label} is required`;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStepIndex === 0) {
      setCurrentStepIndex(1);
    } else if (currentStepIndex === 1) {
      if (validateStep2()) {
        setCurrentStepIndex(2);
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      onCancel();
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const activeInd = selectedIndustry || "textile";
      const input: FactoryAssessmentInput = {
        facilityName,
        facilityLocation,
        reportingPeriod,
        industry: activeInd,
        annualProductionVolume,
        productionUnit: INDUSTRIES_METADATA[activeInd].defaultUnit,
        fields: fieldValues,
      };

      const result = await assessmentService.analyzeAssessment(input);
      onAnalysisComplete(result);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to calculate carbon hotspots"
      );
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    const activeInd = selectedIndustry || "textile";
    return (
      <div className="py-12 max-w-xl mx-auto">
        <LoadingState
          title="Computing Multi-Scope Carbon Footprint..."
          subtitle={`Applying ${INDUSTRIES_METADATA[activeInd].name} activity emission factors, ranking hotspots, and generating targeted decarbonization ROI models.`}
        />
      </div>
    );
  }

  const activeInd = selectedIndustry || "textile";
  const currentInput: FactoryAssessmentInput = {
    facilityName,
    facilityLocation,
    reportingPeriod,
    industry: activeInd,
    annualProductionVolume,
    productionUnit: INDUSTRIES_METADATA[activeInd].defaultUnit,
    fields: fieldValues,
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Wizard Header with Step Progress */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              New Facility Carbon Assessment
            </h2>
            <p className="text-xs text-slate-500">
              Complete the structured assessment to identify primary emission hotspots and abatement pathways.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>

        <div className="pt-4">
          <StepIndicator
            steps={wizardSteps}
            currentStepIndex={currentStepIndex}
            onStepClick={(idx) => {
              if (idx === 0) setCurrentStepIndex(0);
              else if (idx === 1 && selectedIndustry) setCurrentStepIndex(1);
              else if (idx === 2 && selectedIndustry && validateStep2()) setCurrentStepIndex(2);
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <ErrorState
          error={errorMessage}
          onRetry={handleRunAnalysis}
        />
      )}

      {/* Step 1: Industry Selection */}
      {currentStepIndex === 0 && (
        <div className="space-y-6">
          <IndustrySelector
            selectedIndustry={selectedIndustry}
            onSelect={(ind) => {
              setSelectedIndustry(ind);
              setCurrentStepIndex(1);
            }}
          />
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={onCancel}>
              Back to Overview
            </Button>
            <Button
              disabled={!selectedIndustry}
              onClick={() => selectedIndustry && setCurrentStepIndex(1)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Data Entry
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Dynamic Form Fields */}
      {currentStepIndex === 1 && selectedIndustry && (
        <div className="space-y-6">
          <IndustryFormFields
            industry={selectedIndustry}
            values={fieldValues}
            facilityName={facilityName}
            facilityLocation={facilityLocation}
            reportingPeriod={reportingPeriod}
            annualProductionVolume={annualProductionVolume}
            onFacilityNameChange={setFacilityName}
            onFacilityLocationChange={setFacilityLocation}
            onReportingPeriodChange={setReportingPeriod}
            onProductionVolumeChange={setAnnualProductionVolume}
            onFieldValueChange={handleFieldValueChange}
            onLoadPreset={() => loadDefaultValuesForIndustry(selectedIndustry)}
            validationErrors={validationErrors}
          />

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              onClick={() => setCurrentStepIndex(0)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Change Sector
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => loadDefaultValuesForIndustry(selectedIndustry)}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset Defaults
              </Button>
              <Button
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Review & Verification
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review Summary */}
      {currentStepIndex === 2 && (
        <div className="space-y-6">
          <ReviewSummary
            input={currentInput}
            onBackToEdit={() => setCurrentStepIndex(1)}
            onSubmitAnalyze={handleRunAnalysis}
            isAnalyzing={isAnalyzing}
          />
        </div>
      )}
    </div>
  );
}
