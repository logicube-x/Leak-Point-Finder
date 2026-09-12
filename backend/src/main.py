from typing import Any, Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.frontend_adapter import adapt_frontend_payload
from src.agents.data_agent import run_data_agent
from src.analyzer import analyze_factory
from src.agents.recommendation_engine import generate_candidates


# ---------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------

app = FastAPI(
    title="Industrial Carbon Hotspot Intelligence API",
    version="1.0.0",
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
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
    }


# ---------------------------------------------------------
# Main Analysis API
# ---------------------------------------------------------

@app.post("/api/analyze")
def analyze(payload: Dict[str, Any]) -> Dict[str, Any]:

    # -----------------------------------------------------
    # 1. Convert frontend units to backend canonical units
    # -----------------------------------------------------

    adapted_payload = adapt_frontend_payload(payload)

    # -----------------------------------------------------
    # 2. Run Data Agent
    # -----------------------------------------------------

    data_agent_result = run_data_agent(adapted_payload)

    # -----------------------------------------------------
    # 3. Stop if Data Agent reports an error
    # -----------------------------------------------------

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
            "recommendations": {},
        }

    # -----------------------------------------------------
    # 4. Get standardized backend data
    # -----------------------------------------------------

    standardized_data = data_agent_result.get(
        "standardized_data",
        {}
    )

    # Keep industry available for recommendations
    industry = adapted_payload.get("industry")

    # -----------------------------------------------------
    # 5. Carbon Engine + Hotspot Detection
    # -----------------------------------------------------

    analysis_result = analyze_factory(
        standardized_data
    )

    # -----------------------------------------------------
    # 6. Extract hotspots
    # -----------------------------------------------------

    primary_hotspot = analysis_result.get(
        "primary_hotspot"
    )

    secondary_hotspot = analysis_result.get(
        "secondary_hotspot"
    )

    # -----------------------------------------------------
    # 7. Prepare primary hotspot name
    #
    # Recommendation engine expects:
    # generate_candidates(industry, hotspot: str)
    # -----------------------------------------------------

    if isinstance(primary_hotspot, dict):
        hotspot_name = primary_hotspot.get(
            "source",
            ""
        )
    else:
        hotspot_name = str(
            primary_hotspot or ""
        )

    # -----------------------------------------------------
    # 8. Recommendation Engine
    # -----------------------------------------------------

    recommendations = generate_candidates(
        industry=industry,
        hotspot=hotspot_name,
    )

    # -----------------------------------------------------
    # 9. Final API Response
    # -----------------------------------------------------

    return {
        "analysis_status": "success",

        "data_agent": data_agent_result,

        "carbon_summary": analysis_result.get(
            "carbon_summary",
            {}
        ),

        "emission_breakdown": analysis_result.get(
            "emission_breakdown",
            []
        ),

        "hotspots": analysis_result.get(
            "hotspots",
            []
        ),

        "primary_hotspot": primary_hotspot,

        "secondary_hotspot": secondary_hotspot,

        "agent_context": analysis_result.get(
            "agent_context",
            {}
        ),

        "recommendations": recommendations,
    }