import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
  isRequired?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      options,
      helperText,
      error,
      isRequired,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-medium text-slate-700 select-none flex items-center gap-1"
          >
            {label}
            {isRequired && <span className="text-rose-500 font-bold">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "flex h-9 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-1.5 pr-8 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-50 transition-colors",
              error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} {opt.sublabel ? `(${opt.sublabel})` : ""}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-slate-400" />
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

Select.displayName = "Select";
