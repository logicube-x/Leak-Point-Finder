import os
import json

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")

def map_raw_fields(raw_data: dict) -> dict:
    industry = raw_data.get("industry", "textile")
    if industry == "food_processing":
        industry = "food"
    
    industry_file = os.path.join(DATA_DIR, "industries", f"{industry}.json")
    if not os.path.exists(industry_file):
        industry_file = os.path.join(DATA_DIR, "industries", "textile.json")
        
    with open(industry_file, "r") as f:
        config = json.load(f)
        
    field_mapping = config.get("field_mapping", {})
    raw_fields = raw_data.get("fields", {})
    
    mapped_fields = {}
    for k, v in raw_fields.items():
        val = float(v) if v is not None and str(v).strip() != "" else 0.0
        mapped_key = field_mapping.get(k, k)
        mapped_fields[mapped_key] = val
        
    return {
        "facility_name": raw_data.get("facilityName", "Industrial Facility"),
        "facility_location": raw_data.get("facilityLocation", "Industrial Region"),
        "reporting_period": raw_data.get("reportingPeriod", "Annual"),
        "industry": industry,
        "production_volume": float(raw_data.get("annualProductionVolume", 10000) or 10000),
        "fields": mapped_fields,
        "raw_inputs": raw_data
    }
