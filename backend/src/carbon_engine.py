import json
from pathlib import Path
from typing import Any

from src.country_db import get_country_info


# Find the project root:
# carbon-analyzer/
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Location of our emission-factor database
EMISSION_FACTORS_FILE = PROJECT_ROOT / "data" / "emission_factors.json"


def load_emission_factors() -> dict[str, Any]:
    """
    Load emission factors from data/emission_factors.json.

    Returns:
        Dictionary containing all emission factors.

    Raises:
        FileNotFoundError: If the factor file does not exist.
        ValueError: If the JSON structure is invalid.
    """
    if not EMISSION_FACTORS_FILE.exists():
        raise FileNotFoundError(
            f"Emission factor file not found: {EMISSION_FACTORS_FILE}"
        )

    try:
        with open(EMISSION_FACTORS_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Invalid JSON in {EMISSION_FACTORS_FILE}"
        ) from exc

    if not isinstance(data, dict):
        raise ValueError("Emission factor file must contain a JSON object.")

    return data


def get_emission_factor(
    emission_factors: dict[str, Any],
    factor_id: str
) -> float:
    """
    Get the numerical CO2e emission factor for a given factor ID.

    Args:
        emission_factors: Loaded emission-factor dictionary.
        factor_id: ID referenced by the industry configuration.

    Returns:
        Emission factor as a float.
    """

    if factor_id not in emission_factors:
        raise KeyError(
            f"Emission factor '{factor_id}' was not found."
        )

    factor_data = emission_factors[factor_id]

    if not isinstance(factor_data, dict):
        raise ValueError(
            f"Emission factor '{factor_id}' must be an object."
        )

    value = factor_data.get("co2e_per_unit")

    if value is None:
        raise ValueError(
            f"Emission factor '{factor_id}' has no 'co2e_per_unit'."
        )

    try:
        return float(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(
            f"Invalid emission factor value for '{factor_id}'."
        ) from exc


def calculate_source_emission(
    activity_value: float,
    emission_factor: float
) -> float:
    """
    Calculate CO2e for a single emission source.

    Formula:
        CO2e = activity value × emission factor
    """

    return activity_value * emission_factor


def calculate_emissions(
    factory_data: dict[str, Any],
    industry_config: dict[str, Any]
) -> dict[str, Any]:
    """
    Calculate estimated CO2e for all applicable sources
    defined in the selected industry configuration.

    IMPORTANT:
    This function assumes the Data Agent has already:
    - validated the data
    - standardized units
    - handled missing/invalid values

    Args:
        factory_data: Standardized factory activity data.
        industry_config: Industry-specific configuration.

    Returns:
        Structured emission breakdown and total CO2e.
    """

    emission_factors = load_emission_factors()

    breakdown: dict[str, Any] = {}
    total_co2e = 0.0

    sources = industry_config.get("sources", [])

    if not isinstance(sources, list):
        raise ValueError(
            "Industry configuration 'sources' must be a list."
        )

    for source in sources:
        source_id = source["id"]
        activity_field = source["activity_field"]
        unit = source["unit"]
        factor_id = source.get("emission_factor_id")

        # Some fields, such as production quantity,
        # are contextual and intentionally have no emission factor.
        if factor_id is None:
            continue

        # If the Data Agent did not provide this optional activity,
        # simply skip it for now.
        if activity_field not in factory_data:
            continue

        activity_value = factory_data[activity_field]

        if activity_value is None:
            continue

        try:
            activity_value = float(activity_value)
        except (TypeError, ValueError) as exc:
            raise ValueError(
                f"Invalid activity value for '{activity_field}'."
            ) from exc

        country_id = factory_data.get("country") or factory_data.get("country_id") or "global_default"
        country_info = get_country_info(str(country_id))

        if "electricity" in factor_id.lower() or "grid" in factor_id.lower():
            factor = country_info.get("grid_co2e_per_kwh", 0.475)
        else:
            factor = get_emission_factor(
                emission_factors,
                factor_id
            )

        co2e = calculate_source_emission(
            activity_value,
            factor
        )

        source_name = source["name"]
        combined_str = (source_name + " " + source_id + " " + (factor_id or "")).lower()
        if any(k in combined_str for k in ["electricity", "grid", "power", "utility"]):
            source_scope = "Scope 2"
        elif any(k in combined_str for k in ["cotton", "polyester", "dyes", "chemical", "water", "waste", "transport", "freight", "logistics", "feedstock", "materials"]):
            source_scope = "Scope 3"
        else:
            source_scope = "Scope 1"

        breakdown[source_id] = {
            "source": source_name,
            "scope": source_scope,
            "activity_value": activity_value,
            "unit": unit,
            "emission_factor_id": factor_id,
            "emission_factor": factor,
            "co2e": co2e
        }

        total_co2e += co2e

    return {
        "total_co2e": total_co2e,
        "unit": "kgCO2e",
        "breakdown": breakdown
    }