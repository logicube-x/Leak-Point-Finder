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


def detect_hotspots(
    emission_result: dict[str, Any]
) -> dict[str, Any]:
    """
    Analyze the emission breakdown and identify
    primary and secondary hotspots.

    Expected input:
        {
            "total_co2e": ...,
            "breakdown": {
                "electricity": {
                    "source": "...",
                    "co2e": ...
                },
                ...
            }
        }

    Returns:
        Ranked emission sources with contribution percentages,
        primary hotspot, and secondary hotspot.
    """

    total_co2e = float(
        emission_result.get("total_co2e", 0.0)
    )
    breakdown = emission_result.get("breakdown", {})

    if not isinstance(breakdown, dict):
        raise ValueError(
            "Emission breakdown must be a dictionary."
        )

    calculated_total = sum(
        float(source_data.get("co2e", 0.0))
        for source_data in breakdown.values()
    )

    if abs(calculated_total - total_co2e) > 0.01:
        raise ValueError(
            "Total CO2e does not match the sum of "
            "the emission breakdown."
        )

    breakdown = emission_result.get("breakdown", {})

    if not isinstance(breakdown, dict):
        raise ValueError(
            "Emission breakdown must be a dictionary."
        )

    ranked_sources = []

    for source_id, source_data in breakdown.items():

        if not isinstance(source_data, dict):
            raise ValueError(
                f"Invalid data for source '{source_id}'."
            )

        co2e = float(source_data.get("co2e", 0.0))

        percentage = calculate_contribution_percentage(
            co2e,
            total_co2e
        )

        ranked_sources.append(
            {
                "source_id": source_id,
                "source": source_data.get(
                    "source",
                    source_id
                ),
                "co2e": co2e,
                "percentage": percentage,
                "severity": determine_severity(
                    percentage
                )
            }
        )

    # Highest CO2e contribution first
    ranked_sources.sort(
        key=lambda item: item["co2e"],
        reverse=True
    )

    # Add rank numbers after sorting
    for index, item in enumerate(
        ranked_sources,
        start=1
    ):
        item["rank"] = index

    primary_hotspot = None
    secondary_hotspot = None

    if len(ranked_sources) >= 1:
        primary_hotspot = ranked_sources[0]

    if len(ranked_sources) >= 2:
        secondary_hotspot = ranked_sources[1]

    return {
        "total_co2e": total_co2e,
        "ranked_sources": ranked_sources,
        "primary_hotspot": primary_hotspot,
        "secondary_hotspot": secondary_hotspot
    }