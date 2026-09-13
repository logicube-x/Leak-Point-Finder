from typing import Any, Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.frontend_adapter import adapt_frontend_payload
from src.agents.data_agent import run_data_agent
from src.analyzer import analyze_factory
from src.agents.recommendation_engine import generate_candidates
from src.country_db import get_country_info
from src.cost_engine import enrich_recommendations_with_costs
from src.scenario_builder import build_scenarios
from src.llm_narrative_agent import generate_llm_report_narrative


# ---------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------

app = FastAPI(
    title="Industrial Carbon Hotspot Intelligence API",
    version="2.0.0",
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Health Check
# ---------------------------------------------------------

@app.get("/health")
def health_check() -> Dict[str, Any]:
    return {
        "status": "ok",
        "service": "industrial-carbon-hotspot-intelligence",
        "version": "2.0.0",
    }


# ---------------------------------------------------------
# Main Analysis API
# ---------------------------------------------------------

@app.post("/api/analyze")
def analyze(payload: Dict[str, Any]) -> Dict[str, Any]:

    # 1. Convert frontend units to backend canonical units
    adapted_payload = adapt_frontend_payload(payload)

    # Country ID & metadata
    country_id = payload.get("country") or payload.get("country_id") or "global_default"
    country_info = get_country_info(str(country_id))
    adapted_payload["country"] = country_info["id"]

    # 2. Run Data Agent
    data_agent_result = run_data_agent(adapted_payload)

    # 3. Stop if Data Agent reports error
    if data_agent_result.get("status") == "error":
        return {
            "analysis_status": "error",
            "data_agent": data_agent_result,
            "carbon_summary": None,
            "emission_breakdown": [],
            "hotspots": [],
            "primary_hotspot": None,
            "secondary_hotspot": None,
            "agent_context": {},
            "recommendations": [],
            "scenarios": {},
            "country": country_info,
            "llm_narrative": {},
        }

    # 4. Standardized Data & Analysis
    standardized_data = data_agent_result.get("standardized_data", {})
    standardized_data["country"] = country_info["id"]
    industry = adapted_payload.get("industry")

    # 5. Carbon Engine + Hotspot Detection
    analysis_result = analyze_factory(standardized_data)

    primary_hotspot = analysis_result.get("primary_hotspot") or {}
    secondary_hotspot = analysis_result.get("secondary_hotspot") or {}

    if isinstance(primary_hotspot, dict) and "percentage" in primary_hotspot:
        primary_hotspot["percentage"] = round(float(primary_hotspot["percentage"]), 1)
    if isinstance(secondary_hotspot, dict) and "percentage" in secondary_hotspot:
        secondary_hotspot["percentage"] = round(float(secondary_hotspot["percentage"]), 1)

    hotspot_name = primary_hotspot.get("source", "") if isinstance(primary_hotspot, dict) else str(primary_hotspot or "")


    # 6. Recommendation Engine Candidates
    raw_recs = generate_candidates(industry=industry, hotspot=hotspot_name)
    candidates_list = raw_recs.get("candidates", [])

    # Total emissions in tCO2e (carbon_summary returns kgCO2e)
    total_kgco2e = analysis_result.get("carbon_summary", {}).get("total_co2e", 0.0)
    total_tco2e = round(total_kgco2e / 1000.0, 2)

    primary_tco2e = primary_hotspot.get("co2e", 0.0) / 1000.0 if isinstance(primary_hotspot, dict) else total_tco2e * 0.4
    prod_vol = float(payload.get("annual_production") or payload.get("annualProductionVolume") or 10000.0)

    # 7. Country-Aware Cost Estimation Engine
    enriched_recommendations = enrich_recommendations_with_costs(
        candidates=candidates_list,
        country_id=country_info["id"],
        primary_hotspot_tco2e=primary_tco2e,
        total_co2e=total_tco2e,
        production_volume=prod_vol,
    )

    # 8. Scenario Builder Engine (Basic, Balanced, Max Reduction)
    scenarios = build_scenarios(
        enriched_recommendations=enriched_recommendations,
        country_id=country_info["id"],
        total_co2e=total_tco2e,
    )

    # 9. LLM Narrative & Synthesis
    facility_name = str(payload.get("facilityName") or payload.get("facility_name") or "Industrial Plant")
    reporting_period = str(payload.get("reportingPeriod") or payload.get("reporting_period") or "Annual")

    llm_narrative = generate_llm_report_narrative(
        facility_name=facility_name,
        industry=str(industry or "industrial"),
        country_name=country_info["name"],
        reporting_period=reporting_period,
        total_co2e=total_tco2e,
        primary_hotspot=primary_hotspot if isinstance(primary_hotspot, dict) else {"source": str(primary_hotspot)},
        secondary_hotspot=secondary_hotspot if isinstance(secondary_hotspot, dict) else {"source": str(secondary_hotspot)},
        scenarios=scenarios,
        confidence=data_agent_result.get("confidence", {}),
    )

    # 10. Complete Enhanced API Response
    return {
        "analysis_status": "success",
        "country": country_info,
        "data_agent": data_agent_result,
        "carbon_summary": {
            "total_co2e": total_kgco2e,
            "total_tCO2e": total_tco2e,
            "unit": "kgCO2e",
        },
        "emission_breakdown": analysis_result.get("emission_breakdown", []),
        "hotspots": analysis_result.get("hotspots", []),
        "primary_hotspot": primary_hotspot,
        "secondary_hotspot": secondary_hotspot,
        "agent_context": analysis_result.get("agent_context", {}),
        "recommendations": enriched_recommendations,
        "scenarios": scenarios,
        "llm_narrative": llm_narrative,
    }