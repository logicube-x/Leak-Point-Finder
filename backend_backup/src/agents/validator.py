import os
import json

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")

def validate_data(normalized_data: dict) -> dict:
    industry = normalized_data.get("industry", "textile")
    industry_file = os.path.join(DATA_DIR, "industries", f"{industry}.json")
    
    required_fields = []
    if os.path.exists(industry_file):
        with open(industry_file, "r") as f:
            config = json.load(f)
            required_fields = config.get("required_fields", [])
            
    raw_fields = normalized_data.get("raw_inputs", {}).get("fields", {})
    missing = []
    
    for req in required_fields:
        val = raw_fields.get(req)
        if val is None or float(val) <= 0:
            missing.append(req)
            
    normalized_data["validation"] = {
        "is_valid": len(missing) == 0,
        "missing_required": missing,
        "checked_fields_count": len(raw_fields)
    }
    return normalized_data
