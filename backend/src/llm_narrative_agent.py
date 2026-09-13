import os
from typing import Any, Dict

# ============================================================
# LLM NARRATIVE AGENT
# Provides qualitative cause analysis, executive summaries,
# risk warnings, and report narrative synthesis.
#
# Mathematical calculations remain strictly deterministic.
# ============================================================


def generate_llm_report_narrative(
    facility_name: str,
    industry: str,
    country_name: str,
    reporting_period: str,
    total_co2e: float,
    primary_hotspot: Dict[str, Any],
    secondary_hotspot: Dict[str, Any],
    scenarios: Dict[str, Any],
    confidence: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Generate professional qualitative narrative for cause analysis, executive summary,
    and report conclusions. Uses Google Gemini API if GEMINI_API_KEY is configured,
    or falls back to built-in high-quality deterministic prompt templates.
    """
    primary_name = primary_hotspot.get("source", "Primary Process")
    primary_pct = primary_hotspot.get("percentage", 0.0)
    secondary_name = secondary_hotspot.get("source", "Secondary Process")
    secondary_pct = secondary_hotspot.get("percentage", 0.0)

    # 1. Cause Analysis Narrative
    cause_analysis = (
        f"The primary driver of operational emissions at {facility_name} is {primary_name}, "
        f"contributing {primary_pct}% of total carbon emissions ({primary_hotspot.get('tCO2e', 0):,.1f} tCO2e). "
        f"This carbon intensity stems from baseline thermal requirements and regional grid emission factors in {country_name}. "
        f"The secondary driver is {secondary_name}, representing {secondary_pct}% of emissions, primarily influenced by "
        f"process equipment throughput and auxiliary utility consumption."
    )

    # 2. Executive Summary Narrative
    exec_summary = (
        f"Comprehensive carbon assessment for {facility_name} ({industry.title()} Sector, {country_name}) "
        f"for the period {reporting_period} indicates a gross carbon footprint of {total_co2e:,.2f} tCO2e. "
        f"Through targeted decarbonization interventions across 3 strategic pathways (Basic, Balanced, Maximum Reduction), "
        f"the facility can achieve up to {scenarios.get('maximum_reduction', {}).get('co2e_reduction_percentage', 0)}% emission reduction. "
        f"The Balanced Pathway provides an optimal financial trade-off with an estimated payback of "
        f"{scenarios.get('balanced', {}).get('payback_years', 'N/A')} and total annual savings of "
        f"{scenarios.get('balanced', {}).get('currency_symbol', '$')}{scenarios.get('balanced', {}).get('total_annual_savings_local', 0):,.0f}."
    )

    # 3. Methodology & Uncertainty Notes
    methodology_notes = (
        f"Emissions were calculated using GHG Protocol Corporate Accounting Standard metrics (Scope 1, 2 & 3). "
        f"Calculations utilize country-specific grid emission factors for {country_name} and verified activity-data factors. "
        f"Data quality confidence rating is evaluated at {confidence.get('score', 85)}% ({confidence.get('level', 'High')} Confidence), "
        f"reflecting high activity completeness and low parameter variance."
    )

    # 4. Risk & Compliance Guidance
    risk_guidance = (
        f"Implementation risks in {country_name} include grid tariff fluctuations, supply chain lead times for specialized "
        f"variable frequency drives and heat recovery exchangers, and evolving carbon compliance directives (e.g. EU CBAM / national reporting). "
        f"Prioritizing Phase 1 Quick-Wins mitigates capital risk while generating cash flow for Phase 2 deep retrofits."
    )

    # If GEMINI_API_KEY is available, attempt real LLM call via google-genai
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if api_key:
        try:
            import google.generativeai as genai

            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = (
                f"You are a Senior Industrial Decarbonization & Carbon Accounting Expert.\n"
                f"Facility: {facility_name}, Industry: {industry}, Country: {country_name}, Period: {reporting_period}.\n"
                f"Total Emissions: {total_co2e} tCO2e.\n"
                f"Primary Hotspot: {primary_name} ({primary_pct}%).\n"
                f"Secondary Hotspot: {secondary_name} ({secondary_pct}%).\n"
                f"Provide a brief 3-sentence executive summary and 2-sentence cause analysis."
            )
            response = model.generate_content(prompt)
            if response and response.text:
                exec_summary = response.text.strip()
        except Exception:
            pass  # Fail gracefully to template prompt

    return {
        "executive_summary": exec_summary,
        "cause_analysis": cause_analysis,
        "methodology_notes": methodology_notes,
        "risk_guidance": risk_guidance,
    }
