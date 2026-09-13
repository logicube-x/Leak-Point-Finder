"use client";

import React, { useState } from "react";
import { Search, Globe, Check, ShieldCheck, Zap, DollarSign } from "lucide-react";
import { CountryInfo } from "@/types/assessment";
import { SUPPORTED_COUNTRIES } from "@/services/countryData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export interface CountrySelectorProps {
  selectedCountryId: string;
  onSelectCountry: (country: CountryInfo) => void;
}

export function CountrySelector({
  selectedCountryId,
  onSelectCountry,
}: CountrySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = SUPPORTED_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.currency_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-600" />
          Select Target Country / Regional Grid Jurisdiction
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Select your facility location to automatically load country-specific grid electricity carbon intensity, local fuel tariffs, regional currency, and CAPEX multipliers.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Search country, region (e.g. India, Germany, USA)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-xs"
        />
      </div>

      {/* Grid of Countries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCountries.map((country) => {
          const isSelected = selectedCountryId === country.id;
          return (
            <Card
              key={country.id}
              onClick={() => onSelectCountry(country)}
              className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md border relative ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20"
                  : "border-slate-200 hover:border-emerald-300"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 bg-emerald-600 text-white p-1 rounded-full shadow-xs">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl leading-none">{country.flag_emoji}</span>
                <div>
                  <h4 className="font-semibold text-slate-900 text-base leading-tight">
                    {country.name}
                  </h4>
                  <span className="text-xs font-medium text-slate-500">{country.region}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Grid Factor:
                  </span>
                  <span className="font-mono font-semibold text-slate-900">
                    {country.grid_co2e_per_kwh} kgCO₂e/kWh
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Currency & Tariff:
                  </span>
                  <span className="font-mono font-semibold text-slate-900">
                    {country.currency_symbol} ({country.currency_code}) • ${country.grid_tariff_usd_per_kwh}/kWh
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600 pt-1">
                  <span>CAPEX Multiplier:</span>
                  <Badge variant={country.capex_regional_multiplier > 1.0 ? "warning" : "success"} size="sm">
                    {country.capex_regional_multiplier}x Baseline
                  </Badge>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-600 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>
          Country selection directly calibrates grid Scope 2 emission math, localized fuel combustion baseline, and equipment payback periods.
        </span>
      </div>
    </div>
  );
}
