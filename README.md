🌱 Industrial Emission Leak-Point Detector & Circular Alternative Recommender

An AI-powered industrial carbon intelligence platform that helps small and medium industries identify where their carbon footprint originates, discover circular alternatives, and understand the cost and CO₂ savings of taking action.

Built for the HackOut 2026 — Circular Carbon Ecosystem problem statement.

🎯 PROBLEM STATEMENT

Industrial Emission Leak-Point Detector & Circular Alternative Recommender

Small and medium industries often do not know exactly where their carbon footprint originates or what circular alternatives are available.

Factories generate data from many different activities:

Energy consumption

Fuel usage

Raw materials

Production processes

Water consumption

Waste streams

Transportation and logistics

However, raw operational data by itself does not tell a factory:

Which activity is responsible for the largest share of emissions?

Even after the major emission source is identified, another important question remains:

What practical circular intervention should the factory implement, how much could it cost, and how much CO₂ could it save?

This project solves that problem by providing a complete intelligence pipeline:

FACTORY DATA
     ↓
DATA VALIDATION
     ↓
CARBON CALCULATION
     ↓
EMISSION HOTSPOTS
     ↓
CIRCULAR ALTERNATIVES
     ↓
COST + CO₂ SAVINGS
     ↓
ACTIONABLE DECISION

The system is designed for:

SMEs

Factory operators

Sustainability consultants

Industry regulators

The goal is to make carbon emissions visible, understandable, and actionable for smaller industrial businesses.

💡 OUR SOLUTION

The platform allows a business to enter its industrial process data.

The system then automatically:

Maps the entered data into a standardized format.

Normalizes different measurement units.

Validates the data for quality and completeness.

Calculates source-level CO₂e emissions.

Identifies the largest emission contributors.

Detects primary and secondary carbon hotspots.

Recommends circular interventions relevant to the industry and hotspot.

Estimates potential CO₂ reduction.

Estimates implementation cost, savings, and payback.

Builds practical decarbonization pathways.

Presents the results through an interactive dashboard.

Instead of simply reporting:

YOUR FACTORY EMITS X TONNES CO₂e

the platform answers:

WHERE is the carbon coming from?
          ↓
WHY is that source significant?
          ↓
WHAT circular alternative can reduce it?
          ↓
HOW MUCH CO₂ could be saved?
          ↓
WHAT could it cost?
          ↓
HOW FAST could it pay back?

🚀 PART 1 — HOW TO RUN THE PROJECT

1. Prerequisites

Install:

Requirement

Recommended

Node.js

20+

npm

Comes with Node.js

Python

3.10+

pip

Comes with Python

Git

Latest

Browser

Chrome / Edge / Brave / Safari

Optional:

Gemini API key for enhanced AI-generated narrative/reporting.

The core carbon calculations do not depend on Gemini.

2. Project Structure

carbon-hotspot-intelligence/
│
├── backend/
│   ├── data/
│   │   ├── industries/
│   │   │   ├── textile.json
│   │   │   ├── steel.json
│   │   │   ├── food.json
│   │   │   ├── cement.json
│   │   │   └── chemical.json
│   │   │
│   │   ├── emission_factors.json
│   │   └── recommendations.json
│   │
│   ├── src/
│   │   ├── agents/
│   │   │   ├── data_agent.py
│   │   │   ├── field_mapper.py
│   │   │   ├── unit_normalizer.py
│   │   │   ├── validator.py
│   │   │   ├── confidence.py
│   │   │   └── recommendation_engine.py
│   │   │
│   │   ├── analyzer.py
│   │   ├── carbon_engine.py
│   │   ├── hotspot_detector.py
│   │   ├── frontend_adapter.py
│   │   ├── cost_engine.py
│   │   ├── country_db.py
│   │   ├── scenario_builder.py
│   │   ├── llm_narrative_agent.py
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── backend_backup/
│
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── services/
│   └── types/
│
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
└── README.md

3. Install Frontend Dependencies

From the project root:

npm install

The frontend is built with:

Next.js

React

TypeScript

Recharts

Lucide React

Tailwind CSS

4. Set Up Backend

Open a second terminal:

cd backend

Create a virtual environment.

macOS / Linux

python3 -m venv .venv
source .venv/bin/activate

Windows PowerShell

python -m venv .venv
.venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

5. Start Backend

Inside backend/:

uvicorn src.main:app --reload --port 8000

Backend:

http://127.0.0.1:8000

Health check:

http://127.0.0.1:8000/health

Swagger API documentation:

http://127.0.0.1:8000/docs

6. Start Frontend

Open another terminal and return to the project root:

cd carbon-hotspot-intelligence

Run:

npm run dev

Open:

http://localhost:3000

7. Local Architecture

Terminal 1
└── backend/
    └── uvicorn src.main:app --reload --port 8000

Terminal 2
└── project root/
    └── npm run dev

Browser:

http://localhost:3000

🧠 PART 2 — COMPLETE SYSTEM EXPLANATION

8. Overall System Architecture

                         FACTORY / SME
                              │
                              ▼
                  ┌─────────────────────────┐
                  │     DATA INPUT FORM     │
                  │ Energy • Materials      │
                  │ Waste • Water • Fuel    │
                  │ Production • Logistics  │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │    FRONTEND ADAPTER      │
                  │ Display Units →          │
                  │ Canonical Units         │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │       DATA AGENT         │
                  │                         │
                  │ Field Mapping           │
                  │ Unit Normalization      │
                  │ Validation              │
                  │ Confidence              │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │     CARBON ENGINE        │
                  │                         │
                  │ Activity × Factor      │
                  │ Source-level CO₂e      │
                  │ Total Facility CO₂e    │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │    HOTSPOT DETECTOR      │
                  │                         │
                  │ Rank actual emissions   │
                  │ Primary hotspot         │
                  │ Secondary hotspot       │
                  └────────────┬────────────┘
                               │
                 ┌─────────────┴──────────────┐
                 ▼                            ▼
      ┌─────────────────────┐      ┌─────────────────────┐
      │ RECOMMENDATION      │      │ COST & IMPACT       │
      │ ENGINE              │      │ ENGINE              │
      │                     │      │                     │
      │ Circular actions    │      │ Cost                │
      │ Material changes    │      │ Savings             │
      │ Recycling loops     │      │ CO₂ reduction       │
      │ Process changes     │      │ Payback / ROI       │
      └──────────┬──────────┘      └──────────┬──────────┘
                 └─────────────┬─────────────┘
                               ▼
                  ┌─────────────────────────┐
                  │    SCENARIO BUILDER      │
                  │                         │
                  │ Quick Wins              │
                  │ Balanced                │
                  │ Maximum Reduction       │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │    AI NARRATIVE LAYER    │
                  │                         │
                  │ Executive Summary       │
                  │ Cause Analysis          │
                  │ Methodology              │
                  │ Risk Guidance            │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │      DASHBOARD           │
                  │                         │
                  │ Carbon Footprint        │
                  │ Hotspots                │
                  │ Recommendations        │
                  │ Cost & Savings          │
                  │ Scenarios               │
                  └─────────────────────────┘

9. Frontend

The frontend provides an interactive assessment experience.

The user can enter:

Facility Information

Facility name

Location

Country

Reporting period

Industry

Production Information

Annual production

Production unit

Operating hours

Industrial Activity Data

Depending on the selected industry:

Electricity

Fuels

Raw materials

Chemicals

Water

Wastewater

Waste

Transportation

Other process inputs

The frontend sends the assessment to:

POST /api/analyze

The existing UI remains focused on presentation while the backend performs the intelligence.

10. Data Agent

The Data Agent ensures that factory data is clean before carbon calculations begin.

Pipeline:

RAW FACTORY DATA
       ↓
FIELD MAPPING
       ↓
UNIT NORMALIZATION
       ↓
VALIDATION
       ↓
CONFIDENCE SCORE
       ↓
STANDARDIZED DATA

Field Mapping

Example:

grid_electricity
        ↓
electricity_kwh

diesel_fuel
        ↓
diesel_litres

natural_gas
        ↓
natural_gas_m3

polyester_fibre
        ↓
polyester_kg

raw_cotton
        ↓
cotton_kg

This allows the frontend and backend to use different naming conventions without breaking the calculation engine.

11. Unit Normalization

Industrial data may be entered using different units.

The system converts display-friendly units into canonical calculation units.

Examples:

MWh → kWh
tonnes → kg
kL → litres
1,000 m³ → m³
10,000 tonne-km → tonne-km

Example:

5,500 tonnes polyester
          ↓
5,500,000 kg

This prevents unit differences from creating incorrect carbon calculations.

12. Industry-Aware Validation

The backend supports multiple industrial sectors.

textile
steel
food
cement
chemical

Each industry has its own configuration:

backend/data/industries/

The validator checks:

Whether the industry is supported

Expected activity fields

Missing fields

Unexpected fields

Numeric values

Negative values

Invalid values

Extremely unusual values

Data completeness

13. Confidence Assessment

The system provides a transparent data-quality confidence score.

It considers:

Data completeness
+
Validation warnings
+
Validation errors

Output levels:

HIGH
MEDIUM
PRELIMINARY

This tells the user how complete and clean the submitted activity data is.

Confidence is a data-quality indicator, not a scientifically validated probability.

14. Carbon Calculation Engine

The Carbon Engine is responsible for the actual footprint calculation.

It combines:

Industry Configuration
          +
Emission Factor Database
          ↓
Source-Level Emissions
          ↓
Total Carbon Footprint

The core formula is:

CO₂e = Activity × Emission Factor

For example:

Electricity Consumption
        ×
Grid Emission Factor
        =
Electricity CO₂e

The same process is repeated for every configured emission source.

15. Emission Factor Database

Stored in:

backend/data/emission_factors.json

Each factor can contain:

name
category
unit
co2e_per_unit
scope
geography
source
source_year
factor_status

The factor library is separate from the calculation code so that factors can be updated without redesigning the Carbon Engine.

Some prototype factors are marked:

illustrative_demo

These are intended for hackathon demonstration and should be validated before formal carbon accounting.

16. Emission Scopes

The platform groups emissions into:

Scope 1

Direct emissions from sources such as fuel combustion and applicable process emissions.

Scope 2

Purchased electricity / grid-related emissions.

Scope 3

Indirect value-chain emissions such as:

Raw materials

Logistics

Waste

Water

Other upstream/downstream activities

17. 🔥 Emission Hotspot Detection

This is the central intelligence of the project.

The system does not assume that electricity is always the largest source.

Instead:

Calculate all sources
        ↓
Calculate CO₂e for each source
        ↓
Calculate contribution %
        ↓
Sort by actual emissions
        ↓
Highest contributor
        ↓
PRIMARY HOTSPOT
        ↓
Second-highest contributor
        ↓
SECONDARY HOTSPOT

The contribution formula is:

Contribution %
=
(Source CO₂e / Total CO₂e) × 100

This means:

Factory A
→ Electricity may be the hotspot

Factory B
→ Polyester may be the hotspot

Factory C
→ Fuel may be the hotspot

Factory D
→ Waste or another process source may be the hotspot

The hotspot is determined from actual factory data.

18. Why Hotspot Detection Matters

A total carbon footprint alone is not enough.

Consider:

Factory Carbon Footprint
= 70,000 tCO₂e

That number tells us the size of the problem.

But hotspot detection tells us:

40% → Electricity
25% → Polyester
15% → Natural Gas
10% → Transport
10% → Other

Now the factory knows where to focus.

This converts:

CARBON ACCOUNTING

into:

CARBON INTELLIGENCE

19. ♻️ Circular Alternative Recommendation Engine

Once the hotspot is identified, the system asks:

What circular intervention can address this emission source?

Pipeline:

Industry
   +
Hotspot
   ↓
Recommendation Knowledge Base
   ↓
Candidate Actions
   ↓
Feasibility Ranking
   ↓
Circular Alternatives

Stored in:

backend/data/recommendations.json

Examples:

Purchased Electricity
        ↓
Energy efficiency
Renewable electricity
Process optimization

Polyester / Synthetic Fibre
        ↓
Recycled fibre
Material substitution
Circular material sourcing

Textile Waste
        ↓
Waste recovery
Recycling loops
Material reuse

The recommendation layer focuses on practical interventions rather than simply displaying generic sustainability advice.

20. Circular Carbon Ecosystem

The project directly connects carbon reduction with circularity.

The objective is not only:

REDUCE EMISSIONS

but also:

REDUCE EMISSIONS
        +
KEEP MATERIALS IN USE
        +
REDUCE VIRGIN RESOURCE DEMAND
        +
REDUCE WASTE
        +
CREATE PRACTICAL INDUSTRIAL LOOPS

Examples include:

Alternative materials

Recycled materials

Waste recovery

Closed-loop processes

Process efficiency

Resource recovery

Better logistics

Energy optimization

This is the core connection between the carbon hotspot detector and the Circular Carbon Ecosystem theme.

21. 💰 Cost & CO₂ Savings

A recommendation becomes much more useful when the business can understand its financial impact.

The Cost Engine can estimate:

CAPEX

OPEX

Annual savings

CO₂ reduction

Payback period

ROI

Local currency values

Implementation difficulty

Capital level

Conceptually:

HOTSPOT
   +
RECOMMENDATION
   +
FACTORY SCALE
   +
COUNTRY
   ↓
COST + IMPACT ESTIMATE

This allows the decision-maker to compare environmental impact with financial feasibility.

22. 🌍 Country-Aware Analysis

Financial and carbon assumptions can vary by geography.

The country database can provide:

Grid electricity factors

Electricity tariff

Natural gas price

Diesel price

Coal price

Currency

Currency conversion

Regional CAPEX multiplier

Carbon price/tax assumptions

Supported examples:

India
USA
Germany / EU
UK
China
Japan
Global Default

This helps the same intervention produce a more relevant estimate for different regions.

23. 📊 Decarbonization Scenarios

Instead of giving the factory a large list of recommendations, the Scenario Builder groups actions into pathways.

🟢 Basic / Quick Wins

Focuses on:

Low-capital actions

Operational improvements

Easy implementation

Fast opportunities

🔵 Balanced Modernization

Combines:

Quick wins

Medium-term upgrades

Moderate investment

Stronger emission reduction

🔴 Maximum Reduction

Focuses on:

More aggressive actions

Higher transformation

Larger reduction potential

Broader intervention

Scenarios can compare:

Actions
CAPEX
OPEX
Annual Savings
CO₂ Reduction
Remaining Emissions
Reduction %
Payback
Currency Impact

24. 🤖 AI Narrative Layer

AI is used mainly where natural-language reasoning adds value.

The system can generate:

Executive Summary
Cause Analysis
Methodology Notes
Risk Guidance

The important design principle is:

DETERMINISTIC CALCULATION
          ↓
CALCULATED RESULTS
          ↓
AI EXPLANATION

The LLM does not replace the core carbon mathematics.

If the Gemini API is unavailable, deterministic fallback text can still be used.

25. Main API

Health Check

GET /health

Example:

http://127.0.0.1:8000/health

Main Analysis

POST /api/analyze

The analysis endpoint connects the frontend with the complete intelligence pipeline.

Conceptually:

Frontend Payload
      ↓
Unit Adapter
      ↓
Data Agent
      ↓
Carbon Engine
      ↓
Hotspot Detector
      ↓
Recommendation Engine
      ↓
Cost Engine
      ↓
Scenario Builder
      ↓
AI Narrative
      ↓
Frontend Result

26. Example Textile Assessment

Example frontend payload:

{
  "country": "india",
  "facilityName": "Example Textile Facility",
  "facilityLocation": "Gujarat, India",
  "reportingPeriod": "FY 2025-26",
  "industry": "textile",
  "annual_production": 12000,
  "operating_hours": 7200,
  "grid_electricity": 24000,
  "natural_gas": 1800,
  "diesel_fuel": 120,
  "polyester_fibre": 5500,
  "raw_cotton": 7000,
  "dyes_chemicals": 450,
  "process_water": 950,
  "compressed_air": 3200,
  "wastewater_volume": 820,
  "textile_waste_landfill": 620,
  "recycled_fibre_used": 800,
  "inbound_logistics": 240,
  "outbound_distribution": 380
}

The backend adapts the frontend's display units before performing the calculation.

27. Repository Responsibility Map

Component

Responsibility

Next.js Frontend

User interface and dashboard

assessmentService.ts

Assessment/API integration

frontend_adapter.py

Frontend unit conversion

Data Agent

Mapping, normalization, validation

Carbon Engine

CO₂e calculations

Hotspot Detector

Dynamic hotspot identification

Recommendation Engine

Circular alternative recommendations

Country DB

Geographic assumptions

Cost Engine

Cost, savings, ROI, payback

Scenario Builder

Decarbonization pathways

LLM Narrative

AI-generated explanation

Industry JSON

Industry activity configuration

Emission Factors

Carbon calculation factors

Recommendations JSON

Circular intervention knowledge

28. Why This Solution Is Different

1. It does not stop at the carbon number

Carbon Footprint
      ↓
Hotspot
      ↓
Action

2. Hotspots are dynamic

The system identifies hotspots from actual calculated emissions rather than hardcoding a particular source.

3. Recommendations are connected to the hotspot

The system does not give random sustainability suggestions.

Actual Hotspot
      ↓
Relevant Intervention

4. Circularity is included

The solution connects emission reduction with:

Recycling

Reuse

Material substitution

Resource recovery

Closed-loop thinking

5. Financial impact is included

The user can compare:

CO₂ Reduction
+
Investment
+
Savings
+
Payback

6. AI is used where it helps

The LLM is primarily used for explanation and synthesis while deterministic code handles the numerical calculations.

29. Impact

The proposed system directly addresses the impact areas of the problem statement.

Makes emission sources visible

SMEs can see which activities contribute most to their carbon footprint.

Makes emissions actionable

Instead of only reporting emissions, the platform connects hotspots to practical interventions.

Encourages circular practices

Recommendations can include:

Alternative materials

Recycling loops

Process changes

Waste recovery

Resource efficiency

Adds financial context

Businesses can understand estimated:

Cost

Savings

CO₂ reduction

Payback

Supports better carbon decision-making

The system gives factory operators and sustainability teams a structured path from data to action.

30. Prototype & Data Disclaimer

This is a hackathon prototype and decision-support system.

It is not a replacement for:

Certified carbon accounting

Third-party verification

Formal regulatory reporting

Audited sustainability disclosures

Investment-grade engineering studies

Vendor quotations

Some prototype emission factors may be marked:

illustrative_demo

Before production deployment or formal reporting, factors should be validated using appropriate:

Geographic data

Process-specific lifecycle data

Supplier information

Treatment-route data

Fuel-specific factors

Current tariff/currency assumptions

Accounting boundaries

Data-quality controls

Financial values are estimates for decision support and should not be treated as guaranteed investment returns.

31. Future Scope

The platform can be expanded with:

CSV / Excel ingestion

ERP integration

IoT / sensor data

Historical carbon tracking

PostgreSQL database

Multi-user organizations

Supplier-specific emission factors

Automated industry benchmarks

Optimization-based action selection

Advanced circularity scoring

Machine-learned recommendation ranking

More detailed Scope 1 / 2 / 3 accounting

Production-grade authentication

Cloud deployment

Monitoring and observability

Advanced AI reporting

32. Recommended Demo Flow

For a hackathon demonstration:

1. Select Industry
        ↓
2. Enter Factory Data
        ↓
3. Submit Assessment
        ↓
4. Show Total Carbon Footprint
        ↓
5. Show Primary Hotspot
        ↓
6. Show Secondary Hotspot
        ↓
7. Explain WHY it is a hotspot
        ↓
8. Show Circular Alternatives
        ↓
9. Show CO₂ Savings
        ↓
10. Show Cost + Payback
        ↓
11. Compare Scenarios
        ↓
12. Show AI Executive Summary

This demonstrates the full problem-to-solution journey.

33. HackOut 2026

Event: HackOut 2026

Theme: 🌱 Circular Carbon Ecosystem

Problem Statement:
Industrial Emission Leak-Point Detector & Circular Alternative Recommender

Target Users:

SMEs

Factory operators

Sustainability consultants

Industry regulators

Core Technology:

AI / Data Intelligence
+
Carbon Calculation
+
Data Visualization
+
REST API
+
Circular Recommendation
+
Financial Impact Analysis

🌱 FINAL IDEA

The central idea of this project is:

Help an industrial business move from “I know my emissions” to “I know where they come from, what I can change, which circular alternative is practical, how much carbon I can save, and what it may cost.”

The complete journey is:

                    INDUSTRIAL DATA
                           ↓
                    DATA VALIDATION
                           ↓
                    CARBON FOOTPRINT
                           ↓
                    LEAK-POINT DETECTION
                           ↓
                  PRIMARY + SECONDARY
                       HOTSPOTS
                           ↓
                 CIRCULAR ALTERNATIVES
                           ↓
                  COST + CO₂ SAVINGS
                           ↓
                 DECARBONIZATION
                     SCENARIOS
                           ↓
                    AI EXPLANATION
                           ↓
                  ACTIONABLE DECISION

Measure → Detect → Explain → Recommend → Quantify → Act 🌱⚙️

👥 Hackathon Project

Built as a collaborative hackathon project representing:

Sardar Vallabhbhai Patel Institute of Technology (SVIT)

Theme: Circular Carbon Ecosystem

Problem: Industrial Emission Leak-Point Detector & Circular Alternative Recommender

Implementation: Industrial Carbon Hotspot Intelligence System

Technology: Next.js · React · TypeScript · FastAPI · Python · JSON · Recharts · Optional Gemini AI