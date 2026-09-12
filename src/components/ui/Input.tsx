import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  unit?: string;
  helperText?: string;
  error?: string;
  isRequired?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      unit,
      helperText,
      error,
      isRequired,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="text-xs font-medium text-slate-700 select-none flex items-center gap-1"
            >
              {label}
              {isRequired ? (
                <span className="text-rose-500 font-bold" title="Required">*</span>
              ) : (
                <span className="text-slate-400 font-normal text-[11px]">(optional)</span>
              )}
            </label>
          </div>
        )}

        <div className="relative flex rounded-lg shadow-2xs">
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 transition-colors font-mono tabular-nums",
              unit && "pr-16",
              error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500",
              className
            )}
            {...props}
          />
          {unit && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                {unit}
              </span>
            </div>
          )}
        </div>

        {error ? (
          <p className="text-[11px] font-medium text-rose-600">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
