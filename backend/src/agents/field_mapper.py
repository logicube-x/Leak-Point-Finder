"""
Field mapping layer.

Maps frontend/user-facing field names to the canonical fields
used by the backend carbon analysis pipeline.
"""


FIELD_MAP = {
    # -------------------------
    # General / production
    # -------------------------
    "annual_production": "annual_production",
    "production": "annual_production",
    "production_volume": "annual_production",
    "operating_hours": "operating_hours",

    # -------------------------
    # Electricity
    # Frontend: MWh
    # Backend canonical: electricity_kwh
    # -------------------------
    "grid_electricity": "electricity_kwh",
    "electricity": "electricity_kwh",
    "electricity_consumption": "electricity_kwh",
    "purchased_electricity": "electricity_kwh",

    # -------------------------
    # Fuel
    # -------------------------
    "diesel_fuel": "diesel_litres",
    "diesel": "diesel_litres",

    # -------------------------
    # Natural gas
    # -------------------------
    "natural_gas": "natural_gas_m3",
    "natural_gas_consumption": "natural_gas_m3",

    # -------------------------
    # Textile raw materials
    # -------------------------
    "raw_cotton": "cotton_kg",
    "cotton": "cotton_kg",
    "cotton_kg": "cotton_kg",

    "polyester_fibre": "polyester_kg",
    "polyester": "polyester_kg",
    "polyester_kg": "polyester_kg",

    # -------------------------
    # Combined textile chemical field
    # Frontend:
    # dyes_chemicals
    #
    # Backend:
    # dyes_chemicals_kg
    # -------------------------
    "dyes_chemicals": "dyes_chemicals_kg",
    "dyes_chemicals_kg": "dyes_chemicals_kg",

    # Keep these aliases for compatibility
    "dyes": "dyes_kg",
    "dyes_kg": "dyes_kg",
    "chemicals": "chemicals_kg",
    "chemicals_kg": "chemicals_kg",

    # -------------------------
    # Water
    # -------------------------
    "process_water": "process_water_m3",
    "process_water_m3": "process_water_m3",

    "wastewater_volume": "wastewater_m3",
    "wastewater": "wastewater_m3",
    "wastewater_m3": "wastewater_m3",

    # -------------------------
    # Textile waste
    # -------------------------
    "textile_waste_landfill": "textile_waste_kg",
    "textile_waste": "textile_waste_kg",
    "textile_waste_kg": "textile_waste_kg",

    # -------------------------
    # Logistics / transport
    # -------------------------
    "inbound_logistics": "transport_tonne_km",
    "outbound_distribution": "transport_tonne_km",
    "transport": "transport_tonne_km",
    "transport_tonne_km": "transport_tonne_km",

    # -------------------------
    # Other compatibility fields
    # -------------------------
    "lpg": "lpg_kg",
    "lpg_kg": "lpg_kg",

    "compressed_air": "compressed_air_mwh",

    "recycled_fibre_used": "recycled_fibre_kg",
}


def map_fields(raw_data: dict) -> dict:
    """
    Convert frontend/user-facing field names into backend
    canonical field names.

    Unknown fields are preserved so the pipeline can still
    inspect or report them.
    """

    mapped = {}

    for key, value in raw_data.items():
        # Normalize the key for matching
        normalized_key = str(key).strip().lower()

        canonical_key = FIELD_MAP.get(
            normalized_key,
            normalized_key
        )

        mapped[canonical_key] = value

    return mapped