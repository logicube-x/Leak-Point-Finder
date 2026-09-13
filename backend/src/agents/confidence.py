from typing import Any


def calculate_confidence(
    validation_result: dict[str, Any]
) -> dict[str, Any]:
    """
    Calculate a transparent data-quality confidence score.

    This is a heuristic score based on:
    - data completeness
    - validation errors
    - validation warnings

    It is NOT a scientifically validated probability.
    """

    if not isinstance(validation_result, dict):
        raise TypeError(
            "validation_result must be a dictionary."
        )

    completeness = float(
        validation_result.get("completeness", 0.0)
    )

    completeness = max(
        0.0,
        min(1.0, completeness)
    )

    errors = validation_result.get("errors", [])
    warnings = validation_result.get("warnings", [])

    if not isinstance(errors, list):
        errors = []

    if not isinstance(warnings, list):
        warnings = []

    # Start from completeness.
    score = completeness * 100.0

    # Warnings reduce confidence moderately.
    warning_penalty = min(
        len(warnings) * 5.0,
        30.0
    )

    score -= warning_penalty

    # Any actual validation error means the dataset
    # cannot be considered highly trustworthy.
    if errors:
        error_penalty = min(
            len(errors) * 20.0,
            60.0
        )

        score -= error_penalty

    score = max(
        0.0,
        min(100.0, score)
    )

    # Never label data with validation errors as high confidence.
    if errors:
        if score >= 75:
            level = "Medium"
        else:
            level = "Preliminary"

    else:
        if score >= 80:
            level = "High"
        elif score >= 60:
            level = "Medium"
        else:
            level = "Preliminary"


    return {
        "score": round(score, 2),
        "level": level,
        "basis": {
            "completeness": round(
                completeness * 100,
                2
            ),
            "error_count": len(errors),
            "warning_count": len(warnings)
        },
        "note": (
            "Heuristic data-quality score; "
            "not a scientifically validated probability."
        )
    }