export type IndustryType = 
  | 'textile' 
  | 'steel' 
  | 'food_processing' 
  | 'cement' 
  | 'chemical';

export interface IndustryMetadata {
  id: IndustryType;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  defaultUnit: string;
  typicalHotspots: string[];
  scopeFocus: string;
}

export type EmissionScope = 'Scope 1' | 'Scope 2' | 'Scope 3';
export type EmissionCategory = 
  | 'production' 
  | 'energy' 
  | 'materials' 
  | 'process_utilities' 
  | 'waste_circularity' 
  | 'transport';

export interface CountryInfo {
  id: string;
  name: string;
  region: string;
  currency_code: string;
  currency_symbol: string;
  usd_exchange_rate: number;
  grid_co2e_per_kwh: number;
  grid_tariff_usd_per_kwh: number;
  natural_gas_usd_per_m3: number;
  diesel_usd_per_litre: number;
  coal_usd_per_kg: number;
  capex_regional_multiplier: number;
  carbon_tax_usd_per_tco2e: number;
  flag_emoji: string;
}

export interface FormFieldDef {
  key: string;
  label: string;
  category: EmissionCategory;
  unit: string;
  placeholder: string;
  helperText: string;
  required?: boolean;
  min?: number;
  defaultValue?: number;
  scope: EmissionScope;
  emissionFactorKgPerUnit: number;
}

export interface FactoryAssessmentInput {
  countryId: string;
  facilityName: string;
  facilityLocation: string;
  reportingPeriod: string;
  industry: IndustryType;
  annualProductionVolume: number;
  productionUnit: string;
  operatingHoursPerYear?: number;
  fields: Record<string, number>;
  notes?: string;
}

export interface EmissionSource {
  id: string;
  name: string;
  category: EmissionCategory;
  categoryLabel: string;
  scope: EmissionScope;
  value: number;
  unit: string;
  tCO2e: number;
  percentage: number;
  isHotspot: boolean;
  intensityPerUnit: number;
}

export interface Hotspot {
  source: string;
  category: EmissionCategory;
  categoryLabel: string;
  scope: EmissionScope;
  tCO2e: number;
  percentage: number;
  severity: 'Critical' | 'High' | 'Moderate';
  keyDriver: string;
  benchmarkComparison: string;
}

export type ImplementationDifficulty = 'Low' | 'Medium' | 'High';
export type CapitalLevel = 'Low (<$25k)' | 'Medium ($25k-$150k)' | 'High (>$150k)';
export type CircularityBenefit = 'High' | 'Medium' | 'Direct Heat/Energy Reuse' | 'Material Closed-Loop' | 'Minimal';

export interface ImpactEstimate {
  estimatedCostRange: string;
  estimatedCostMinUSD: number;
  estimatedCostMaxUSD: number;
  potentialCo2ReductionPercent: number;
  potentialCo2ReductionTons: number;
  annualSavingsUSD: number;
  annualSavingsLocal?: number;
  paybackPeriodYears: string;
  roiLevel: 'High' | 'Medium' | 'Strategic / Compliance' | 'Strategic';
}

export interface FinancialDetails {
  capex_usd: number;
  capex_local: number;
  opex_annual_usd: number;
  opex_annual_local: number;
  annual_savings_usd: number;
  annual_savings_local: number;
  potential_co2e_reduction_tco2e: number;
  potential_co2e_reduction_percent: number;
  payback_period_years: string;
  payback_years_numeric: number;
  roi_percent: number;
  currency_symbol: string;
  currency_code: string;
  tier: string;
  difficulty: string;
  capital_level: string;
}

export interface Recommendation {
  id: string;
  title: string;
  targetHotspot: string;
  whyRelevant: string;
  actionPlan: string;
  difficulty: ImplementationDifficulty;
  capitalLevel: CapitalLevel;
  circularity: CircularityBenefit;
  impact: ImpactEstimate;
  financials?: FinancialDetails;
  tier: 'Quick Win' | 'Medium-Term Modernization' | 'Deep Decarbonization' | 'Recommended';
}

export interface ScenarioMetrics {
  name: string;
  description: string;
  action_count: number;
  actions: string[];
  total_capex_usd: number;
  total_capex_local: number;
  total_opex_annual_usd: number;
  total_annual_savings_usd: number;
  total_annual_savings_local: number;
  co2e_reduction_tco2e: number;
  co2e_reduction_percentage: number;
  remaining_emissions_tco2e: number;
  payback_years: string;
  currency_symbol: string;
}

export interface ScenarioComparison {
  basic: ScenarioMetrics;
  balanced: ScenarioMetrics;
  maximum_reduction: ScenarioMetrics;
}

export interface LLMNarrative {
  executive_summary: string;
  cause_analysis: string;
  methodology_notes: string;
  risk_guidance: string;
}

export interface ConfidenceMetrics {
  score: number;
  level: 'High' | 'Medium' | 'Preliminary';
  missingDataPenalty: number;
  verifiedPointsCount: number;
  totalPointsCount: number;
}

export interface AssessmentResult {
  id: string;
  createdAt: string;
  country: CountryInfo;
  facilityName: string;
  facilityLocation: string;
  reportingPeriod: string;
  industry: IndustryType;
  industryName: string;
  total_co2e: number;
  productionVolume: number;
  productionUnit: string;
  carbonIntensity: number;
  primary_hotspot: Hotspot;
  secondary_hotspot: Hotspot;
  confidence: ConfidenceMetrics;
  emission_breakdown: EmissionSource[];
  scope_breakdown: {
    scope1: { tCO2e: number; percentage: number };
    scope2: { tCO2e: number; percentage: number };
    scope3: { tCO2e: number; percentage: number };
  };
  category_breakdown: {
    category: EmissionCategory;
    label: string;
    tCO2e: number;
    percentage: number;
  }[];
  recommendations: Recommendation[];
  scenarios: ScenarioComparison;
  llm_narrative: LLMNarrative;
  rawInputs: FactoryAssessmentInput;
}

export interface HistoricalAssessment {
  id: string;
  facilityName: string;
  reportingPeriod: string;
  industry: IndustryType;
  industryName: string;
  total_co2e: number;
  carbonIntensity: number;
  primaryHotspotName: string;
  primaryHotspotPercentage: number;
  secondaryHotspotName: string;
  confidenceScore: number;
  createdAt: string;
  countryName?: string;
  currencySymbol?: string;
  reductionVsPrevious?: number;
}
