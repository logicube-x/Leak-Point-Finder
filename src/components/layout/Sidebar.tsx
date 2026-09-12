"use client";

import React from "react";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  BarChart3, 
  Flame, 
  Leaf, 
  HelpCircle,
  Factory
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavView = "dashboard" | "new_assessment" | "results" | "history" | "benchmarks";

export interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  hasActiveResult?: boolean;
}

export function Sidebar({
  currentView,
  onNavigate,
  hasActiveResult = false,
}: SidebarProps) {
  const navItems = [
    {
      id: "dashboard" as NavView,
      label: "Overview",
      icon: LayoutDashboard,
      description: "Platform summary & stats",
    },
    {
      id: "new_assessment" as NavView,
      label: "New Assessment",
      icon: PlusCircle,
      description: "Industry-specific carbon flow",
      highlight: true,
    },
    ...(hasActiveResult
      ? [
          {
            id: "results" as NavView,
            label: "Hotspot Intelligence",
            icon: Flame,
            description: "Active facility diagnostic",
            badge: "Active",
          },
        ]
      : []),
    {
      id: "history" as NavView,
      label: "Assessment History",
      icon: History,
      description: "Past facilities & records",
    },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-slate-200 bg-white min-h-[calc(100vh-3.5rem)] select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600/30">
          <Factory className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-tight">
            Industrial Carbon
          </h1>
          <p className="text-[11px] font-medium text-emerald-700">
            Industrial Hotspot Engine
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 p-3 space-y-1">
        <div className="px-2 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Main Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group text-left",
                isActive
                  ? "bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/80 shadow-2xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-emerald-700"
                      : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <div>
                  <span className="block leading-none">{item.label}</span>
                </div>
              </div>

              {item.highlight && !isActive && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
              {item.badge && (
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Industrial Intelligence Footer Badge */}
      <div className="p-3 border-t border-slate-100">
        <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>5 Core Industries</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Textile, Steel, Food Processing, Cement, Chemical.
          </p>
          <div className="mt-2 text-[10px] text-slate-400 font-mono">
            v1.0 • HackOut 2026
          </div>
        </div>
      </div>
    </aside>
  );
}
