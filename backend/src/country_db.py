from typing import Any, Dict

# ============================================================
# COUNTRY & REGIONAL DATABASE
# Provides country-aware grid electricity emission factors,
# fuel tariffs, currency formatting, and regional cost multipliers.
# ============================================================

COUNTRY_DATABASE: Dict[str, Dict[str, Any]] = {
    "india": {
        "id": "india",
        "name": "India",
        "region": "Asia-Pacific",
        "currency_code": "INR",
        "currency_symbol": "₹",
        "usd_exchange_rate": 83.0,  # 1 USD = 83.0 INR
        "grid_co2e_per_kwh": 0.827,  # kg CO2e / kWh (CEA Baseline)
        "grid_tariff_usd_per_kwh": 0.09,  # ~7.5 INR / kWh
        "natural_gas_usd_per_m3": 0.45,
        "diesel_usd_per_litre": 1.10,
        "coal_usd_per_kg": 0.12,
        "capex_regional_multiplier": 0.60,  # Lower labor & local equipment costs
        "carbon_tax_usd_per_tco2e": 0.0,
        "flag_emoji": "🇮🇳",
    },
    "usa": {
        "id": "usa",
        "name": "United States",
        "region": "North America",
        "currency_code": "USD",
        "currency_symbol": "$",
        "usd_exchange_rate": 1.0,
        "grid_co2e_per_kwh": 0.385,  # kg CO2e / kWh (US eGRID national avg)
        "grid_tariff_usd_per_kwh": 0.14,
        "natural_gas_usd_per_m3": 0.30,
        "diesel_usd_per_litre": 1.05,
        "coal_usd_per_kg": 0.08,
        "capex_regional_multiplier": 1.00,  # Baseline standard
        "carbon_tax_usd_per_tco2e": 0.0,
        "flag_emoji": "🇺🇸",
    },
    "eu_germany": {
        "id": "eu_germany",
        "name": "Germany (EU)",
        "region": "Europe",
        "currency_code": "EUR",
        "currency_symbol": "€",
        "usd_exchange_rate": 0.92,  # 1 USD = 0.92 EUR
        "grid_co2e_per_kwh": 0.350,  # kg CO2e / kWh (German mix)
        "grid_tariff_usd_per_kwh": 0.22,
        "natural_gas_usd_per_m3": 0.70,
        "diesel_usd_per_litre": 1.80,
        "coal_usd_per_kg": 0.18,
        "capex_regional_multiplier": 1.15,  # Higher labor & compliance costs
        "carbon_tax_usd_per_tco2e": 85.0,  # EU ETS carbon price baseline
        "flag_emoji": "🇩🇪",
    },
    "uk": {
        "id": "uk",
        "name": "United Kingdom",
        "region": "Europe",
        "currency_code": "GBP",
        "currency_symbol": "£",
        "usd_exchange_rate": 0.79,  # 1 USD = 0.79 GBP
        "grid_co2e_per_kwh": 0.207,  # kg CO2e / kWh (DESNZ 2024/2026)
        "grid_tariff_usd_per_kwh": 0.25,
        "natural_gas_usd_per_m3": 0.65,
        "diesel_usd_per_litre": 1.75,
        "coal_usd_per_kg": 0.16,
        "capex_regional_multiplier": 1.10,
        "carbon_tax_usd_per_tco2e": 65.0,
        "flag_emoji": "🇬🇧",
    },
    "china": {
        "id": "china",
        "name": "China",
        "region": "Asia-Pacific",
        "currency_code": "CNY",
        "currency_symbol": "¥",
        "usd_exchange_rate": 7.20,  # 1 USD = 7.2 CNY
        "grid_co2e_per_kwh": 0.570,  # kg CO2e / kWh (China National Grid)
        "grid_tariff_usd_per_kwh": 0.10,
        "natural_gas_usd_per_m3": 0.50,
        "diesel_usd_per_litre": 1.15,
        "coal_usd_per_kg": 0.10,
        "capex_regional_multiplier": 0.65,
        "carbon_tax_usd_per_tco2e": 12.0,
        "flag_emoji": "🇨🇳",
    },
    "japan": {
        "id": "japan",
        "name": "Japan",
        "region": "Asia-Pacific",
        "currency_code": "JPY",
        "currency_symbol": "¥",
        "usd_exchange_rate": 150.0,
        "grid_co2e_per_kwh": 0.435,  # kg CO2e / kWh
        "grid_tariff_usd_per_kwh": 0.20,
        "natural_gas_usd_per_m3": 0.80,
        "diesel_usd_per_litre": 1.30,
        "coal_usd_per_kg": 0.15,
        "capex_regional_multiplier": 1.05,
        "carbon_tax_usd_per_tco2e": 25.0,
        "flag_emoji": "🇯🇵",
    },
    "global_default": {
        "id": "global_default",
        "name": "Global Baseline / Other Region",
        "region": "Global",
        "currency_code": "USD",
        "currency_symbol": "$",
        "usd_exchange_rate": 1.0,
        "grid_co2e_per_kwh": 0.475,  # IEA global average grid emission factor
        "grid_tariff_usd_per_kwh": 0.12,
        "natural_gas_usd_per_m3": 0.40,
        "diesel_usd_per_litre": 1.20,
        "coal_usd_per_kg": 0.12,
        "capex_regional_multiplier": 1.00,
        "carbon_tax_usd_per_tco2e": 0.0,
        "flag_emoji": "🌐",
    },
}


def get_country_info(country_id: str) -> Dict[str, Any]:
    """
    Retrieve metadata for a given country ID.
    Falls back to global_default if country is missing or invalid.
    """
    if not country_id or not isinstance(country_id, str):
        return COUNTRY_DATABASE["global_default"]

    normalized = country_id.strip().lower().replace(" ", "_")
    return COUNTRY_DATABASE.get(normalized, COUNTRY_DATABASE["global_default"])
