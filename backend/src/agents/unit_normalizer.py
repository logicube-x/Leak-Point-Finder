import re
from typing import Any


# ============================================================
# STANDARD UNITS
# These are the units expected by the Carbon Analyzer.
# ============================================================

FIELD_STANDARD_UNITS: dict[str, str] = {
    "electricity_kwh": "kwh",
    "diesel_litres": "litres",
    "natural_gas_m3": "m3",
    "lpg_kg": "kg",

    "cotton_kg": "kg",
    "polyester_kg": "kg",
    "dyes_kg": "kg",
    "chemicals_kg": "kg",

    "process_water_m3": "m3",
    "wastewater_m3": "m3",
    "textile_waste_kg": "kg",

    "transport_tonne_km": "tonne-km",
    "production_kg": "kg"
}


# ============================================================
# UNIT ALIASES
# Converts different ways of writing the same unit into
# one canonical unit name.
# ============================================================

UNIT_ALIASES: dict[str, str] = {

    # Energy
    "kwh": "kwh",
    "kw h": "kwh",
    "kilowatt hour": "kwh",
    "kilowatt hours": "kwh",

    "mwh": "mwh",
    "mw h": "mwh",
    "megawatt hour": "mwh",
    "megawatt hours": "mwh",

    # Mass
    "kg": "kg",
    "kilogram": "kg",
    "kilograms": "kg",

    "g": "g",
    "gram": "g",
    "grams": "g",

    "tonne": "tonne",
    "tonnes": "tonne",
    "metric tonne": "tonne",
    "metric tonnes": "tonne",
    "t": "tonne",

    # Volume
    "m3": "m3",
    "m 3": "m3",
    "m^3": "m3",
    "m³": "m3",
    "cubic metre": "m3",
    "cubic metres": "m3",
    "cubic meter": "m3",
    "cubic meters": "m3",

    "l": "litres",
    "lt": "litres",
    "ltr": "litres",
    "litre": "litres",
    "litres": "litres",
    "liter": "litres",
    "liters": "litres",

    # Transport
    "tonne-km": "tonne-km",
    "tonne km": "tonne-km",
    "tonne kilometer": "tonne-km",
    "tonne kilometers": "tonne-km",
    "tonne kilometre": "tonne-km",
    "tonne kilometres": "tonne-km"
}


# ============================================================
# CONVERSION FACTORS
#
# Key:
#     (input unit, standard unit)
#
# Example:
#     ("mwh", "kwh") = 1000
# ============================================================

UNIT_CONVERSIONS: dict[tuple[str, str], float] = {

    # Electricity
    ("kwh", "kwh"): 1.0,
    ("mwh", "kwh"): 1000.0,

    # Mass
    ("kg", "kg"): 1.0,
    ("g", "kg"): 0.001,
    ("tonne", "kg"): 1000.0,

    # Volume
    ("m3", "m3"): 1.0,

    # Liquid volume
    ("litres", "litres"): 1.0,

    # Transport
    ("tonne-km", "tonne-km"): 1.0
}


# ============================================================
# UNIT NORMALIZATION
# ============================================================

def normalize_unit_name(unit: str) -> str:
    """
    Convert different spellings/formats of units into
    one canonical unit name.

    Examples:
        "MWh" -> "mwh"
        "m³"  -> "m3"
        "Litres" -> "litres"
        "Tonnes" -> "tonne"
    """

    if not isinstance(unit, str):
        raise TypeError("Unit must be a string.")

    normalized = unit.strip().lower()

    # Remove commas that may appear inside text such as:
    # "25,000 kWh"
    normalized = normalized.replace(",", "")

    # Normalize unicode superscript
    normalized = normalized.replace("³", "3")

    # Normalize ^3 notation
    normalized = normalized.replace("^3", "3")

    # Collapse whitespace
    normalized = " ".join(normalized.split())

    # Convert known alias to canonical representation
    return UNIT_ALIASES.get(
        normalized,
        normalized
    )


# ============================================================
# PARSE VALUE + UNIT
# ============================================================

def parse_value_and_unit(value: Any) -> tuple[float, str]:
    """
    Parse values such as:

        "25 MWh"
        "700 litres"
        "4 tonnes"
        "3000 m3"
        "3000 m³"
        "2,500 kg"

    Returns:
        (numeric_value, canonical_unit)

    Numeric-only values are supported too.
    In that case the returned unit is "" and the caller
    assumes the value is already in the field's standard unit.
    """

    # --------------------------------------------------------
    # Case 1: Already numeric
    # --------------------------------------------------------

    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return float(value), ""


    # --------------------------------------------------------
    # Case 2: String
    # --------------------------------------------------------

    if not isinstance(value, str):
        raise ValueError(
            f"Unsupported value type: {type(value).__name__}"
        )

    text = value.strip()

    if not text:
        raise ValueError("Value cannot be empty.")


    # --------------------------------------------------------
    # Handle common formatting
    # --------------------------------------------------------

    # Example:
    # "3,000 m3" -> "3000 m3"
    text = text.replace(",", "")

    # Normalize unicode superscript 3
    text = text.replace("³", "3")

    # Normalize "^3"
    text = text.replace("^3", "3")

    # Collapse spaces
    text = " ".join(text.split())


    # --------------------------------------------------------
    # Regex
    #
    # Number:
    #   25
    #   25.5
    #   -10
    #
    # Optional unit:
    #   MWh
    #   m3
    #   kg
    #   litres
    #   tonne-km
    # --------------------------------------------------------

    match = re.fullmatch(
        r"""
        ([+-]?
            (?:\d+(?:\.\d*)?|\.\d+)
        )
        (?:\s*
            ([a-zA-Z0-9\-]+(?:\s+[a-zA-Z0-9\-]+)?)
        )?
        """,
        text,
        re.VERBOSE
    )

    if not match:
        raise ValueError(
            f"Could not parse value: '{value}'"
        )


    numeric_value = float(match.group(1))

    raw_unit = match.group(2)

    # Numeric-only input
    if raw_unit is None:
        return numeric_value, ""


    canonical_unit = normalize_unit_name(raw_unit)

    return numeric_value, canonical_unit


# ============================================================
# CONVERT TO STANDARD UNIT
# ============================================================

def convert_to_standard_unit(
    field_name: str,
    value: Any
) -> float:
    """
    Convert a field value into the standard unit required
    by the Carbon Analyzer.

    Examples:

        electricity_kwh = "25 MWh"
            -> 25000.0

        cotton_kg = "4 tonnes"
            -> 4000.0

        process_water_m3 = "3000 m³"
            -> 3000.0
    """

    # --------------------------------------------------------
    # Check field
    # --------------------------------------------------------

    if field_name not in FIELD_STANDARD_UNITS:
        raise KeyError(
            f"No standard unit configured for '{field_name}'."
        )


    # Standard unit
    standard_unit = FIELD_STANDARD_UNITS[field_name]

    standard_unit = normalize_unit_name(
        standard_unit
    )


    # --------------------------------------------------------
    # Parse input
    # --------------------------------------------------------

    numeric_value, supplied_unit = parse_value_and_unit(
        value
    )


    # --------------------------------------------------------
    # Numeric value without explicit unit
    #
    # Example:
    # electricity_kwh = 25000
    #
    # Since Data Agent's internal contract says numeric
    # values are already standardized, accept it directly.
    # --------------------------------------------------------

    if supplied_unit == "":
        return numeric_value


    # --------------------------------------------------------
    # If the input unit already matches the standard unit
    # --------------------------------------------------------

    if supplied_unit == standard_unit:
        return numeric_value


    # --------------------------------------------------------
    # Find conversion
    # --------------------------------------------------------

    conversion_key = (
        supplied_unit,
        standard_unit
    )

    if conversion_key not in UNIT_CONVERSIONS:
        raise ValueError(
            f"Cannot convert '{supplied_unit}' to "
            f"'{standard_unit}' for field "
            f"'{field_name}'."
        )


    multiplier = UNIT_CONVERSIONS[
        conversion_key
    ]


    # --------------------------------------------------------
    # Apply conversion
    # --------------------------------------------------------

    return numeric_value * multiplier


# ============================================================
# NORMALIZE ALL FIELDS
# ============================================================

def normalize_fields(
    mapped_data: dict[str, Any]
) -> dict[str, Any]:
    """
    Normalize all mapped fields into the standardized
    numeric representation expected by the Carbon Analyzer.

    The 'industry' field is metadata and remains unchanged.
    """

    if not isinstance(mapped_data, dict):
        raise TypeError(
            "mapped_data must be a dictionary."
        )


    normalized_data: dict[str, Any] = {}


    for field_name, value in mapped_data.items():

        # ----------------------------------------------------
        # Industry is metadata.
        # ----------------------------------------------------

        if field_name == "industry":
            normalized_data[
                field_name
            ] = value
            continue


        # ----------------------------------------------------
        # Ignore unknown fields for now.
        # Validation layer will handle them later.
        # ----------------------------------------------------

        if field_name not in FIELD_STANDARD_UNITS:
            continue


        # ----------------------------------------------------
        # Convert field
        # ----------------------------------------------------

        normalized_data[
            field_name
        ] = convert_to_standard_unit(
            field_name,
            value
        )


    return normalized_data