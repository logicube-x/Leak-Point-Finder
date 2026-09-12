import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "danger"
    | "critical"
    | "scope1"
    | "scope2"
    | "scope3";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    secondary: "bg-slate-800 text-slate-100 border-transparent",
    outline: "bg-transparent text-slate-700 border-slate-300",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200 font-medium",
    warning: "bg-amber-50 text-amber-800 border-amber-200 font-medium",
    danger: "bg-rose-50 text-rose-800 border-rose-200 font-medium",
    critical: "bg-red-600 text-white border-transparent font-semibold shadow-2xs",
    scope1: "bg-blue-50 text-blue-700 border-blue-200 font-medium",
    scope2: "bg-purple-50 text-purple-700 border-purple-200 font-medium",
    scope3: "bg-amber-50 text-amber-700 border-amber-200 font-medium",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] leading-tight",
    md: "px-2.5 py-1 text-xs leading-none",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border transition-colors",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
