import json
import math
from pathlib import Path
from typing import Any


# ============================================================
# PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

INDUSTRY_CONFIG_DIR = (
    PROJECT_ROOT / "data" / "industries"
)


# ============================================================
# SUPPORTED INDUSTRIES
# ============================================================

SUPPORTED_INDUSTRIES = {
    "textile",
    "steel",
    "food",
    "cement",
    "chemical"
}


# ============================================================
# LOAD INDUSTRY CONFIGURATION
# ============================================================

def load_industry_config(
    industry: str
) -> dict[str, Any]:
    """
    Load the industry JSON configuration.

    Example:
        textile -> data/industries/textile.json
    """

    if not isinstance(industry, str):
        raise TypeError(
            "Industry must be a string."
        )

    normalized_industry = (
        industry.strip().lower()
    )

    if normalized_industry not in SUPPORTED_INDUSTRIES:
        raise ValueError(
            f"Unsupported industry: "
            f"'{industry}'. Supported industries: "
            f"{', '.join(sorted(SUPPORTED_INDUSTRIES))}."
        )

    config_file = (
        INDUSTRY_CONFIG_DIR
        / f"{normalized_industry}.json"
    )

    if not config_file.exists():
        raise FileNotFoundError(
            f"Industry configuration not found: "
            f"{config_file}"
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


# ============================================================
# GET INDUSTRY FIELDS
# ============================================================

def get_industry_fields(
    industry_config: dict[str, Any]
) -> set[str]:
    """
    Extract activity field names used by the industry.

    Example:
        textile.json
        ->
        {
            "electricity_kwh",
            "diesel_litres",
            "cotton_kg",
            ...
        }
    """

    sources = industry_config.get(
        "sources",
        []
    )

    if not isinstance(sources, list):
        raise ValueError(
            "Industry configuration 'sources' "
            "must be a list."
        )

    fields: set[str] = set()

    for source in sources:

        if not isinstance(source, dict):
            raise ValueError(
                "Every source in industry configuration "
                "must be an object."
            )

        activity_field = source.get(
            "activity_field"
        )

        if activity_field:
            fields.add(activity_field)

    return fields


# ============================================================
# VALIDATE INDUSTRY
# ============================================================

def validate_industry(
    industry: Any
) -> list[str]:
    """
    Validate that the industry is supported.
    """

    errors: list[str] = []

    if not isinstance(industry, str):
        errors.append(
            "Industry must be a string."
        )
        return errors

    normalized = (
        industry.strip().lower()
    )

    if normalized not in SUPPORTED_INDUSTRIES:
        errors.append(
            f"Unsupported industry: "
            f"'{industry}'. Supported industries: "
            f"{', '.join(sorted(SUPPORTED_INDUSTRIES))}."
        )

    return errors


# ============================================================
# VALIDATE INDIVIDUAL VALUE
# ============================================================

def validate_field_value(
    field_name: str,
    value: Any
) -> tuple[list[str], list[str]]:
    """
    Validate one standardized numeric field.

    Returns:
        (errors, warnings)
    """

    errors: list[str] = []
    warnings: list[str] = []

    # --------------------------------------------------------
    # Reject boolean values
    # --------------------------------------------------------

    if isinstance(value, bool):
        errors.append(
            f"Field '{field_name}' must be numeric, "
            f"not boolean."
        )
        return errors, warnings

    # --------------------------------------------------------
    # Values should already be numeric because the
    # Unit Normalizer runs before this stage.
    # --------------------------------------------------------

    if not isinstance(value, (int, float)):
        errors.append(
            f"Field '{field_name}' must contain a "
            f"numeric standardized value."
        )
        return errors, warnings

    # --------------------------------------------------------
    # Reject NaN
    # --------------------------------------------------------

    if isinstance(value, float) and math.isnan(value):
        errors.append(
            f"Field '{field_name}' contains NaN."
        )
        return errors, warnings

    # --------------------------------------------------------
    # Reject infinity
    # --------------------------------------------------------

    if isinstance(value, float) and not math.isfinite(value):
        errors.append(
            f"Field '{field_name}' contains "
            f"an invalid infinite value."
        )
        return errors, warnings

    # --------------------------------------------------------
    # Negative values are invalid for our current
    # activity measurements.
    # --------------------------------------------------------

    if value < 0:
        errors.append(
            f"Field '{field_name}' cannot be negative."
        )

    # --------------------------------------------------------
    # Very large values are warnings rather than
    # automatic errors.
    #
    # A very large factory can legitimately have a
    # very large activity value.
    # --------------------------------------------------------

    if value > 10_000_000:
        warnings.append(
            f"Field '{field_name}' has a very large "
            f"value ({value}). Please verify the input."
        )

    return errors, warnings


# ============================================================
# VALIDATE STANDARDIZED DATA AGAINST INDUSTRY CONFIG
# ============================================================

def validate_standardized_data(
    standardized_data: dict[str, Any]
) -> dict[str, Any]:
    """
    Validate data AFTER:
        1. Field mapping
        2. Unit normalization

    The validator does not perform unit conversion.

    Industry configuration determines which fields are
    relevant to the selected industry.
    """

    if not isinstance(standardized_data, dict):
        raise TypeError(
            "standardized_data must be a dictionary."
        )

    errors: list[str] = []
    warnings: list[str] = []

    # ========================================================
    # INDUSTRY
    # ========================================================

    industry = standardized_data.get(
        "industry"
    )

    if industry is None:
        errors.append(
            "Missing required field: 'industry'."
        )

        return {
            "valid": False,
            "industry": None,
            "errors": errors,
            "warnings": warnings,
            "expected_fields": [],
            "provided_fields": [],
            "missing_fields": [],
            "irrelevant_fields": []
        }

    # Validate industry
    industry_errors = validate_industry(
        industry
    )

    if industry_errors:
        errors.extend(industry_errors)

        return {
            "valid": False,
            "industry": industry,
            "errors": errors,
            "warnings": warnings,
            "expected_fields": [],
            "provided_fields": [],
            "missing_fields": [],
            "irrelevant_fields": []
        }

    normalized_industry = (
        industry.strip().lower()
    )

    # ========================================================
    # LOAD INDUSTRY CONFIG
    # ========================================================

    industry_config = load_industry_config(
        normalized_industry
    )

    expected_fields = get_industry_fields(
        industry_config
    )

    # ========================================================
    # PROVIDED FIELDS
    # ========================================================

    provided_fields = (
        set(standardized_data.keys())
        - {"industry"}
    )

    # Fields that do not belong to this industry
    irrelevant_fields = (
        provided_fields - expected_fields
    )

    # Fields expected for this industry but missing
    missing_fields = (
        expected_fields - provided_fields
    )

    # ========================================================
    # WARN ABOUT IRRELEVANT FIELDS
    # ========================================================

    for field_name in sorted(irrelevant_fields):
        warnings.append(
            f"Field '{field_name}' is not defined "
            f"for the '{normalized_industry}' industry "
            f"and will not be used by the analyzer."
        )

    # ========================================================
    # WARN ABOUT MISSING INDUSTRY FIELDS
    #
    # Current industry configs do not define required vs
    # optional fields, so missing fields are warnings.
    # ========================================================

    for field_name in sorted(missing_fields):

        warnings.append(
            f"Industry field '{field_name}' was not provided."
        )

    # ========================================================
    # VALIDATE PROVIDED RELEVANT FIELDS
    # ========================================================

    for field_name in sorted(
        provided_fields & expected_fields
    ):

        value = standardized_data[
            field_name
        ]

        field_errors, field_warnings = (
            validate_field_value(
                field_name,
                value
            )
        )

        errors.extend(field_errors)
        warnings.extend(field_warnings)

    # ========================================================
    # COMPLETENESS
    #
    # Ratio of expected industry fields that were supplied.
    # This is a DATA COMPLETENESS metric, not a scientific
    # confidence measurement.
    # ========================================================

    if len(expected_fields) == 0:
        completeness = 0.0
    else:
        completeness = (
            len(provided_fields & expected_fields)
            / len(expected_fields)
        )

    # ========================================================
    # STATUS
    # ========================================================

    valid = len(errors) == 0

    return {
        "valid": valid,
        "industry": normalized_industry,
        "errors": errors,
        "warnings": warnings,
        "expected_fields": sorted(
            expected_fields
        ),
        "provided_fields": sorted(
            provided_fields & expected_fields
        ),
        "missing_fields": sorted(
            missing_fields
        ),
        "irrelevant_fields": sorted(
            irrelevant_fields
        ),
        "expected_field_count": len(
            expected_fields
        ),
        "provided_field_count": len(
            provided_fields & expected_fields
        ),
        "completeness": round(
            completeness,
            4
        )
    }