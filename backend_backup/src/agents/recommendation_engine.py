import os
import json

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")

def generate_candidates(industry: str, primary_hotspot: dict, secondary_hotspot: dict = None, total_co2e: float = 10000.0) -> list:
    recs_file = os.path.join(DATA_DIR, "recommendations.json")
    with open(recs_file, "r") as f:
        all_recs = json.load(f)
        
    candidates = []
    
    # 1. Match recommendations by primary hotspot category
    cat_primary = primary_hotspot.get("category", "energy")
    primary_list = all_recs.get(cat_primary, all_recs.get("energy", []))
    
    for idx, rec in enumerate(primary_list):
        abatement_pct = rec.get("abatement_percent", 25)
        abatement_tons = round(primary_hotspot.get("tCO2e", 1000) * (abatement_pct / 100.0), 1)
        savings = int(abatement_tons * 45)
        
        candidates.append({
            "id": f"rec_p_{idx+1}",
            "title": rec.get("action"),
            "targetHotspot": primary_hotspot.get("source", "Primary Process"),
            "whyRelevant": rec.get("reason"),
            "actionPlan": rec.get("description"),
            "difficulty": rec.get("implementation_difficulty", "Medium"),
            "capitalLevel": rec.get("capital_level", "Medium ($25k-$150k)"),
            "circularity": rec.get("circularity", "Direct Heat/Energy Reuse"),
            "tier": "Quick Win" if idx == 0 else "Medium-Term Modernization",
            "candidateScore": 95 - (idx * 5),
            "impact": {
                "estimatedCostRange": rec.get("cost_range", "$45,000 - $110,000"),
                "potentialCo2ReductionPercent": abatement_pct,
                "potentialCo2ReductionTons": abatement_tons,
                "annualSavingsUSD": savings,
                "paybackPeriodYears": rec.get("payback_years", "1.5 - 2.5 yrs"),
                "roiLevel": "High"
            }
        })
        
    # 2. Match secondary hotspot if available
    if secondary_hotspot:
        cat_sec = secondary_hotspot.get("category", "materials")
        sec_list = all_recs.get(cat_sec, all_recs.get("materials", []))
        for idx, rec in enumerate(sec_list[:2]):
            abatement_pct = rec.get("abatement_percent", 20)
            abatement_tons = round(secondary_hotspot.get("tCO2e", 500) * (abatement_pct / 100.0), 1)
            savings = int(abatement_tons * 38)
            
            candidates.append({
                "id": f"rec_s_{idx+1}",
                "title": rec.get("action"),
                "targetHotspot": secondary_hotspot.get("source", "Secondary Process"),
                "whyRelevant": rec.get("reason"),
                "actionPlan": rec.get("description"),
                "difficulty": rec.get("implementation_difficulty", "Low"),
                "capitalLevel": rec.get("capital_level", "Low (<$25k)"),
                "circularity": rec.get("circularity", "Material Closed-Loop"),
                "tier": "Quick Win",
                "candidateScore": 88 - (idx * 4),
                "impact": {
                    "estimatedCostRange": rec.get("cost_range", "$15,000 - $45,000"),
                    "potentialCo2ReductionPercent": abatement_pct,
                    "potentialCo2ReductionTons": abatement_tons,
                    "annualSavingsUSD": savings,
                    "paybackPeriodYears": rec.get("payback_years", "1.0 - 1.8 yrs"),
                    "roiLevel": "High"
                }
            })
            
    # 3. Add strategic deep decarbonization candidate
    candidates.append({
        "id": "rec_strat_01",
        "title": f"Next-Generation Circular Decarbonization Overhaul for {industry.title()}",
        "targetHotspot": f"{primary_hotspot.get('source')} & Grid Power",
        "whyRelevant": f"Provides comprehensive facility-wide deep emissions reduction for {industry.title()} manufacturing.",
        "actionPlan": "Deploy automated digital energy management system (ISO 50001) combined with green power wheeling and circular material recovery.",
        "difficulty": "High",
        "capitalLevel": "High (>$150k)",
        "circularity": "High",
        "tier": "Deep Decarbonization",
        "candidateScore": 92,
        "impact": {
            "estimatedCostRange": "$180,000 - $450,000",
            "potentialCo2ReductionPercent": 28,
            "potentialCo2ReductionTons": round(total_co2e * 0.28, 1),
            "annualSavingsUSD": int(total_co2e * 0.28 * 52),
            "paybackPeriodYears": "2.5 - 3.8 yrs",
            "roiLevel": "Strategic / Compliance"
        }
    })
    
    return candidates
