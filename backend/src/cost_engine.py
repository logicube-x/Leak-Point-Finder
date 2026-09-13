from typing import Any, Dict, List
from src.country_db import get_country_info

# ============================================================
# DETERMINISTIC COST & FINANCIAL ESTIMATION ENGINE
#
# Calculates country-aware CAPEX, OPEX, annual energy savings,
# payback period, and ROI for decarbonization interventions.
# ============================================================

BASE_INTERVENTION_COSTS: Dict[str, Dict[str, Any]] = {
    # Energy & Electricity
    "vfd_motor_optimization": {
        "base_capex_usd": 35000,
        "opex_ratio": 0.03,  # 3% annual maintenance
        "energy_saving_percent": 0.20,
        "default_lifespan_years": 10,
        "difficulty": "Low",
        "tier": "Quick Win",
    },
    "solar_rooftop_ppa": {
        "base_capex_usd": 180000,
        "opex_ratio": 0.02,
        "energy_saving_percent": 0.35,
        "default_lifespan_years": 25,
        "difficulty": "Medium",
        "tier": "Medium-Term Modernization",
    },
    "heat_recovery_boiler": {
        "base_capex_usd": 75000,
        "opex_ratio": 0.04,
        "energy_saving_percent": 0.25,
        "default_lifespan_years": 15,
        "difficulty": "Medium",
        "tier": "Quick Win",
    },
    "fuel_switching_biogas_ng": {
        "base_capex_usd": 120000,
        "opex_ratio": 0.05,
        "energy_saving_percent": 0.30,
        "default_lifespan_years": 12,
        "difficulty": "High",
        "tier": "Deep Decarbonization",
    },
    "submetering_digital_twin": {
        "base_capex_usd": 25000,
        "opex_ratio": 0.08,  # Software maintenance
        "energy_saving_percent": 0.12,
        "default_lifespan_years": 8,
        "difficulty": "Low",
        "tier": "Quick Win",
    },
    "generic_decarbonization": {
        "base_capex_usd": 50000,
        "opex_ratio": 0.04,
        "energy_saving_percent": 0.20,
        "default_lifespan_years": 10,
        "difficulty": "Medium",
        "tier": "Medium-Term Modernization",
    },
}


def calculate_action_cost_and_roi(
    action: Dict[str, Any],
    country_id: str,
    target_emissions_tco2e: float,
    total_facility_emissions_tco2e: float,
    production_volume: float = 10000.0,
) -> Dict[str, Any]:
    """
    Calculate deterministic cost, savings, payback, and ROI for a single action,
    scaled by facility production volume and country regional multipliers.
    """
    country_info = get_country_info(country_id)
    multiplier = country_info.get("capex_regional_multiplier", 1.0)
    currency_symbol = country_info.get("currency_symbol", "$")
    exchange_rate = country_info.get("usd_exchange_rate", 1.0)
    grid_tariff = country_info.get("grid_tariff_usd_per_kwh", 0.12)
    carbon_tax = country_info.get("carbon_tax_usd_per_tco2e", 0.0)

    # Scale base CAPEX according to production volume relative to baseline (10,000 units)
    scale_factor = (max(100.0, production_volume) / 10000.0) ** 0.65

    # Match intervention template or build baseline
    candidate_key = str(action.get("id") or action.get("key") or "generic_decarbonization")
    template = BASE_INTERVENTION_COSTS.get(candidate_key, BASE_INTERVENTION_COSTS["generic_decarbonization"])

    base_capex_usd = float(action.get("base_capex_usd") or template["base_capex_usd"])
    capex_usd = round(base_capex_usd * scale_factor * multiplier, 2)
    opex_usd = round(capex_usd * template["opex_ratio"], 2)

    # Estimated emission reduction
    potential_reduction_percent = float(action.get("potential_co2_reduction_percent") or action.get("reduction_percent") or 25.0)
    reduced_tco2e = round(target_emissions_tco2e * (potential_reduction_percent / 100.0), 2)

    # Calculate monetary savings
    # 1 tCO2e reduction from electricity corresponds to ~(1000 / grid_co2e) kWh saved
    grid_ef = country_info.get("grid_co2e_per_kwh", 0.5)
    equivalent_kwh_saved = (reduced_tco2e * 1000.0) / max(0.1, grid_ef)
    energy_cost_savings_usd = equivalent_kwh_saved * grid_tariff
    carbon_tax_savings_usd = reduced_tco2e * carbon_tax

    gross_annual_savings_usd = round(energy_cost_savings_usd + carbon_tax_savings_usd, 2)
    net_annual_savings_usd = round(max(500.0, gross_annual_savings_usd - opex_usd), 2)

    # Payback and ROI
    if net_annual_savings_usd > 0:
        payback_years = round(capex_usd / net_annual_savings_usd, 1)
    else:
        payback_years = 99.0

    roi_percent = round((net_annual_savings_usd / capex_usd) * 100.0, 1) if capex_usd > 0 else 0.0

    # Local currency values
    capex_local = round(capex_usd * exchange_rate, 2)
    opex_local = round(opex_usd * exchange_rate, 2)
    net_annual_savings_local = round(net_annual_savings_usd * exchange_rate, 2)

    return {
        "capex_usd": capex_usd,
        "capex_local": capex_local,
        "opex_annual_usd": opex_usd,
        "opex_annual_local": opex_local,
        "annual_savings_usd": net_annual_savings_usd,
        "annual_savings_local": net_annual_savings_local,
        "potential_co2e_reduction_tco2e": reduced_tco2e,
        "potential_co2e_reduction_percent": potential_reduction_percent,
        "payback_period_years": f"{payback_years} yrs" if payback_years < 30 else "> 30 yrs",
        "payback_years_numeric": payback_years,
        "roi_percent": roi_percent,
        "currency_symbol": currency_symbol,
        "currency_code": country_info.get("currency_code", "USD"),
        "tier": action.get("tier") or template["tier"],
        "difficulty": action.get("difficulty") or template["difficulty"],
        "capital_level": (
            "Low (<$25k)" if capex_usd < 25000 else "Medium ($25k-$150k)" if capex_usd <= 150000 else "High (>$150k)"
        ),
    }


def enrich_recommendations_with_costs(
    candidates: List[Dict[str, Any]],
    country_id: str,
    primary_hotspot_tco2e: float,
    total_co2e: float,
    production_volume: float = 10000.0,
) -> List[Dict[str, Any]]:
    """
    Enrich all candidate recommendations with country-aware financial cost estimation.
    """
    enriched = []
    for index, item in enumerate(candidates):
        # Target emissions: primary hotspot for top 2, total for rest
        target_co2e = primary_hotspot_tco2e if index < 2 else total_co2e * 0.4
        financials = calculate_action_cost_and_roi(
            action=item,
            country_id=country_id,
            target_emissions_tco2e=target_co2e,
            total_facility_emissions_tco2e=total_co2e,
            production_volume=production_volume,
        )

        title = item.get("title") or item.get("action") or f"Action {index + 1}"
        hotspot_name = item.get("target_hotspot") or item.get("targetHotspot") or "Facility Operations"

        enriched.append(
            {
                "id": item.get("id") or f"rec-00{index + 1}",
                "title": title,
                "target_hotspot": hotspot_name,
                "why_relevant": item.get("why_relevant") or item.get("description") or f"Targets main emissions in {hotspot_name}.",
                "action_plan": item.get("action_plan") or item.get("action") or item.get("description") or "Implement efficiency controls.",
                "difficulty": financials["difficulty"],
                "capital_level": financials["capital_level"],
                "circularity": item.get("circularity") or "Direct Heat/Energy Reuse",
                "tier": financials["tier"],
                "financials": financials,
                # UI compatibility impact field
                "impact": {
                    "estimatedCostRange": f"{financials['currency_symbol']}{financials['capex_local']:,.0f}",
                    "estimatedCostMinUSD": financials["capex_usd"],
                    "estimatedCostMaxUSD": financials["capex_usd"] * 1.3,
                    "potentialCo2ReductionPercent": financials["potential_co2e_reduction_percent"],
                    "potentialCo2ReductionTons": financials["potential_co2e_reduction_tco2e"],
                    "annualSavingsUSD": financials["annual_savings_usd"],
                    "annualSavingsLocal": financials["annual_savings_local"],
                    "paybackPeriodYears": financials["payback_period_years"],
                    "roiLevel": "High" if financials["roi_percent"] > 25 else "Medium" if financials["roi_percent"] > 10 else "Strategic",
                },
            }
        )
    return enriched
