def normalize_units(mapped_data: dict) -> dict:
    fields = mapped_data.get("fields", {})
    normalized_fields = {}
    
    for key, val in fields.items():
        # Clean unit scale conversions if needed
        normalized_fields[key] = max(0.0, float(val))
        
    mapped_data["normalized_fields"] = normalized_fields
    return mapped_data
