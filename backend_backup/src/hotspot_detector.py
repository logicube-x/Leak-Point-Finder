from typing import Any


def calculate_contribution_percentage(
    source_co2e: float,
    total_co2e: float
) -> float:
    """
    Calculate the percentage contribution of one source.
    """

    if total_co2e <= 0:
        return 0.0

    return (source_co2e / total_co2e) * 100.0


def determine_severity(
    percentage: float
) -> str:
    """
    Project-defined contribution severity.

    These are heuristics for UI prioritization,
    not scientific standards.
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
    Identify and rank emission hotspots from the
    actual Carbon Engine output.

    IMPORTANT:
    No hotspot is hardcoded.
    """

    total_co2e = float(
        emission_result.get(
            "total_co2e",
            0.0
        )
    )

    breakdown = emission_result.get(
        "breakdown",
        {}
    )

    if not isinstance(breakdown, dict):
        raise ValueError(
            "Emission breakdown must be a dictionary."
        )

    # --------------------------------------------------------
    # Verify the total matches the breakdown.
    # --------------------------------------------------------

    calculated_total = sum(
        float(
            source_data.get(
                "co2e",
                0.0
            )
        )
        for source_data in breakdown.values()
    )

    if abs(
        calculated_total - total_co2e
    ) > 0.01:
        raise ValueError(
            "Total CO2e does not match the "
            "sum of the emission breakdown."
        )

    ranked_sources = []

    # --------------------------------------------------------
    # Calculate contribution for every source.
    # --------------------------------------------------------

    for source_id, source_data in breakdown.items():

        if not isinstance(
            source_data,
            dict
        ):
            raise ValueError(
                f"Invalid data for source "
                f"'{source_id}'."
            )

        co2e = float(
            source_data.get(
                "co2e",
                0.0
            )
        )

        percentage = (
            calculate_contribution_percentage(
                co2e,
                total_co2e
            )
        )

        ranked_sources.append(
            {
                "source_id": source_id,
                "source": source_data.get(
                    "source",
                    source_id
                ),
                "co2e": co2e,
                "percentage": round(
                    percentage,
                    2
                ),
                "severity": determine_severity(
                    percentage
                )
            }
        )

    # --------------------------------------------------------
    # Highest contributor first.
    # --------------------------------------------------------

    ranked_sources.sort(
        key=lambda item: item["co2e"],
        reverse=True
    )

    # --------------------------------------------------------
    # Assign ranks.
    # --------------------------------------------------------

    for rank, item in enumerate(
        ranked_sources,
        start=1
    ):
        item["rank"] = rank

    primary_hotspot = (
        ranked_sources[0]
        if len(ranked_sources) >= 1
        else None
    )

    secondary_hotspot = (
        ranked_sources[1]
        if len(ranked_sources) >= 2
        else None
    )

    return {
        "total_co2e": total_co2e,
        "ranked_sources": ranked_sources,
        "primary_hotspot": primary_hotspot,
        "secondary_hotspot": secondary_hotspot
    }