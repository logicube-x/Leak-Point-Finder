🌱 Industrial Carbon Hotspot Intelligence System

AI-Powered Industrial Emission Hotspot Detection & Circular Alternative Recommendation Platform

An intelligent industrial carbon assessment platform that helps factories understand where their emissions are coming from, which sources are the biggest carbon hotspots, and what practical circular alternatives can be considered to reduce those emissions.

🚀 How to Run the Project

Follow these steps in order.

1. Clone the Repository

git clone https://github.com/logicube-x/Leak-Point-Finder.git
cd Leak-Point-Finder

2. Install Frontend Dependencies

From the project root:

npm install

3. Start the Frontend

Run:

npm run dev

The frontend will be available at:

http://localhost:3000

Keep this terminal running.

4. Open a Second Terminal

Open another terminal and go to the backend:

cd backend

5. Create a Python Virtual Environment

macOS / Linux

python3 -m venv .venv
source .venv/bin/activate

Windows

python -m venv .venv
.venv\Scripts\activate

6. Install Backend Dependencies

If requirements.txt is available:

pip install -r requirements.txt

Otherwise, install the required API packages directly:

pip install fastapi uvicorn

7. Start the Backend

From inside the backend directory:

uvicorn src.main:app --reload --port 8000

The backend API will run at:

http://127.0.0.1:8000

8. Check Backend Health

Open:

http://127.0.0.1:8000/health

You can also open the interactive API documentation:

http://127.0.0.1:8000/docs

▶️ Complete Run Setup

You should have two terminals running.

Terminal 1 — Frontend

npm run dev

Open:

http://localhost:3000

Terminal 2 — Backend

cd backend
source .venv/bin/activate
uvicorn src.main:app --reload --port 8000

On Windows, activate the environment with:

.venv\Scripts\activate

Then open:

http://localhost:3000

The frontend provides the factory assessment interface and the backend provides the carbon intelligence and analysis API.

🌍 Project Description

Industrial factories generate carbon emissions from many different activities such as:

Electricity consumption

Natural gas and diesel

Raw materials

Synthetic materials

Industrial chemicals

Process utilities

Water consumption

Wastewater

Industrial waste

Transportation

Upstream supply-chain activities

Knowing the total carbon footprint is useful, but it does not answer the most important operational question:

Where is the biggest emission hotspot in the factory?

Our system is designed to answer that question and then move one step further:

What practical circular action can be considered to address that hotspot?

The platform converts industrial operational data into a structured carbon intelligence assessment.

The overall flow is:

Factory Data
     ↓
Data Validation
     ↓
Field Mapping
     ↓
Unit Normalization
     ↓
Carbon Calculation
     ↓
Emission Breakdown
     ↓
Hotspot Detection
     ↓
Circular Recommendations
     ↓
Cost & Impact Information
     ↓
Actionable Carbon Intelligence

🎯 Problem Statement

Many industrial facilities can collect operational data but do not have a simple system that connects this data to actionable carbon-reduction decisions.

A conventional carbon assessment may provide:

Total Emissions = X tCO₂e

But factory operators also need to know:

Which source causes the most emissions?
Why is it a hotspot?
What should we address first?
What circular alternative could help?
What could be the potential impact?

This project addresses that gap by combining industrial data processing, carbon accounting, hotspot detection and circular recommendation logic into one platform.

💡 Our Solution

The Industrial Carbon Hotspot Intelligence System provides an end-to-end workflow for industrial carbon assessment.

A user selects an industry and enters operational information.

The system then:

Validates the submitted data.

Maps different input names into standardized fields.

Normalizes units.

Calculates emissions using configured emission factors.

Breaks emissions down by source.

Calculates Scope 1, Scope 2 and Scope 3 contributions where configured.

Ranks emission sources by their actual calculated contribution.

Identifies the primary and secondary hotspots.

Generates recommendations related to the detected hotspots.

Provides impact-oriented information for potential interventions.

The objective is to move from:

Carbon Accounting

to:

Carbon Intelligence
+
Actionable Recommendations

🧠 System Architecture

                    ┌─────────────────────┐
                    │   Factory User      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Frontend       │
                    │ Next.js + React + TS│
                    └──────────┬──────────┘
                               │
                         POST /api/analyze
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Data Agent      │
                    ├─────────────────────┤
                    │ Field Mapping       │
                    │ Unit Normalization  │
                    │ Validation          │
                    │ Confidence          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Carbon Engine    │
                    ├─────────────────────┤
                    │ Emission Factors    │
                    │ Source Calculations │
                    │ Scope Calculations  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Hotspot Detector   │
                    ├─────────────────────┤
                    │ Source Ranking      │
                    │ Contribution %      │
                    │ Primary Hotspot     │
                    │ Secondary Hotspot   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Recommendation      │
                    │ Engine              │
                    ├─────────────────────┤
                    │ Industry Matching   │
                    │ Hotspot Matching    │
                    │ Feasibility         │
                    │ Circularity         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Final Result    │
                    │ Carbon + Hotspots   │
                    │ + Recommendations   │
                    └─────────────────────┘

🔄 Core Intelligence Pipeline

1. Data Agent

The Data Agent prepares raw industrial data before carbon calculations are performed.

It performs:

Field Mapping

Different users may describe the same industrial activity using different field names.

For example:

Grid Electricity
Electricity Consumption
Purchased Electricity
Grid Power

can be mapped to a common internal representation such as:

electricity_kwh

This allows the carbon engine to work with standardized fields.

Unit Normalization

Industrial data can be entered using different units such as:

kWh
MWh
kg
tonnes
litres
kL
m³
tonne-km

The normalization layer converts supported values into the standard units expected by the backend calculation system.

Validation

The validator checks whether the submitted data is appropriate for the selected industrial sector.

It can identify:

Missing fields

Invalid values

Abnormal values

Incomplete datasets

Industry-specific data issues

Confidence

The Data Agent produces a confidence assessment based on the quality and completeness of the submitted information.

This helps communicate whether the analysis is:

High Confidence
Medium Confidence
Preliminary

rather than presenting every result as equally reliable.

⚙️ Carbon Engine

The Carbon Engine performs the core emission calculations.

The basic calculation is:

CO₂e = Activity Data × Emission Factor

For example:

Electricity Consumption
        ×
Electricity Emission Factor
        =
Electricity CO₂e

The same principle is applied to configured emission sources.

The calculated source emissions are then aggregated:

Source 1
+
Source 2
+
Source 3
+
Source 4
+
...
=
Total Facility CO₂e

Emission factors are stored in a separate data file so that calculation logic and factor data remain separated.

🌡️ Scope-Based Analysis

The system can organize configured emission sources into:

Scope 1

Direct emissions associated with sources controlled by the facility.

Examples include:

Diesel

Natural gas

Direct fuel combustion

Configured process emissions

Scope 2

Indirect emissions associated with purchased energy.

Example:

Purchased grid electricity

Scope 3

Other indirect emissions occurring across the value chain.

Examples can include:

Raw materials

Synthetic fibres

Chemicals

Transportation

Waste

Upstream activities

The exact sources depend on the selected industry configuration.

🔥 Hotspot Detection

The most important part of the system is identifying the actual emission hotspots.

The system does not simply assume that electricity, fuel or another source is always the biggest hotspot.

Instead, it calculates every configured source and ranks them according to their actual contribution.

The logic is:

Activity Data
     ↓
Emission Calculation
     ↓
Source CO₂e
     ↓
Contribution %
     ↓
Sort Sources
     ↓
Primary Hotspot
     ↓
Secondary Hotspot

The contribution percentage is calculated as:

Contribution %
=
Source CO₂e / Total CO₂e × 100

For example:

Electricity      → 42%
Polyester        → 25%
Natural Gas      → 13%
Diesel           → 8%
Other Sources    → 12%

The resulting hotspots are:

Primary Hotspot   → Electricity
Secondary Hotspot → Polyester

If the input data changes, the hotspot ranking can also change.

♻️ Recommendation Engine

After identifying the hotspot, the system moves from:

Where is the problem?

to:

What can we do about it?

The Recommendation Engine considers:

Selected industry

Detected hotspot

Emission source

Circularity opportunities

Feasibility

Implementation difficulty

Capital requirement

Recommendations are generated from a structured recommendation knowledge base.

🔁 Circular Carbon Approach

The project follows the idea of a Circular Carbon Ecosystem.

Carbon reduction is not treated only as an electricity or fuel problem.

The platform also considers opportunities related to:

Energy

Energy efficiency

Renewable electricity

Process optimization

Heat recovery

Materials

Lower-carbon materials

Recycled materials

Material substitution

Supplier improvements

Water

Water recovery

Closed-loop systems

Process-water optimization

Waste

Waste reduction

Recycling

Recovery

Reuse

Circular material pathways

Logistics

Transport optimization

Lower-carbon logistics

Supply-chain improvements

The goal is to connect emission hotspots with practical circular interventions.

💰 Cost & Impact

A recommendation becomes more useful when decision-makers can understand its potential implementation and impact.

The project architecture supports recommendation information such as:

Estimated cost

Potential CO₂ reduction

Potential savings

Payback period

Implementation difficulty

Capital requirement

Circularity pathway

These values should be treated as prototype estimates where applicable and should be validated against real project-specific data before financial or regulatory decisions.

🏭 Supported Industries

The current architecture supports five major industrial categories.

🧵 Textile Manufacturing

Typical areas include:

Purchased electricity

Natural gas

Diesel

Cotton

Polyester / synthetic fibres

Dyes and chemicals

Process water

Wastewater

Textile waste

Transportation

⚙️ Steel Manufacturing

Typical areas include:

Metallurgical fuels

Coke / coal

Process inputs

Electricity

Steel production

Transportation

🍱 Food Processing

Typical areas include:

Thermal processing

Energy

Refrigeration

Packaging

Process operations

Waste

🧱 Cement Manufacturing

Typical areas include:

Clinker production

Kiln fuels

Calcination

Electricity

Grinding

Alternative fuels

🧪 Chemical Manufacturing

Typical areas include:

Chemical feedstocks

Process energy

Steam

Solvents

Flaring

Transportation

📊 Assessment Results

The platform can return information including:

Total Carbon Footprint

Total CO₂e

Emission Breakdown

A source-by-source view of calculated emissions.

Example:

Purchased Electricity
Natural Gas
Diesel
Polyester
Cotton
Chemicals
Process Water
Wastewater
Textile Waste
Transportation

Scope Breakdown

Scope 1
Scope 2
Scope 3

Primary Hotspot

The highest-contributing configured emission source.

Secondary Hotspot

The second-highest-contributing configured emission source.

Confidence

An indication of the quality and completeness of the submitted dataset.

Recommendations

Actions connected to the detected hotspots and selected industry.

🖥️ Frontend

The frontend is built with:

Next.js

React

TypeScript

Tailwind CSS

Recharts

Lucide React

The frontend provides the user-facing industrial assessment experience.

The typical workflow is:

New Assessment
      ↓
Select Industry
      ↓
Enter Factory Information
      ↓
Enter Operational Data
      ↓
Submit Assessment
      ↓
Backend Analysis
      ↓
Carbon Results
      ↓
Hotspot Results
      ↓
Recommendations

🔌 Backend API

The backend is built using:

Python

FastAPI

Uvicorn

Health Endpoint

GET /health

Used to verify that the API is running.

Analysis Endpoint

POST /api/analyze

This endpoint receives factory assessment information and executes the backend intelligence pipeline.

The pipeline includes:

Data Agent
     ↓
Carbon Analyzer
     ↓
Hotspot Detector
     ↓
Recommendation Engine

🧪 Example API Request

Example textile assessment:

{
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
  "wastewater_volume": 820,
  "textile_waste_landfill": 620,
  "inbound_logistics": 240,
  "outbound_distribution": 380
}

The backend maps and processes the submitted fields according to the selected industry configuration.

📁 Project Structure

Leak-Point-Finder/
│
├── backend/
│   │
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
│   │   │
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
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── ...
│
├── backend_backup/
│
├── public/
│
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
├── tailwind.config.ts
└── README.md

🧩 Backend Components

Component

Responsibility

data_agent.py

Orchestrates the data preparation pipeline

field_mapper.py

Maps frontend/user fields to canonical backend fields

unit_normalizer.py

Converts supported values into standard units

validator.py

Performs industry-aware validation

confidence.py

Calculates data confidence

carbon_engine.py

Calculates source and total emissions

analyzer.py

Combines the carbon-analysis pipeline

hotspot_detector.py

Ranks actual emission sources

recommendation_engine.py

Generates and ranks recommendation candidates

main.py

FastAPI application and API endpoints

🗃️ Data Files

Industry Configurations

Industry-specific emission sources are defined under:

backend/data/industries/

Each configuration describes the sources that are relevant to that industry.

Emission Factors

Emission factors are stored in:

backend/data/emission_factors.json

Keeping emission factors outside the Python calculation logic makes the system easier to maintain and update.

Recommendations

The recommendation knowledge base is stored in:

backend/data/recommendations.json

The Recommendation Engine uses the industry and detected hotspot to identify suitable intervention candidates.

🧮 Calculation Method

The fundamental calculation is:

Emission = Activity Data × Emission Factor

For example:

Grid Electricity
       ×
Grid Emission Factor
       =
Electricity Emissions

All configured emission sources are then aggregated to determine the total facility footprint.

The contribution of a source is:

Source Contribution %
=
Source Emissions / Total Facility Emissions × 100

The sources are sorted using their actual calculated emissions.

The largest contributors become the primary and secondary hotspots.

🧠 Why Hotspot Detection Matters

A total carbon footprint does not necessarily tell a factory where it should start.

For example, two facilities could have the same total footprint but very different emission structures.

Factory A

Electricity → 70%
Materials   → 15%
Fuel        → 10%
Other       → 5%

Factory B

Materials   → 60%
Fuel        → 25%
Electricity → 10%
Other       → 5%

The correct decarbonization strategy for each factory would therefore be different.

The hotspot detector helps identify these differences.

🛠️ Technology Stack

Frontend

Next.js
React
TypeScript
Tailwind CSS
Recharts
Lucide React

Backend

Python
FastAPI
Uvicorn

Data Layer

JSON Industry Configurations
JSON Emission Factors
JSON Recommendation Knowledge Base

Intelligence Layer

Data Validation
Field Mapping
Unit Normalization
Confidence Scoring
Carbon Calculation
Hotspot Ranking
Recommendation Ranking

🔐 Separation of Responsibilities

The project separates the user interface from the analytical backend.

Frontend

Responsible for:

User interaction

Data collection

Forms

Dashboards

Charts

Result presentation

Backend

Responsible for:

Data processing

Field mapping

Unit normalization

Validation

Carbon calculations

Hotspot detection

Recommendation generation

This separation allows the analytical logic to remain centralized instead of duplicating the carbon calculation logic across the frontend.

🧪 Testing the Backend

The backend API can be tested using the interactive FastAPI documentation.

Start the backend:

cd backend
source .venv/bin/activate
uvicorn src.main:app --reload --port 8000

Then open:

http://127.0.0.1:8000/docs

Use:

POST /api/analyze

to submit a test assessment.

You can also check:

GET /health

to verify that the backend is running.

📈 Future Scope

The architecture can be extended with:

Real-time industrial IoT data

Automated meter-data ingestion

Supplier-specific Scope 3 information

Regional emission-factor datasets

Historical carbon tracking

Scenario comparison

Facility benchmarking

Multi-factory portfolio analysis

Automated sustainability reports

Advanced AI recommendation ranking

Continuous carbon monitoring

Enterprise sustainability-platform integration

🌱 Circular Carbon Ecosystem

The project is designed around the idea that industrial carbon reduction can be connected with circular resource use.

The intended chain is:

Industrial Activity
        ↓
Resource Consumption
        ↓
Carbon Impact
        ↓
Emission Hotspot
        ↓
Circular Opportunity
        ↓
Potential Reduction
        ↓
Industrial Action

Examples include:

Waste Reduction
      +
Material Recovery
      +
Lower Virgin Material Demand
      +
Lower Supply-Chain Emissions

or:

Energy Efficiency
      +
Heat Recovery
      +
Lower Fuel Consumption
      +
Lower Carbon Emissions

The platform therefore attempts to connect carbon accounting with practical circular interventions.

🎯 Project Objective

The objective of the project is to make industrial carbon analysis:

Understandable
       +
Data-Driven
       +
Hotspot-Focused
       +
Action-Oriented
       +
Circular

Instead of giving a factory only:

Total Carbon Footprint

the system aims to provide:

How much carbon?
       ↓
Where is it coming from?
       ↓
Which source is the biggest hotspot?
       ↓
What is the secondary hotspot?
       ↓
What actions can be considered?
       ↓
What could the potential impact be?

🏆 Hackathon Context

Theme

Circular Carbon Ecosystem

Project

Industrial Carbon Hotspot Intelligence System

Core Idea

Identify industrial emission hotspots from operational data and connect those hotspots with practical circular alternatives and impact-oriented recommendations.

👥 Team

Team SVIT

Developed as a hackathon project representing:

Sardar Vallabhbhai Patel Institute of Technology (SVIT)

⚠️ Prototype Disclaimer

This project is a hackathon prototype.

Emission factors, recommendation estimates, cost estimates and potential impact values should be treated according to their configured source/status and should be independently verified against appropriate authoritative datasets before being used for formal regulatory reporting, compliance, investment decisions or operational commitments.

📜 License

This repository is intended for hackathon and prototype development purposes.

⭐ Final Message

The vision of the project is simple:

Measure → Detect → Understand → Act → Circularize

🌱 Industrial Carbon Hotspot Intelligence System