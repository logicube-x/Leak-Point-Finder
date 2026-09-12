"""
Adapter for frontend assessment payloads.

The frontend stores some values in display units such as:
- MWh
- kL
- tonnes
- 1,000 m3
- 10,000 tonne-km

The backend carbon engine expects canonical units such as:
- kWh
- litres
- kg
- m3
- tonne-km

This adapter converts frontend values into backend canonical values
before the Data Agent runs.
"""


FRONTEND_CONVERSIONS = {
    # -----------------------------------------
    # Electricity
    # Frontend: MWh
    # Backend: kWh
    # -----------------------------------------
    "grid_electricity": lambda value: value * 1000,

    # -----------------------------------------
    # Natural gas
    # Frontend: 1,000 m3
    # Backend: m3
    # -----------------------------------------
    "natural_gas": lambda value: value * 1000,

    # -----------------------------------------
    # Diesel
    # Frontend: kL
    # Backend: litres
    # -----------------------------------------
    "diesel_fuel": lambda value: value * 1000,

    # -----------------------------------------
    # Raw cotton
    # Frontend: tonnes
    # Backend: kg
    # -----------------------------------------
    "raw_cotton": lambda value: value * 1000,

    # -----------------------------------------
    # Polyester
    # Frontend: tonnes
    # Backend: kg
    # -----------------------------------------
    "polyester_fibre": lambda value: value * 1000,

    # -----------------------------------------
    # Dyes + chemicals
    # Frontend: tonnes
    # Backend: kg
    # -----------------------------------------
    "dyes_chemicals": lambda value: value * 1000,

    # -----------------------------------------
    # Process water
    # Frontend: 1,000 m3
    # Backend: m3
    # -----------------------------------------
    "process_water": lambda value: value * 1000,

    # -----------------------------------------
    # Wastewater
    # Frontend: 1,000 m3
    # Backend: m3
    # -----------------------------------------
    "wastewater_volume": lambda value: value * 1000,

    # -----------------------------------------
    # Textile waste
    # Frontend: tonnes
    # Backend: kg
    # -----------------------------------------
    "textile_waste_landfill": lambda value: value * 1000,

    # -----------------------------------------
    # Logistics
    # Frontend: 10,000 tonne-km
    # Backend: tonne-km
    # -----------------------------------------
    "inbound_logistics": lambda value: value * 10000,
    "outbound_distribution": lambda value: value * 10000,

    # -----------------------------------------
    # Compressed air
    # Frontend: MWh
    # Backend: kWh
    #
    # This field is preserved for future use.
    # -----------------------------------------
    "compressed_air": lambda value: value * 1000,

    # -----------------------------------------
    # Recycled fibre
    # Frontend: tonnes
    # Backend: kg
    #
    # This field is preserved for future use.
    # -----------------------------------------
    "recycled_fibre_used": lambda value: value * 1000,
}


def adapt_frontend_payload(raw_data: dict) -> dict:
    """
    Convert frontend display-unit values into backend canonical units.

    Unknown fields are passed through unchanged.
    """

    adapted = {}

    for key, value in raw_data.items():

        if key in FRONTEND_CONVERSIONS:
            try:
                adapted[key] = FRONTEND_CONVERSIONS[key](float(value))
            except (TypeError, ValueError):
                # Let the normal validation pipeline handle
                # invalid/non-numeric values.
                adapted[key] = value
        else:
            adapted[key] = value

    return adapted