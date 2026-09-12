import json
from pathlib import Path
from typing import Any


# ============================================================
# PROJECT PATH
# ============================================================

PROJECT_ROOT = (
    Path(__file__).resolve().parent.parent.parent
)

RECOMMENDATIONS_FILE = (
    PROJECT_ROOT
    / "data"
    / "recommendations.json"
)


# ============================================================
# HOTSPOT ALIASES
#
# The Carbon Analyzer may use human-readable names such as:
# "Purchased Electricity"
#
# The recommendation database uses:
# "electricity"
#
# This map connects the two.
# ============================================================

HOTSPOT_ALIASES: dict[str, str] = {

    "purchased electricity": "electricity",
    "electricity": "electricity",
    "grid electricity": "electricity",

    "diesel": "diesel",
    "diesel fuel": "diesel",

    "natural gas": "natural_gas",

    "lpg": "lpg",

    "cotton": "cotton",

    "polyester": "polyester",
    "polyester / synthetic fibre": "polyester",

    "synthetic fibre": "polyester",
    "synthetic fiber": "polyester",

    "dyes": "dyes",
    "dye": "dyes",

    "chemicals / auxiliaries": "chemicals",
    "chemicals": "chemicals",

    "process water": "water",
    "water": "water",

    "wastewater": "wastewater",

    "textile waste": "textile_waste",

    "coal / coke": "coal",
    "coal / petcoke": "coal",
    "coal": "coal",
    "petcoke": "coal",

    "iron ore": "iron_ore",

    "dri / hbi": "dri",
    "direct reduced iron / hbi": "dri",
    "dri": "dri",

    "scrap steel": "scrap_steel",
    "scrap": "scrap_steel",

    "limestone": "limestone",

    "clinker production": "clinker",
    "clinker": "clinker",

    "gypsum": "gypsum",

    "alternative fuel": "alternative_fuel",

    "raw meal": "raw_meal",

    "industrial waste": "waste",

    "food waste": "food_waste",

    "raw food materials": "raw_food_material",

    "packaging material": "packaging",

    "refrigeration energy": "refrigeration",
    "refrigeration": "refrigeration",

    "chemical raw materials": "raw_materials",
    "chemical raw material": "raw_materials",

    "solvents": "solvents",

    "hazardous waste": "hazardous_waste"
}


# ============================================================
# LOAD RECOMMENDATION DATABASE
# ============================================================

def load_recommendations() -> dict[str, Any]:
    """
    Load recommendations.json.
    """

    if not RECOMMENDATIONS_FILE.exists():
        raise FileNotFoundError(
            f"Recommendation file not found: "
            f"{RECOMMENDATIONS_FILE}"
        )

    try:
        with open(
            RECOMMENDATIONS_FILE,
            "r",
            encoding="utf-8"
        ) as file:
            data = json.load(file)

    except json.JSONDecodeError as exc:
        raise ValueError(
            "recommendations.json contains invalid JSON."
        ) from exc

    if not isinstance(data, dict):
        raise ValueError(
            "Recommendation database must be a JSON object."
        )

    return data


# ============================================================
# NORMALIZE INDUSTRY
# ============================================================

def normalize_industry(
    industry: str
) -> str:
    """
    Normalize industry name.
    """

    if not isinstance(industry, str):
        raise TypeError(
            "Industry must be a string."
        )

    return industry.strip().lower()


# ============================================================
# NORMALIZE HOTSPOT
# ============================================================

def normalize_hotspot(
    hotspot: str
) -> str:
    """
    Convert analyzer hotspot name to the key used by
    recommendations.json.

    Example:
        "Purchased Electricity"
        -> "electricity"
    """

    if not isinstance(hotspot, str):
        raise TypeError(
            "Hotspot must be a string."
        )

    normalized = (
        hotspot.strip().lower()
    )

    return HOTSPOT_ALIASES.get(
        normalized,
        normalized
    )


# ============================================================
# GET CANDIDATE RECOMMENDATIONS
# ============================================================

def get_candidate_recommendations(
    industry: str,
    hotspot: str
) -> list[dict[str, Any]]:
    """
    Retrieve recommendations for a specific
    industry + hotspot combination.

    This function DOES NOT rank or choose the final action.

    It only returns valid candidates.
    """

    recommendations = load_recommendations()

    normalized_industry = normalize_industry(
        industry
    )

    normalized_hotspot = normalize_hotspot(
        hotspot
    )

    # --------------------------------------------------------
    # Industry must exist
    # --------------------------------------------------------

    if normalized_industry not in recommendations:
        raise ValueError(
            f"No recommendation data found for "
            f"industry '{normalized_industry}'."
        )

    industry_data = recommendations[
        normalized_industry
    ]

    if not isinstance(industry_data, dict):
        raise ValueError(
            f"Invalid recommendation data for "
            f"industry '{normalized_industry}'."
        )

    # --------------------------------------------------------
    # Hotspot must exist for this industry
    # --------------------------------------------------------

    candidates = industry_data.get(
        normalized_hotspot
    )

    if candidates is None:
        return []

    if not isinstance(candidates, list):
        raise ValueError(
            f"Recommendations for "
            f"'{normalized_industry}/{normalized_hotspot}' "
            f"must be a list."
        )

    return candidates


# ============================================================
# SCORE BASIC FEASIBILITY
# ============================================================

def calculate_feasibility_score(
    recommendation: dict[str, Any]
) -> float:
    """
    Calculate a simple transparent feasibility score.

    This is NOT an ML model.

    Higher score = easier / lower-capital intervention.

    We will later let the Recommendation Agent and LLM
    reason over this information.
    """

    capital_level = recommendation.get(
        "capital_level",
        "medium"
    )

    difficulty = recommendation.get(
        "implementation_difficulty",
        "medium"
    )

    capital_scores = {
        "low": 100.0,
        "medium": 60.0,
        "high": 20.0
    }

    difficulty_scores = {
        "easy": 100.0,
        "medium": 60.0,
        "hard": 20.0
    }

    capital_score = capital_scores.get(
        capital_level,
        50.0
    )

    difficulty_score = difficulty_scores.get(
        difficulty,
        50.0
    )

    return (
        capital_score * 0.5
        +
        difficulty_score * 0.5
    )


# ============================================================
# RANK CANDIDATE RECOMMENDATIONS
# ============================================================

def rank_candidate_recommendations(
    candidates: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """
    Rank candidate recommendations using transparent
    feasibility and circularity heuristics.

    This is intentionally simple.

    It is NOT a trained ML model.

    Later this can be replaced by a learned model or
    supported by an LLM.
    """

    ranked: list[dict[str, Any]] = []

    for candidate in candidates:

        if not isinstance(candidate, dict):
            continue

        feasibility = calculate_feasibility_score(
            candidate
        )

        circularity_bonus = (
            10.0
            if candidate.get("circularity") is True
            else 0.0
        )

        score = (
            feasibility * 0.9
            +
            circularity_bonus
        )

        # Keep score between 0 and 100
        score = min(
            100.0,
            max(0.0, score)
        )

        ranked.append(
            {
                **candidate,
                "feasibility_score": round(
                    feasibility,
                    2
                ),
                "candidate_score": round(
                    score,
                    2
                )
            }
        )

    ranked.sort(
        key=lambda item: item["candidate_score"],
        reverse=True
    )

    return ranked


# ============================================================
# MAIN RECOMMENDATION ENGINE FUNCTION
# ============================================================

def generate_candidates(
    industry: str,
    hotspot: str
) -> dict[str, Any]:
    """
    Main entry point for the recommendation engine.

    It:
        1. normalizes industry/hotspot
        2. retrieves matching recommendations
        3. ranks them using simple transparent heuristics

    It does NOT use an LLM.
    """

    normalized_industry = normalize_industry(
        industry
    )

    normalized_hotspot = normalize_hotspot(
        hotspot
    )

    candidates = get_candidate_recommendations(
        normalized_industry,
        normalized_hotspot
    )

    ranked_candidates = (
        rank_candidate_recommendations(
            candidates
        )
    )

    return {
        "industry": normalized_industry,
        "hotspot": normalized_hotspot,
        "candidate_count": len(
            ranked_candidates
        ),
        "candidates": ranked_candidates
    }