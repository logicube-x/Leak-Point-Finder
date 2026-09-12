import json
from pathlib import Path
from typing import Any

from src.carbon_engine import calculate_emissions
from src.hotspot_detector import detect_hotspots


# Project root:
# carbon-analyzer/
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Industry configuration directory
INDUSTRY_CONFIG_DIR = PROJECT_ROOT / "data" / "industries"


def load_industry_config(industry: str) -> dict[str, Any]:
    """
    Load the configuration file for the selected industry.
    """

    industry = industry.strip().lower()

    config_file = INDUSTRY_CONFIG_DIR / f"{industry}.json"

    if not config_file.exists():
        raise ValueError(
            f"Unsupported industry: '{industry}'"
        )

    try:
        with open(
            config_file,
            "r",
            encoding="utf-8"
        ) as file:
            config = json.load(file)

    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Invalid JSON in industry configuration: "
            f"{config_file}"
        ) from exc

    if not isinstance(config, dict):
        raise ValueError(
            "Industry configuration must be a JSON object."
        )

    return config


def build_agent_context(
    factory_data: dict[str, Any],
    emission_result: dict[str, Any],
    hotspot_result: dict[str, Any]
) -> dict[str, Any]:
    """
    Build a compact, verified context that a future
    Recommendation Agent can consume.

    This is NOT a recommendation.
    It only contains analyzer results.
    """

    primary = hotspot_result.get("primary_hotspot")
    secondary = hotspot_result.get("secondary_hotspot")

    ranked_sources = hotspot_result.get(
        "ranked_sources",
        []
    )

    top_sources = [
        item["source"]
        for item in ranked_sources[:5]
    ]

    return {
        "industry": factory_data.get("industry"),

        "primary_hotspot": (
            primary["source"]
            if primary
            else None
        ),

        "primary_hotspot_percentage": (
            primary["percentage"]
            if primary
            else 0.0
        ),

        "secondary_hotspot": (
            secondary["source"]
            if secondary
            else None
        ),

        "top_emission_sources": top_sources,

        "total_co2e": emission_result["total_co2e"]
    }


def analyze_factory(
    factory_data: dict[str, Any]
) -> dict[str, Any]:
    """
    Main Carbon Analyzer.

    Expected input:
        Standardized factory data produced by
        the future Data Agent.

    Pipeline:

        Factory Data
             ↓
        Industry Config
             ↓
        Carbon Engine
             ↓
        Hotspot Detector
             ↓
        Agent Context
    """

    if not isinstance(factory_data, dict):
        raise TypeError(
            "factory_data must be a dictionary."
        )

    industry = factory_data.get("industry")

    if not industry:
        raise ValueError(
            "Factory data must include an 'industry'."
        )

    # 1. Load industry-specific configuration
    industry_config = load_industry_config(
        industry
    )

    # 2. Calculate carbon emissions
    emission_result = calculate_emissions(
        factory_data,
        industry_config
    )

    # 3. Detect hotspots
    hotspot_result = detect_hotspots(
        emission_result
    )

    # 4. Build future-agent context
    agent_context = build_agent_context(
        factory_data,
        emission_result,
        hotspot_result
    )

    # 5. Return complete analyzer output
    return {
        "analysis_status": "success",

        "industry": industry_config.get(
            "display_name",
            industry
        ),

        "carbon_summary": {
            "total_co2e": emission_result[
                "total_co2e"
            ],
            "unit": emission_result[
                "unit"
            ]
        },

        "emission_breakdown": emission_result[
            "breakdown"
        ],

        "hotspots": hotspot_result[
            "ranked_sources"
        ],

        "primary_hotspot": hotspot_result[
            "primary_hotspot"
        ],

        "secondary_hotspot": hotspot_result[
            "secondary_hotspot"
        ],

        "agent_context": agent_context
    }