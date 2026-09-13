import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, decimals: number = 1): string {
  if (num === undefined || num === null || isNaN(num)) return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatEmissions(tCO2e: number): string {
  if (tCO2e >= 1000000) {
    return `${(tCO2e / 1000000).toFixed(2)} Mt CO₂e`;
  }
  if (tCO2e >= 1000) {
    return `${(tCO2e / 1000).toFixed(1)}k tCO₂e`;
  }
  return `${formatNumber(tCO2e, 1)} tCO₂e`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(pct: number, decimals: number = 1): string {
  if (pct === undefined || pct === null || isNaN(pct)) return "0%";
  return `${Number(pct).toFixed(decimals)}%`;
}

