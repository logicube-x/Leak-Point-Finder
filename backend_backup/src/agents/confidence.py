def compute_confidence(validated_data: dict) -> dict:
    raw_fields = validated_data.get("raw_inputs", {}).get("fields", {})
    validation = validated_data.get("validation", {})
    
    total_points = max(1, len(raw_fields))
    filled_points = sum(1 for v in raw_fields.values() if v is not None and float(v) > 0)
    
    ratio = filled_points / total_points
    score = int(min(98, max(60, round(ratio * 100))))
    
    level = "High" if score >= 85 else "Medium" if score >= 70 else "Preliminary"
    
    confidence_metrics = {
        "score": score,
        "level": level,
        "missing_data_penalty": 100 - score,
        "verified_points_count": filled_points,
        "total_points_count": total_points
    }
    validated_data["confidence"] = confidence_metrics
    return validated_data
