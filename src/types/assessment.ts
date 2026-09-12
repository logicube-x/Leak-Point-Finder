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
  emissionFactorKgPerUnit: number; // For transparent calculation model
}

export interface FactoryAssessmentInput {
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
  value: number; // original input value
  unit: string;
  tCO2e: number;
  percentage: number;
  isHotspot: boolean;
  intensityPerUnit: number; // e.g. kg CO2e / unit product
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
  benchmarkComparison: string; // e.g., "24% higher than industry median"
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
  paybackPeriodYears: string;
  roiLevel: 'High' | 'Medium' | 'Strategic / Compliance';
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
  tier: 'Quick Win' | 'Medium-Term Modernization' | 'Deep Decarbonization';
}

export interface ConfidenceMetrics {
  score: number; // e.g. 92
  level: 'High' | 'Medium' | 'Preliminary';
  missingDataPenalty: number;
  verifiedPointsCount: number;
  totalPointsCount: number;
}

export interface AssessmentResult {
  id: string;
  createdAt: string;
  facilityName: string;
  facilityLocation: string;
  reportingPeriod: string;
  industry: IndustryType;
  industryName: string;
  total_co2e: number;
  productionVolume: number;
  productionUnit: string;
  carbonIntensity: number; // tCO2e per unit of production
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
  reductionVsPrevious?: number; // percentage change vs previous period
}
