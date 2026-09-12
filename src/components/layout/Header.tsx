"use client";

import React from "react";
import { 
  Building2, 
  Flame, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface HeaderProps {
  currentView: string;
  facilityName?: string;
  industryName?: string;
}

export function Header({
  currentView,
  facilityName,
  industryName,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200/90 bg-white/95 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          <span className="text-slate-900 capitalize">{currentView}</span>
        </div>

        {industryName && (
          <Badge variant="success" size="sm" className="hidden sm:inline-flex ml-2 font-medium">
            {industryName}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>FY 2025-26 Reporting Cycle</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-emerald-50/70 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold">ISO 14064 Compliant Engine</span>
        </div>
      </div>
    </header>
  );
}
