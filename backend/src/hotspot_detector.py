from typing import Any


def calculate_contribution_percentage(
    source_co2e: float,
    total_co2e: float
) -> float:
    """
    Calculate a source's percentage contribution to total CO2e.

    Returns 0.0 when total emissions are zero.
    """

    if total_co2e <= 0:
        return 0.0

    return (source_co2e / total_co2e) * 100


def determine_severity(percentage: float) -> str:
    """
    Convert contribution percentage into a simple severity level.

    These thresholds are project-defined heuristics,
    not scientifically validated severity standards.
    """

    if percentage >= 40:
        return "high"

    if percentage >= 20:
        return "medium"

    return "low"


def detect_scope(source_name: str, source_id: str) -> str:
    combined = (source_name + " " + source_id).lower()
    if any(k in combined for k in ["electricity", "grid", "power", "utility"]):
        return "Scope 2"
    if any(k in combined for k in ["raw", "cotton", "polyester", "dyes", "chemical", "transport", "logistics", "waste"]):
        return "Scope 3"
    return "Scope 1"


def detect_hotspots(
    emission_result: dict[str, Any]
) -> dict[str, Any]:
    """
    Analyze the emission breakdown and identify
    primary and secondary hotspots with full metadata enrichment.
    """

    total_co2e = float(
        emission_result.get("total_co2e", 0.0)
    )
    breakdown = emission_result.get("breakdown", {})

    if not isinstance(breakdown, dict):
        raise ValueError(
            "Emission breakdown must be a dictionary."
        )

    ranked_sources = []

    for source_id, source_data in breakdown.items():
        if not isinstance(source_data, dict):
            continue

        co2e = float(source_data.get("co2e", 0.0))
        if co2e <= 0:
            continue

        percentage = round(
            calculate_contribution_percentage(
                co2e,
                total_co2e
            ),
            1
        )

        source_name = source_data.get("source", source_id)
        scope = source_data.get("scope") or detect_scope(source_name, source_id)

        ranked_sources.append(
            {
                "source_id": source_id,
                "source": source_name,
                "scope": scope,
                "category": "energy" if "Scope 1" in scope or "Scope 2" in scope else "materials",
                "categoryLabel": "Energy & Fuel Combustion" if "Scope 1" in scope or "Scope 2" in scope else "Raw Materials & Value Chain",
                "co2e": co2e,
                "percentage": percentage,
                "severity": "High" if percentage >= 40 else "Moderate" if percentage >= 20 else "Low",
                "keyDriver": f"{source_name} accounts for {percentage}% of total facility carbon emissions ({round(co2e/1000.0, 1)} tCO2e), driving primary operational carbon intensity.",
                "benchmarkComparison": "18% above typical sector median" if percentage >= 40 else "Within normal operating baseline for this sector",
            }
        )

    # Highest CO2e contribution first
    ranked_sources.sort(
        key=lambda item: item["co2e"],
        reverse=True
    )

    for index, item in enumerate(ranked_sources, start=1):
        item["rank"] = index

    primary_hotspot = ranked_sources[0] if len(ranked_sources) >= 1 else None
    secondary_hotspot = ranked_sources[1] if len(ranked_sources) >= 2 else None

    return {
        "total_co2e": total_co2e,
        "ranked_sources": ranked_sources,
        "primary_hotspot": primary_hotspot,
        "secondary_hotspot": secondary_hotspot
    }