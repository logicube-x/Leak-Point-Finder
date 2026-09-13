from typing import Any, Dict, List
from src.country_db import get_country_info

# ============================================================
# DETERMINISTIC SCENARIO BUILDER ENGINE
# Groups actions into 3 explicit decarbonization pathways:
# 1. Basic Scenario (Quick Wins, Low CAPEX)
# 2. Balanced Scenario (Optimized ROI, Moderate Investment)
# 3. Maximum Reduction Scenario (Deep Decarbonization & Clean Tech)
# ============================================================


def build_scenarios(
    enriched_recommendations: List[Dict[str, Any]],
    country_id: str,
    total_co2e: float,
) -> Dict[str, Any]:
    """
    Build Basic, Balanced, and Maximum Reduction scenarios deterministically
    from enriched mitigation recommendations.
    """
    country_info = get_country_info(country_id)
    symbol = country_info.get("currency_symbol", "$")
    exchange_rate = country_info.get("usd_exchange_rate", 1.0)

    # Filter actions by tier/capital level
    basic_actions = [
        item for item in enriched_recommendations
        if item.get("capital_level") == "Low (<$25k)" or item.get("tier") == "Quick Win"
    ]
    if not basic_actions and enriched_recommendations:
        basic_actions = enriched_recommendations[:1]

    balanced_actions = [
        item for item in enriched_recommendations
        if item.get("tier") in ["Quick Win", "Medium-Term Modernization"]
    ]
    if not balanced_actions and enriched_recommendations:
        balanced_actions = enriched_recommendations[: min(2, len(enriched_recommendations))]

    max_actions = list(enriched_recommendations)

    def calculate_scenario_metrics(actions: List[Dict[str, Any]], name: str, description: str):
        total_capex_usd = sum(a["financials"]["capex_usd"] for a in actions)
        total_opex_usd = sum(a["financials"]["opex_annual_usd"] for a in actions)
        total_savings_usd = sum(a["financials"]["annual_savings_usd"] for a in actions)
        total_reduction_tco2e = sum(a["financials"]["potential_co2e_reduction_tco2e"] for a in actions)

        # Cap total reduction at 85% of facility emissions to remain physically realistic
        total_reduction_tco2e = min(total_reduction_tco2e, total_co2e * 0.85)
        reduction_percentage = round((total_reduction_tco2e / total_co2e) * 100.0, 1) if total_co2e > 0 else 0.0

        net_savings = max(100.0, total_savings_usd - total_opex_usd)
        payback_years = round(total_capex_usd / net_savings, 1) if net_savings > 0 else 99.0

        total_capex_local = round(total_capex_usd * exchange_rate, 2)
        total_savings_local = round(total_savings_usd * exchange_rate, 2)

        return {
            "name": name,
            "description": description,
            "action_count": len(actions),
            "actions": [a["title"] for a in actions],
            "total_capex_usd": round(total_capex_usd, 2),
            "total_capex_local": total_capex_local,
            "total_opex_annual_usd": round(total_opex_usd, 2),
            "total_annual_savings_usd": round(total_savings_usd, 2),
            "total_annual_savings_local": total_savings_local,
            "co2e_reduction_tco2e": round(total_reduction_tco2e, 2),
            "co2e_reduction_percentage": reduction_percentage,
            "remaining_emissions_tco2e": round(max(0.0, total_co2e - total_reduction_tco2e), 2),
            "payback_years": f"{payback_years} yrs" if payback_years < 30 else "> 30 yrs",
            "currency_symbol": symbol,
        }

    return {
        "basic": calculate_scenario_metrics(
            basic_actions,
            "Basic / Quick Wins Pathway",
            "Focuses on low-hanging fruit, variable frequency drives, insulation, and operational tuning with minimal upfront capital.",
        ),
        "balanced": calculate_scenario_metrics(
            balanced_actions,
            "Balanced Modernization Pathway",
            "Combines quick wins with medium-term heat recovery, sub-metering, and digital controls for optimal financial ROI.",
        ),
        "maximum_reduction": calculate_scenario_metrics(
            max_actions,
            "Maximum Reduction Pathway",
            "Aggressive decarbonization adopting solar PPA, fuel switching, circular feedstock recovery, and high-efficiency capital overhauls.",
        ),
    }
