import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, AlertCircle, FileSpreadsheet } from "lucide-react";
import { Button } from "./Button";

export function LoadingState({
  title = "Analyzing Carbon Data...",
  subtitle = "Computing industrial emission factors, Scope 1-3 breakdowns, and hotspot vectors",
  className,
}: {
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-xl bg-white border border-slate-200/80 shadow-2xs animate-fade-slide",
        className
      )}
    >
      <div className="relative flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
        <Loader2 className="w-7 h-7 animate-spin" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-1.5 text-xs text-slate-500 max-w-sm">{subtitle}</p>
    </div>
  );
}

export function EmptyState({
  icon: Icon = FileSpreadsheet,
  title = "No Assessment Data Found",
  description = "Get started by launching a new industrial facility carbon assessment.",
  actionLabel = "Start New Assessment",
  onAction,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-10 text-center rounded-xl bg-white border border-dashed border-slate-300",
        className
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-slate-100 text-slate-500">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <p className="mt-1 text-xs text-slate-500 max-w-sm mb-4">{description}</p>
      {onAction && (
        <Button size="sm" onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Calculation Error",
  error = "An error occurred while analyzing facility emission inputs.",
  onRetry,
  className,
}: {
  title?: string;
  error?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl bg-rose-50/60 border border-rose-200",
        className
      )}
    >
      <div className="flex items-center justify-center w-10 h-10 mb-2.5 rounded-full bg-rose-100 text-rose-600">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-rose-900">{title}</h4>
      <p className="mt-1 text-xs text-rose-700 max-w-md mb-4">{error}</p>
      {onRetry && (
        <Button size="sm" onClick={onRetry} variant="danger">
          Try Again
        </Button>
      )}
    </div>
  );
}
