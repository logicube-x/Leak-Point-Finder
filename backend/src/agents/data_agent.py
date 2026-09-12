from typing import Any

from src.agents.field_mapper import map_fields
from src.agents.unit_normalizer import normalize_fields
from src.agents.validator import validate_standardized_data
from src.agents.confidence import calculate_confidence


def run_data_agent(
    raw_data: dict[str, Any]
) -> dict[str, Any]:
    """
    Main Data Agent pipeline.

    Pipeline:

        Raw Data
            ↓
        Field Mapping
            ↓
        Unit Normalization
            ↓
        Industry-aware Validation
            ↓
        Confidence Assessment
            ↓
        Standardized Data

    The returned standardized_data is designed to be
    passed directly to the Carbon Analyzer.
    """

    if not isinstance(raw_data, dict):
        raise TypeError(
            "raw_data must be a dictionary."
        )

    # ========================================================
    # STEP 1: FIELD MAPPING
    # ========================================================

    mapped_data = map_fields(
        raw_data
    )

    # ========================================================
    # STEP 2: UNIT NORMALIZATION
    # ========================================================

    normalized_data = normalize_fields(
        mapped_data
    )

    # ========================================================
    # STEP 3: VALIDATION
    # ========================================================

    validation_result = validate_standardized_data(
        normalized_data
    )

    # ========================================================
    # STEP 4: CONFIDENCE
    # ========================================================

    confidence_result = calculate_confidence(
        validation_result
    )

    # ========================================================
    # FINAL STATUS
    # ========================================================

    if validation_result["valid"]:
        status = "success"
    else:
        status = "validation_failed"

    # ========================================================
    # RETURN FINAL DATA AGENT RESULT
    # ========================================================

    return {
        "status": status,

        "standardized_data": normalized_data,

        "validation": validation_result,

        "confidence": confidence_result
    }