"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { NavView } from "@/components/layout/Sidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { AssessmentWizard } from "@/components/assessment/AssessmentWizard";
import { ResultsView } from "@/components/results/ResultsView";
import { HistoryView } from "@/components/history/HistoryView";
import { 
  AssessmentResult, 
  HistoricalAssessment, 
  IndustryType 
} from "@/types/assessment";
import { 
  assessmentService, 
  INDUSTRIES_METADATA, 
  INDUSTRY_FIELD_DEFINITIONS 
} from "@/services/assessmentService";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<NavView>("dashboard");
  const [activeResult, setActiveResult] = useState<AssessmentResult | null>(null);
  const [historyList, setHistoryList] = useState<HistoricalAssessment[]>([]);
  const [selectedIndustryPreset, setSelectedIndustryPreset] = useState<IndustryType | null>(null);

  useEffect(() => {
    // Load history and initialize initial sample result if needed
    assessmentService.getAssessmentHistory().then((data) => {
      setHistoryList(data);
    });
  }, []);

  const handleStartAssessment = (industry?: IndustryType) => {
    setSelectedIndustryPreset(industry || null);
    setCurrentView("new_assessment");
  };

  const handleAnalysisComplete = (result: AssessmentResult) => {
    setActiveResult(result);
    // Reload history list
    assessmentService.getAssessmentHistory().then((data) => {
      setHistoryList(data);
    });
    setCurrentView("results");
  };

  const handleSelectHistoryItem = async (assessmentId: string) => {
    // If selecting a history item, generate or retrieve the assessment
    const item = historyList.find((h) => h.id === assessmentId);
    if (item) {
      // Re-run mock analysis with defaults for that industry to generate full interactive view
      const fieldsDef = INDUSTRY_FIELD_DEFINITIONS[item.industry] || [];
      const fields: Record<string, number> = {};
      fieldsDef.forEach((f) => {
        fields[f.key] = f.defaultValue || 0;
      });

      const res = await assessmentService.analyzeAssessment({
        facilityName: item.facilityName,
        facilityLocation: "Industrial Facility Regional Hub",
        reportingPeriod: item.reportingPeriod,
        industry: item.industry,
        annualProductionVolume: fieldsDef.find((f) => f.key === "annual_production")?.defaultValue || 10000,
        productionUnit: INDUSTRIES_METADATA[item.industry].defaultUnit,
        fields,
      });

      setActiveResult(res);
      setCurrentView("results");
    }
  };

  return (
    <AppShell
      currentView={currentView}
      onNavigate={setCurrentView}
      activeResult={activeResult}
    >
      {currentView === "dashboard" && (
        <DashboardOverview
          onStartAssessment={handleStartAssessment}
          onViewHistory={() => setCurrentView("history")}
          onSelectHistoryItem={handleSelectHistoryItem}
          recentHistory={historyList}
        />
      )}

      {currentView === "new_assessment" && (
        <AssessmentWizard
          initialIndustry={selectedIndustryPreset}
          onAnalysisComplete={handleAnalysisComplete}
          onCancel={() => setCurrentView("dashboard")}
        />
      )}

      {currentView === "results" && activeResult && (
        <ResultsView
          result={activeResult}
          onNewAssessment={() => handleStartAssessment(activeResult.industry)}
          onViewHistory={() => setCurrentView("history")}
        />
      )}

      {currentView === "history" && (
        <HistoryView
          history={historyList}
          onStartNewAssessment={() => handleStartAssessment()}
          onSelectAssessment={handleSelectHistoryItem}
        />
      )}
    </AppShell>
  );
}
