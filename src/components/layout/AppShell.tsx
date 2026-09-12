"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar, NavView } from "./Sidebar";
import { AssessmentResult, HistoricalAssessment, IndustryType } from "@/types/assessment";

export interface AppShellProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  activeResult: AssessmentResult | null;
  children: React.ReactNode;
}

export function AppShell({
  currentView,
  onNavigate,
  activeResult,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-900 font-sans">
      <Header
        currentView={currentView.replace("_", " ")}
        facilityName={activeResult?.facilityName}
        industryName={activeResult?.industryName}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={onNavigate}
          hasActiveResult={!!activeResult}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
