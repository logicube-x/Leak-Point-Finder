import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "danger";
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = "md",
  variant = "default",
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const variantStyles = {
    default: "bg-emerald-600",
    success: "bg-emerald-600",
    warning: "bg-amber-500",
    danger: "bg-rose-600",
  };

  return (
    <div className={cn("w-full space-y-1", className)} {...props}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>Progress</span>
          <span className="font-mono">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-slate-100",
          sizeStyles[size]
        )}
      >
        <div
          className={cn("h-full transition-all duration-300 ease-out rounded-full", variantStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export interface StepItem {
  id: string;
  title: string;
  description?: string;
}

export interface StepIndicatorProps {
  steps: StepItem[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
  className?: string;
}

export function StepIndicator({
  steps,
  currentStepIndex,
  onStepClick,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isClickable = onStepClick && index <= currentStepIndex;

            return (
              <li
                key={step.id}
                className={cn(
                  "relative flex-1 flex items-center",
                  index !== steps.length - 1 && "after:content-[''] after:h-0.5 after:w-full after:bg-slate-200 after:inline-block after:mx-2",
                  index < currentStepIndex && "after:bg-emerald-600"
                )}
              >
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(index)}
                  className={cn(
                    "group flex items-center gap-2.5 text-left focus:outline-none",
                    isClickable ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-150",
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "border-2 border-emerald-600 bg-white text-emerald-700 ring-4 ring-emerald-50"
                        : "border border-slate-300 bg-white text-slate-500"
                    )}
                  >
                    {isCompleted ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <div className="hidden sm:block">
                    <p
                      className={cn(
                        "text-xs font-medium leading-none",
                        isCurrent
                          ? "text-emerald-800 font-semibold"
                          : isCompleted
                          ? "text-slate-800"
                          : "text-slate-400"
                      )}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {step.description}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
