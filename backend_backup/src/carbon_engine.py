import os
import json

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

CATEGORY_MAPPING = {
    "grid_electricity": "energy",
    "natural_gas": "energy",
    "diesel_fuel": "energy",
    "heavy_fuel_oil": "energy",
    "coke_coal": "energy",
    "kiln_coal_petcoke": "energy",
    "lpg": "energy",
    "steam": "energy",
    "polyester_fibre": "materials",
    "raw_cotton": "materials",
    "dyes_chemicals": "materials",
    "iron_ore": "materials",
    "dri_hbi": "materials",
    "scrap_steel": "materials",
    "limestone_flux": "materials",
    "limestone_raw": "materials",
    "raw_agricultural": "materials",
    "packaging_plastic": "materials",
    "packaging_corrugated": "materials",
    "hydrocarbon_feedstock": "materials",
    "refrigerant_leakage": "process_utilities",
    "graphite_electrodes": "process_utilities",
    "process_flaring": "process_utilities",
    "process_water": "process_utilities",
    "compressed_air": "process_utilities",
    "wastewater": "waste_circularity",
    "solid_waste": "waste_circularity",
    "freight_transport": "transport"
}

CATEGORY_LABELS = {
    "energy": "Energy & Fuel Combustion",
    "materials": "Raw Materials & Feeds",
    "process_utilities": "Process & Utilities",
    "waste_circularity": "Waste & Circularity",
    "transport": "Logistics & Transport"
}

def compute_carbon_footprint(standardized_data: dict) -> dict:
    factors_file = os.path.join(DATA_DIR, "emission_factors.json")
    with open(factors_file, "r") as f:
        factors = json.load(f)
        
    raw_fields = standardized_data.get("raw_inputs", {}).get("fields", {})
    production_volume = standardized_data.get("production_volume", 10000) or 10000
    
    emission_sources = []
    total_tco2e = 0.0
    s1 = 0.0
    s2 = 0.0
    s3 = 0.0
    
    category_totals = {
        "energy": 0.0,
        "materials": 0.0,
        "process_utilities": 0.0,
        "waste_circularity": 0.0,
        "transport": 0.0
    }
    
    for key, val_raw in raw_fields.items():
        if key == "annual_production":
            continue
            
        val = float(val_raw) if val_raw is not None else 0.0
        
        # Match key or partial key to emission factor
        matched_factor = None
        for f_key, f_data in factors.items():
            if f_key in key or key in f_key:
                matched_factor = f_data
                break
                
        if not matched_factor:
            matched_factor = {
                "factor_kg_per_unit": 700,
                "unit": "units",
                "scope": "Scope 3",
                "name": key.replace("_", " ").title()
            }
            
        factor_kg = matched_factor.get("factor_kg_per_unit", 0)
        scope = matched_factor.get("scope", "Scope 1")
        name = matched_factor.get("name", key.replace("_", " ").title())
        unit = matched_factor.get("unit", "units")
        
        calc_tco2e = (val * factor_kg) / 1000.0
        total_tco2e += calc_tco2e
        
        cat = "energy"
        for k_cat, cat_name in CATEGORY_MAPPING.items():
            if k_cat in key:
                cat = cat_name
                break
                
        category_totals[cat] += max(0.0, calc_tco2e)
        
        if scope == "Scope 1":
            s1 += calc_tco2e
        elif scope == "Scope 2":
            s2 += calc_tco2e
        else:
            s3 += calc_tco2e
            
        emission_sources.append({
            "id": key,
            "name": name,
            "category": cat,
            "categoryLabel": CATEGORY_LABELS.get(cat, cat.title()),
            "scope": scope,
            "value": val,
            "unit": unit,
            "tCO2e": round(max(0.0, calc_tco2e), 2),
            "percentage": 0.0,
            "isHotspot": False,
            "intensityPerUnit": round((max(0.0, calc_tco2e) * 1000.0) / max(1.0, production_volume), 3)
        })
        
    final_total = max(1.0, total_tco2e)
    for src in emission_sources:
        src["percentage"] = round((src["tCO2e"] / final_total) * 100.0, 2)
        
    # Sort descending
    sorted_sources = sorted(emission_sources, key=lambda x: x["tCO2e"], reverse=True)
    
    return {
        "total_co2e": round(final_total, 2),
        "production_volume": production_volume,
        "carbon_intensity": round(final_total / max(1.0, production_volume), 3),
        "emission_breakdown": sorted_sources,
        "scope_breakdown": {
            "scope1": {
                "tCO2e": round(max(0.0, s1), 2),
                "percentage": round((max(0.0, s1) / final_total) * 100.0, 1)
            },
            "scope2": {
                "tCO2e": round(max(0.0, s2), 2),
                "percentage": round((max(0.0, s2) / final_total) * 100.0, 1)
            },
            "scope3": {
                "tCO2e": round(max(0.0, s3), 2),
                "percentage": round((max(0.0, s3) / final_total) * 100.0, 1)
            }
        },
        "category_breakdown": [
            {
                "category": cat,
                "label": CATEGORY_LABELS.get(cat, cat.title()),
                "tCO2e": round(val, 2),
                "percentage": round((val / final_total) * 100.0, 1)
            }
            for cat, val in category_totals.items()
        ]
    }
