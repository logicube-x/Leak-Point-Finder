import {
  IndustryType,
  IndustryMetadata,
  FormFieldDef,
  FactoryAssessmentInput,
  AssessmentResult,
  HistoricalAssessment,
  Hotspot,
  EmissionSource,
  Recommendation,
  ConfidenceMetrics,
  EmissionCategory,
  EmissionScope,
} from "@/types/assessment";

export const INDUSTRIES_METADATA: Record<IndustryType, IndustryMetadata> = {
  textile: {
    id: "textile",
    name: "Textile Manufacturing",
    tagline: "Spinning, Weaving, Wet Processing & Garmenting",
    description:
      "Multi-tier apparel and fabric processing with high thermal dyeing, synthetic polymer feeds, and effluent loads.",
    iconName: "Shirt",
    defaultUnit: "tonnes finished fabric",
    typicalHotspots: [
      "Purchased Grid Electricity",
      "Polyester / Synthetic Yarn",
      "Natural Gas Steam Boilers",
    ],
    scopeFocus: "Scope 2 (Electricity) & Scope 3 (Synthetic Fibres)",
  },
  steel: {
    id: "steel",
    name: "Steel Manufacturing",
    tagline: "Blast Furnace (BF-BOF) & Electric Arc Furnace (EAF)",
    description:
      "Heavy metallurgical smelting, direct reduced iron (DRI), coke reduction, and scrap recycling.",
    iconName: "Anvil",
    defaultUnit: "tonnes crude steel",
    typicalHotspots: [
      "Metallurgical Coal & Coke",
      "Direct Reduced Iron (DRI)",
      "Grid Power",
    ],
    scopeFocus: "Scope 1 (Coke Combustion & Reduction) & Scope 2",
  },
  food_processing: {
    id: "food_processing",
    name: "Food Processing",
    tagline: "Dairy, Beverages, Meat & Packaged Goods",
    description:
      "Thermal processing, high-pressure steam boilers, cold-chain refrigeration leakage, and packaging.",
    iconName: "Utensils",
    defaultUnit: "tonnes processed food",
    typicalHotspots: [
      "Process Steam Boilers",
      "Refrigerant Gases (HFCs)",
      "Packaging Materials",
    ],
    scopeFocus: "Scope 1 (Thermal / Refrigeration) & Scope 3 (Packaging)",
  },
  cement: {
    id: "cement",
    name: "Cement Manufacturing",
    tagline: "Clinker Calcination & Grinding Plants",
    description:
      "High-temperature rotary kilns, limestone de-carbonation, alternative fuels, and finish milling.",
    iconName: "Construction",
    defaultUnit: "tonnes Portland clinker",
    typicalHotspots: [
      "Limestone Calcination Process",
      "Kiln Coal / Petcoke",
      "Grinding Electricity",
    ],
    scopeFocus: "Scope 1 (Process Calcination & Kiln Fuel)",
  },
  chemical: {
    id: "chemical",
    name: "Chemical Manufacturing",
    tagline: "Petrochemicals, Specialty Reagents & Solvents",
    description:
      "Endothermic cracking furnaces, high-pressure reactors, flare emissions, and solvent distillation.",
    iconName: "FlaskConical",
    defaultUnit: "tonnes chemical output",
    typicalHotspots: [
      "Naphtha / Ethylene Feedstock",
      "High-Pressure Steam Boilers",
      "Process Flaring",
    ],
    scopeFocus: "Scope 1 (Synthesis & Flaring) & Scope 3 (Feedstocks)",
  },
};

export const INDUSTRY_FIELD_DEFINITIONS: Record<IndustryType, FormFieldDef[]> =
  {
    textile: [
      // Production
      {
        key: "annual_production",
        label: "Annual Fabric Production",
        category: "production",
        unit: "tonnes",
        placeholder: "e.g. 12000",
        helperText: "Finished woven or knitted fabric per year",
        required: true,
        defaultValue: 12000,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 0,
      },
      {
        key: "operating_hours",
        label: "Annual Operating Hours",
        category: "production",
        unit: "hrs/yr",
        placeholder: "e.g. 7200",
        helperText: "Total facility active production hours",
        required: false,
        defaultValue: 7200,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 0,
      },

      // Energy
      {
        key: "grid_electricity",
        label: "Purchased Grid Electricity",
        category: "energy",
        unit: "MWh",
        placeholder: "e.g. 24000",
        helperText: "Substation metering total grid consumption",
        required: true,
        defaultValue: 24000,
        scope: "Scope 2",
        emissionFactorKgPerUnit: 710,
      }, // 0.71 tCO2e / MWh
      {
        key: "natural_gas",
        label: "Natural Gas (Steam Boilers)",
        category: "energy",
        unit: "1,000 m³",
        placeholder: "e.g. 1800",
        helperText: "Used for dyeing, scouring & drying vats",
        required: false,
        defaultValue: 1800,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 2020,
      },
      {
        key: "diesel_fuel",
        label: "Diesel (Generators & Yard)",
        category: "energy",
        unit: "kL",
        placeholder: "e.g. 120",
        helperText: "Backup power and internal yard transport",
        required: false,
        defaultValue: 120,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 2680,
      },

      // Materials
      {
        key: "polyester_fibre",
        label: "Polyester / Synthetic Fibre Feed",
        category: "materials",
        unit: "tonnes",
        placeholder: "e.g. 5500",
        helperText: "Raw synthetic staple fibre or filament",
        required: false,
        defaultValue: 5500,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 2400,
      },
      {
        key: "raw_cotton",
        label: "Virgin Raw Cotton Feed",
        category: "materials",
        unit: "tonnes",
        placeholder: "e.g. 7000",
        helperText: "Conventionally grown cotton bales",
        required: false,
        defaultValue: 7000,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 1450,
      },
      {
        key: "dyes_chemicals",
        label: "Reactive Dyes & Wet Process Auxiliaries",
        category: "materials",
        unit: "tonnes",
        placeholder: "e.g. 450",
        helperText: "Colorants, fixing agents, scouring chemicals",
        required: false,
        defaultValue: 450,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 3200,
      },

      // Process / Utilities
      {
        key: "process_water",
        label: "Fresh Process Water Intake",
        category: "process_utilities",
        unit: "1,000 m³",
        placeholder: "e.g. 950",
        helperText: "Total freshwater withdrawn for wet treatment",
        required: false,
        defaultValue: 950,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 340,
      },
      {
        key: "compressed_air",
        label: "Compressed Air System Power",
        category: "process_utilities",
        unit: "MWh",
        placeholder: "e.g. 3200",
        helperText: "Pneumatic loom and jet dyeing supply",
        required: false,
        defaultValue: 3200,
        scope: "Scope 2",
        emissionFactorKgPerUnit: 710,
      },

      // Waste & Circularity
      {
        key: "wastewater_volume",
        label: "Effluent Discharge Volume",
        category: "waste_circularity",
        unit: "1,000 m³",
        placeholder: "e.g. 820",
        helperText: "Treated discharge to ETP / common municipal line",
        required: false,
        defaultValue: 820,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 480,
      },
      {
        key: "textile_waste_landfill",
        label: "Fabric Cutting & Scrap (Non-Recycled)",
        category: "waste_circularity",
        unit: "tonnes",
        placeholder: "e.g. 620",
        helperText: "Fabric offcuts sent to landfill/incineration",
        required: false,
        defaultValue: 620,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 1200,
      },
      {
        key: "recycled_fibre_used",
        label: "Recycled Fiber Displacement",
        category: "waste_circularity",
        unit: "tonnes",
        placeholder: "e.g. 800",
        helperText: "Post-consumer rPET or recycled cotton blended",
        required: false,
        defaultValue: 800,
        scope: "Scope 3",
        emissionFactorKgPerUnit: -1100,
      },

      // Transport
      {
        key: "inbound_logistics",
        label: "Raw Material Inbound Freight",
        category: "transport",
        unit: "10,000 tonne-km",
        placeholder: "e.g. 240",
        helperText: "Truck/rail freight from ports and ginning mills",
        required: false,
        defaultValue: 240,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 1150,
      },
      {
        key: "outbound_distribution",
        label: "Finished Product Outbound Distribution",
        category: "transport",
        unit: "10,000 tonne-km",
        placeholder: "e.g. 380",
        helperText: "Distribution to retail distribution hubs / air & sea",
        required: false,
        defaultValue: 380,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 1420,
      },
    ],

    steel: [
      // Production
      {
        key: "annual_production",
        label: "Annual Crude Steel Tonnage",
        category: "production",
        unit: "tonnes",
        placeholder: "e.g. 250000",
        helperText: "Liquid steel or billet casting output",
        required: true,
        defaultValue: 250000,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 0,
      },
      {
        key: "operating_days",
        label: "Annual Operating Days",
        category: "production",
        unit: "days/yr",
        placeholder: "e.g. 340",
        helperText: "Days blast furnace or arc furnace operated",
        required: false,
        defaultValue: 340,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 0,
      },

      // Energy
      {
        key: "coke_coal",
        label: "Metallurgical Coke & Coal",
        category: "energy",
        unit: "tonnes",
        placeholder: "e.g. 110000",
        helperText: "Blast furnace reducing agent and thermal fuel",
        required: true,
        defaultValue: 110000,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 3100,
      },
      {
        key: "grid_electricity",
        label: "Purchased Electricity (EAF & Rolling)",
        category: "energy",
        unit: "MWh",
        placeholder: "e.g. 145000",
        helperText:
          "Grid electricity for electric arc furnaces and rolling mills",
        required: true,
        defaultValue: 145000,
        scope: "Scope 2",
        emissionFactorKgPerUnit: 710,
      },
      {
        key: "natural_gas",
        label: "Natural Gas (Reheat Furnaces)",
        category: "energy",
        unit: "1,000 m³",
        placeholder: "e.g. 8500",
        helperText: "Reheating billets and ladle preheating",
        required: false,
        defaultValue: 8500,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 2020,
      },
      {
        key: "heavy_fuel_oil",
        label: "Heavy Fuel Oil / Tar Pitch",
        category: "energy",
        unit: "kL",
        placeholder: "e.g. 1500",
        helperText: "Auxiliary furnace injection",
        required: false,
        defaultValue: 1500,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 3120,
      },

      // Materials
      {
        key: "iron_ore_pellets",
        label: "Iron Ore / Sinter Feed",
        category: "materials",
        unit: "tonnes",
        placeholder: "e.g. 360000",
        helperText: "High-grade iron ore pellets or fines",
        required: true,
        defaultValue: 360000,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 220,
      },
      {
        key: "dri_hbi",
        label: "Direct Reduced Iron (DRI / Sponge Iron)",
        category: "materials",
        unit: "tonnes",
        placeholder: "e.g. 45000",
        helperText: "Gas- or coal-based sponge iron charge",
        required: false,
        defaultValue: 45000,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 1450,
      },
      {
        key: "scrap_steel",
        label: "Recycled Steel Scrap Charge",
        category: "materials",
        unit: "tonnes",
        placeholder: "e.g. 60000",
        helperText: "Heavy melt scrap (circular feed)",
        required: false,
        defaultValue: 60000,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 40,
      },
      {
        key: "limestone_flux",
        label: "Limestone & Dolomite Flux",
        category: "materials",
        unit: "tonnes",
        placeholder: "e.g. 32000",
        helperText: "Slag foaming and impurity scavenging flux",
        required: false,
        defaultValue: 32000,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 440,
      },

      // Process / Utilities
      {
        key: "graphite_electrodes",
        label: "Graphite Electrode Consumption",
        category: "process_utilities",
        unit: "tonnes",
        placeholder: "e.g. 450",
        helperText: "Electrode oxidation in EAF smelting",
        required: false,
        defaultValue: 450,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 3200,
      },
      {
        key: "industrial_oxygen",
        label: "Cryogenic Oxygen Injection",
        category: "process_utilities",
        unit: "1,000 Nm³",
        placeholder: "e.g. 18000",
        helperText: "Oxygen lancing in basic oxygen furnace",
        required: false,
        defaultValue: 18000,
        scope: "Scope 2",
        emissionFactorKgPerUnit: 160,
      },

      // Waste & Circularity
      {
        key: "blast_furnace_slag",
        label: "BF / EAF Slag Generation (Aggregates)",
        category: "waste_circularity",
        unit: "tonnes",
        placeholder: "e.g. 68000",
        helperText: "Slag granulated for cement blending (avoided credit)",
        required: false,
        defaultValue: 68000,
        scope: "Scope 3",
        emissionFactorKgPerUnit: -80,
      },
      {
        key: "dust_sludge_waste",
        label: "Baghouse Dust & Mill Scale (Landfilled)",
        category: "waste_circularity",
        unit: "tonnes",
        placeholder: "e.g. 5200",
        helperText: "Non-recycled zinc-heavy dusts",
        required: false,
        defaultValue: 5200,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 520,
      },

      // Transport
      {
        key: "bulk_raw_freight",
        label: "Ore & Coal Rail Freight Logistics",
        category: "transport",
        unit: "10,000 tonne-km",
        placeholder: "e.g. 2100",
        helperText: "Inbound railway rake transport",
        required: false,
        defaultValue: 2100,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 420,
      },
      {
        key: "finished_steel_freight",
        label: "Finished Rebar / Coil Dispatch",
        category: "transport",
        unit: "10,000 tonne-km",
        placeholder: "e.g. 1400",
        helperText: "Heavy multi-axle truck logistics",
        required: false,
        defaultValue: 1400,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 980,
      },
    ],

    food_processing: [
      // Production
      {
        key: "annual_production",
        label: "Annual Finished Food Output",
        category: "production",
        unit: "tonnes",
        placeholder: "e.g. 45000",
        helperText: "Total packaged food or beverage throughput",
        required: true,
        defaultValue: 45000,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 0,
      },

      // Energy
      {
        key: "natural_gas_boilers",
        label: "Natural Gas (Steam Boilers & Pasteurizers)",
        category: "energy",
        unit: "1,000 m³",
        placeholder: "e.g. 3200",
        helperText: "High-pressure thermal sterilization and cooking",
        required: true,
        defaultValue: 3200,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 2020,
      },
      {
        key: "grid_electricity",
        label: "Purchased Electricity (Plant & Cold Store)",
        category: "energy",
        unit: "MWh",
        placeholder: "e.g. 16500",
        helperText: "Continuous refrigeration chillers and lines",
        required: true,
        defaultValue: 16500,
        scope: "Scope 2",
        emissionFactorKgPerUnit: 710,
      },
      {
        key: "lpg_cooking",
        label: "LPG / Propane (Baking & Roasting)",
        category: "energy",
        unit: "tonnes",
        placeholder: "e.g. 280",
        helperText: "Direct flame cooking and dehydration",
        required: false,
        defaultValue: 280,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 2980,
      },
      {
        key: "diesel_generators",
        label: "Diesel Generator Power",
        category: "energy",
        unit: "kL",
        placeholder: "e.g. 95",
        helperText: "Emergency backup refrigeration backup",
        required: false,
        defaultValue: 95,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 2680,
      },

      // Materials
      {
        key: "raw_agricultural_input",
        label: "Raw Agricultural / Dairy Inputs",
        category: "materials",
        unit: "tonnes",
        placeholder: "e.g. 52000",
        helperText: "Milk, grain, poultry, or vegetable raw feed",
        required: true,
        defaultValue: 52000,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 680,
      },
      {
        key: "packaging_plastic",
        label: "Plastic Packaging (PET, Multilayer Pouches)",
        category: "materials",
        unit: "tonnes",
        placeholder: "e.g. 1800",
        helperText: "Flexible films and rigid plastic bottles",
        required: false,
        defaultValue: 1800,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 2600,
      },
      {
        key: "packaging_corrugated",
        label: "Corrugated Cardboard & Paperboard",
        category: "materials",
        unit: "tonnes",
        placeholder: "e.g. 2400",
        helperText: "Secondary and tertiary shipping cartons",
        required: false,
        defaultValue: 2400,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 820,
      },

      // Process / Utilities
      {
        key: "refrigerant_leakage",
        label: "Refrigerant Gas Top-Up (R-134a / R-404A)",
        category: "process_utilities",
        unit: "kg",
        placeholder: "e.g. 420",
        helperText: "High-GWP fugitive refrigerant loss from chillers",
        required: false,
        defaultValue: 420,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 3922,
      }, // High GWP!
      {
        key: "cip_cleaning_water",
        label: "CIP (Clean-in-Place) Hot Water",
        category: "process_utilities",
        unit: "1,000 m³",
        placeholder: "e.g. 380",
        helperText: "Sanitation and chemical washing volume",
        required: false,
        defaultValue: 380,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 410,
      },

      // Waste & Circularity
      {
        key: "organic_food_waste",
        label: "Solid Organic Waste (to Landfill)",
        category: "waste_circularity",
        unit: "tonnes",
        placeholder: "e.g. 1900",
        helperText: "Unsold trimmings, spoiled organics (methane potential)",
        required: false,
        defaultValue: 1900,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 1450,
      },
      {
        key: "anaerobic_biogas_waste",
        label: "Organic Waste to Anaerobic Digestion (Biogas)",
        category: "waste_circularity",
        unit: "tonnes",
        placeholder: "e.g. 1100",
        helperText: "Methane captured for facility steam generation",
        required: false,
        defaultValue: 1100,
        scope: "Scope 3",
        emissionFactorKgPerUnit: -750,
      },
      {
        key: "high_bod_wastewater",
        label: "High-BOD Process Wastewater",
        category: "waste_circularity",
        unit: "1,000 m³",
        placeholder: "e.g. 460",
        helperText: "Dairy whey, starch rinses, organic effluent",
        required: false,
        defaultValue: 460,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 620,
      },

      // Transport
      {
        key: "temperature_controlled_transport",
        label: "Refrigerated Reefer Fleet Logistics",
        category: "transport",
        unit: "10,000 tonne-km",
        placeholder: "e.g. 450",
        helperText: "Cold-chain distribution trucks",
        required: false,
        defaultValue: 450,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 1850,
      },
    ],

    cement: [
      // Production
      {
        key: "annual_production",
        label: "Annual Clinker / Cement Production",
        category: "production",
        unit: "tonnes",
        placeholder: "e.g. 850000",
        helperText: "Total grey/white Portland cement output",
        required: true,
        defaultValue: 850000,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 0,
      },

      // Energy
      {
        key: "kiln_coal_petcoke",
        label: "Kiln Fuel (Petcoke & Thermal Coal)",
        category: "energy",
        unit: "tonnes",
        placeholder: "e.g. 92000",
        helperText: "High-temperature burning in calciner and rotary kiln",
        required: true,
        defaultValue: 92000,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 2950,
      },
      {
        key: "grid_electricity",
        label: "Purchased Electricity (Finish Grinding Mills)",
        category: "energy",
        unit: "MWh",
        placeholder: "e.g. 95000",
        helperText: "Raw meal grinding, kiln drives, and ball mills",
        required: true,
        defaultValue: 95000,
        scope: "Scope 2",
        emissionFactorKgPerUnit: 710,
      },
      {
        key: "alternative_refuse_fuel",
        label: "Alternative Fuel (RDF / Biomass / Tyres)",
        category: "energy",
        unit: "tonnes",
        placeholder: "e.g. 18000",
        helperText: "Co-processed secondary thermal fuel",
        required: false,
        defaultValue: 18000,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 1100,
      },

      // Materials
      {
        key: "limestone_raw",
        label: "Raw Limestone (CaCO3 Calcination)",
        category: "materials",
        unit: "tonnes",
        placeholder: "e.g. 1150000",
        helperText:
          "Process de-carbonation in precalciner (CaCO3 -> CaO + CO2)",
        required: true,
        defaultValue: 1150000,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 525,
      }, // Major chemical process emission
      {
        key: "gypsum_additives",
        label: "Gypsum, Pozzolana & Fly Ash Additives",
        category: "materials",
        unit: "tonnes",
        placeholder: "e.g. 140000",
        helperText: "Clinker replacement blending materials",
        required: false,
        defaultValue: 140000,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 80,
      },

      // Process / Utilities
      {
        key: "refractory_brick_wear",
        label: "Kiln Refractory Lining Replacements",
        category: "process_utilities",
        unit: "tonnes",
        placeholder: "e.g. 350",
        helperText: "Alumina and magnesia brick consumption",
        required: false,
        defaultValue: 350,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 1200,
      },
      {
        key: "quarry_explosives",
        label: "Quarry Explosives & Blasting",
        category: "process_utilities",
        unit: "tonnes",
        placeholder: "e.g. 120",
        helperText: "ANFO and emulsions for limestone extraction",
        required: false,
        defaultValue: 120,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 2100,
      },

      // Waste & Circularity
      {
        key: "cement_kiln_dust",
        label: "Cement Kiln Dust (CKD) Recycled",
        category: "waste_circularity",
        unit: "tonnes",
        placeholder: "e.g. 24000",
        helperText: "Dust captured in baghouses and returned to raw mix",
        required: false,
        defaultValue: 24000,
        scope: "Scope 3",
        emissionFactorKgPerUnit: -150,
      },
      {
        key: "industrial_byproduct_slag",
        label: "Slag / Fly Ash Blended into Clinker",
        category: "waste_circularity",
        unit: "tonnes",
        placeholder: "e.g. 85000",
        helperText: "Avoided virgin clinker production via blended cement",
        required: false,
        defaultValue: 85000,
        scope: "Scope 3",
        emissionFactorKgPerUnit: -480,
      },

      // Transport
      {
        key: "bulk_cement_dispatch",
        label: "Bulk Bulker & Bagged Truck Dispatch",
        category: "transport",
        unit: "10,000 tonne-km",
        placeholder: "e.g. 4200",
        helperText: "Distribution to ready-mix plants and distributors",
        required: false,
        defaultValue: 4200,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 920,
      },
    ],

    chemical: [
      // Production
      {
        key: "annual_production",
        label: "Annual Finished Chemicals Output",
        category: "production",
        unit: "tonnes",
        placeholder: "e.g. 90000",
        helperText: "Specialty chemicals, polymers, and synthetic reagents",
        required: true,
        defaultValue: 90000,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 0,
      },

      // Energy
      {
        key: "natural_gas_reforming",
        label: "Natural Gas (Cracking & Reforming)",
        category: "energy",
        unit: "1,000 m³",
        placeholder: "e.g. 14000",
        helperText: "Direct cracking furnace thermal energy",
        required: true,
        defaultValue: 14000,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 2020,
      },
      {
        key: "grid_electricity",
        label: "Purchased Electricity (Electrolysis & Drives)",
        category: "energy",
        unit: "MWh",
        placeholder: "e.g. 48000",
        helperText: "Electrochemical cells, pumps, compressors",
        required: true,
        defaultValue: 48000,
        scope: "Scope 2",
        emissionFactorKgPerUnit: 710,
      },
      {
        key: "high_pressure_steam",
        label: "Purchased High-Pressure Steam",
        category: "energy",
        unit: "tonnes",
        placeholder: "e.g. 35000",
        helperText: "Imported steam from central utility cluster",
        required: false,
        defaultValue: 35000,
        scope: "Scope 2",
        emissionFactorKgPerUnit: 280,
      },

      // Materials
      {
        key: "hydrocarbon_feedstock",
        label: "Hydrocarbon Feedstock (Naphtha / Ethylene)",
        category: "materials",
        unit: "tonnes",
        placeholder: "e.g. 68000",
        helperText: "Petrochemical base feedstock",
        required: true,
        defaultValue: 68000,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 1850,
      },
      {
        key: "inorganic_reagents",
        label: "Inorganic Acids & Caustic Soda",
        category: "materials",
        unit: "tonnes",
        placeholder: "e.g. 18500",
        helperText: "Sulfuric acid, chlorine, NaOH feed",
        required: false,
        defaultValue: 18500,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 980,
      },
      {
        key: "precious_metal_catalysts",
        label: "Heterogeneous Catalysts Consumed",
        category: "materials",
        unit: "tonnes",
        placeholder: "e.g. 45",
        helperText: "Zeolites, platinum/palladium supported beds",
        required: false,
        defaultValue: 45,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 12000,
      },

      // Process / Utilities
      {
        key: "process_flaring",
        label: "Process Off-Gas Flaring & Venting",
        category: "process_utilities",
        unit: "1,000 m³",
        placeholder: "e.g. 1400",
        helperText: "Fugitive VOCs and safety relief flare combustion",
        required: false,
        defaultValue: 1400,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 2450,
      },
      {
        key: "cooling_tower_pumping",
        label: "Cooling Tower & Chill Water Circulation",
        category: "process_utilities",
        unit: "MWh",
        placeholder: "e.g. 6200",
        helperText: "Heat rejection from exothermic reaction vessels",
        required: false,
        defaultValue: 6200,
        scope: "Scope 2",
        emissionFactorKgPerUnit: 710,
      },

      // Waste & Circularity
      {
        key: "hazardous_waste_incineration",
        label: "Hazardous Spent Solvent Incineration",
        category: "waste_circularity",
        unit: "tonnes",
        placeholder: "e.g. 2100",
        helperText: "Thermal oxidation of toxic organic fractions",
        required: false,
        defaultValue: 2100,
        scope: "Scope 1",
        emissionFactorKgPerUnit: 2800,
      },
      {
        key: "solvent_recovery_recycled",
        label: "Distillation Solvent Recovery (Recycled)",
        category: "waste_circularity",
        unit: "tonnes",
        placeholder: "e.g. 4200",
        helperText: "Closed-loop reclaimed solvent replacing virgin chemicals",
        required: false,
        defaultValue: 4200,
        scope: "Scope 3",
        emissionFactorKgPerUnit: -1900,
      },

      // Transport
      {
        key: "chemical_iso_tanker_logistics",
        label: "Specialized ISO Tanker Logistics",
        category: "transport",
        unit: "10,000 tonne-km",
        placeholder: "e.g. 850",
        helperText: "Hazardous chemical fleet freight",
        required: false,
        defaultValue: 850,
        scope: "Scope 3",
        emissionFactorKgPerUnit: 1650,
      },
    ],
  };

const CATEGORY_LABELS: Record<EmissionCategory, string> = {
  production: "Production Output",
  energy: "Energy & Fuel Combustion",
  materials: "Raw Materials & Feeds",
  process_utilities: "Process & Utilities",
  waste_circularity: "Waste & Circularity",
  transport: "Logistics & Transport",
};

/**
 * Clean Assessment Service Layer
 * Fully abstracted for future `POST /api/analyze` REST backend integration.
 */
class AssessmentService {
  private historyStorageKey = "industrial_carbon_assessment_history_v1";

  /**
   * Main calculation engine: dynamically calculates hotspots based on actual user inputs!
   * NEVER hardcodes electricity as hotspot.
   */
  async analyzeAssessment(
    input: FactoryAssessmentInput,
  ): Promise<AssessmentResult> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    // Send the frontend form values exactly as entered.
    // The Python frontend_adapter.py handles display-unit conversion.
    const payload = {
      industry: input.industry,
      annual_production: input.annualProductionVolume,
      operating_hours: input.operatingHoursPerYear,
      ...input.fields,
    };

    const response = await fetch(`${API_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `Carbon analysis failed (${response.status})${
          errorText ? `: ${errorText}` : ""
        }`,
      );
    }

    const backend = await response.json();

    if (backend.analysis_status !== "success") {
      const validationErrors = backend.data_agent?.validation?.errors;

      throw new Error(
        Array.isArray(validationErrors) && validationErrors.length > 0
          ? validationErrors.join(", ")
          : "Backend carbon analysis failed.",
      );
    }

    // ---------------------------------------------------------
    // Small helpers for adapting backend output to UI types.
    // The backend carbon engine reports emissions in kgCO2e.
    // The frontend UI uses tCO2e.
    // ---------------------------------------------------------

    const toNumber = (value: unknown): number => {
      const number = Number(value);
      return Number.isFinite(number) ? number : 0;
    };

    const kgToTons = (value: unknown): number => toNumber(value) / 1000;

    const readTCO2e = (item: any): number => {
      if (item?.tCO2e !== undefined) {
        return toNumber(item.tCO2e);
      }

      if (item?.tco2e !== undefined) {
        return toNumber(item.tco2e);
      }

      if (item?.co2e_kg !== undefined) {
        return kgToTons(item.co2e_kg);
      }

      if (item?.emissions_kg !== undefined) {
        return kgToTons(item.emissions_kg);
      }

      if (item?.co2e !== undefined) {
        return kgToTons(item.co2e);
      }

      if (item?.emissions !== undefined) {
        return kgToTons(item.emissions);
      }

      return 0;
    };

    const carbonSummary = backend.carbon_summary || {};

    const totalTCO2e =
      carbonSummary.total_tCO2e !== undefined
        ? toNumber(carbonSummary.total_tCO2e)
        : carbonSummary.total_tco2e !== undefined
          ? toNumber(carbonSummary.total_tco2e)
          : carbonSummary.total_kgco2e !== undefined
            ? kgToTons(carbonSummary.total_kgco2e)
            : carbonSummary.total_co2e_kg !== undefined
              ? kgToTons(carbonSummary.total_co2e_kg)
              : carbonSummary.total_co2e !== undefined
                ? kgToTons(carbonSummary.total_co2e)
                : backend.total_tCO2e !== undefined
                  ? toNumber(backend.total_tCO2e)
                  : backend.total_tco2e !== undefined
                    ? toNumber(backend.total_tco2e)
                    : backend.total_kgco2e !== undefined
                      ? kgToTons(backend.total_kgco2e)
                      : kgToTons(backend.total_co2e);

    // ---------------------------------------------------------
    // Hotspots
    // ---------------------------------------------------------

    const primaryBackend = backend.primary_hotspot || {};
    const secondaryBackend = backend.secondary_hotspot || {};

    const primaryHotspot: Hotspot = {
      source: primaryBackend.source || primaryBackend.name || "Unknown hotspot",
      category: primaryBackend.category || "energy",
      categoryLabel:
        primaryBackend.categoryLabel ||
        primaryBackend.category_label ||
        primaryBackend.category ||
        "Energy & Fuel Combustion",
      scope: primaryBackend.scope || "Scope 1",
      tCO2e: readTCO2e(primaryBackend),
      percentage: toNumber(primaryBackend.percentage),
      severity: primaryBackend.severity || "High",
      keyDriver: primaryBackend.keyDriver || primaryBackend.key_driver || "",
      benchmarkComparison:
        primaryBackend.benchmarkComparison ||
        primaryBackend.benchmark_comparison ||
        "",
    };

    const secondaryHotspot: Hotspot = {
      source:
        secondaryBackend.source || secondaryBackend.name || "Unknown hotspot",
      category: secondaryBackend.category || "energy",
      categoryLabel:
        secondaryBackend.categoryLabel ||
        secondaryBackend.category_label ||
        secondaryBackend.category ||
        "Energy & Fuel Combustion",
      scope: secondaryBackend.scope || "Scope 1",
      tCO2e: readTCO2e(secondaryBackend),
      percentage: toNumber(secondaryBackend.percentage),
      severity: secondaryBackend.severity || "Moderate",
      keyDriver:
        secondaryBackend.keyDriver || secondaryBackend.key_driver || "",
      benchmarkComparison:
        secondaryBackend.benchmarkComparison ||
        secondaryBackend.benchmark_comparison ||
        "",
    };

    // ---------------------------------------------------------
    // Emission breakdown
    // ---------------------------------------------------------

    const rawEmissionBreakdown = backend.emission_breakdown;

    const normalizedEmissionBreakdown: any[] = Array.isArray(
      rawEmissionBreakdown,
    )
      ? rawEmissionBreakdown
      : rawEmissionBreakdown && typeof rawEmissionBreakdown === "object"
        ? Object.entries(rawEmissionBreakdown).map(
            ([key, value]: [string, any]) => {
              if (value && typeof value === "object" && !Array.isArray(value)) {
                return {
                  id: key,
                  ...value,
                };
              }

              return {
                id: key,
                source: key,
                emissions: value,
              };
            },
          )
        : [];

    const emissionBreakdown: EmissionSource[] = normalizedEmissionBreakdown.map(
      (item: any, index: number) => ({
        id: item.id || item.source_id || `emission-${index}`,

        name:
          item.name ||
          item.source ||
          item.label ||
          `Emission Source ${index + 1}`,

        category: item.category || "energy",

        categoryLabel:
          item.categoryLabel ||
          item.category_label ||
          item.category ||
          "Energy & Fuel Combustion",

        scope: item.scope || "Scope 1",

        value: toNumber(
          item.value ?? item.activity_value ?? item.activity ?? 0,
        ),

        unit: item.unit || "",

        tCO2e: readTCO2e(item),

        percentage: toNumber(item.percentage),

        isHotspot: Boolean(item.isHotspot ?? item.is_hotspot ?? false),

        intensityPerUnit: toNumber(
          item.intensityPerUnit ?? item.intensity_per_unit ?? 0,
        ),
      }),
    );

    // ---------------------------------------------------------
    // Scope breakdown
    // ---------------------------------------------------------

    const backendScopeBreakdown =
      carbonSummary.scope_breakdown || backend.scope_breakdown || {};

    const calculateScopeFromSources = (scope: string) => {
      const tCO2e = emissionBreakdown
        .filter((item) => item.scope === scope)
        .reduce((sum, item) => sum + item.tCO2e, 0);

      return {
        tCO2e,
        percentage: totalTCO2e > 0 ? (tCO2e / totalTCO2e) * 100 : 0,
      };
    };

    const scope1Fallback = calculateScopeFromSources("Scope 1");
    const scope2Fallback = calculateScopeFromSources("Scope 2");
    const scope3Fallback = calculateScopeFromSources("Scope 3");

    const scope1 =
      backendScopeBreakdown.scope1 || backendScopeBreakdown["1"] || {};

    const scope2 =
      backendScopeBreakdown.scope2 || backendScopeBreakdown["2"] || {};

    const scope3 =
      backendScopeBreakdown.scope3 || backendScopeBreakdown["3"] || {};

    const scopeBreakdown = {
      scope1: {
        tCO2e:
          scope1.tCO2e !== undefined
            ? toNumber(scope1.tCO2e)
            : scope1.tco2e !== undefined
              ? toNumber(scope1.tco2e)
              : scope1.co2e_kg !== undefined
                ? kgToTons(scope1.co2e_kg)
                : scope1Fallback.tCO2e,
        percentage:
          scope1.percentage !== undefined
            ? toNumber(scope1.percentage)
            : scope1Fallback.percentage,
      },

      scope2: {
        tCO2e:
          scope2.tCO2e !== undefined
            ? toNumber(scope2.tCO2e)
            : scope2.tco2e !== undefined
              ? toNumber(scope2.tco2e)
              : scope2.co2e_kg !== undefined
                ? kgToTons(scope2.co2e_kg)
                : scope2Fallback.tCO2e,
        percentage:
          scope2.percentage !== undefined
            ? toNumber(scope2.percentage)
            : scope2Fallback.percentage,
      },

      scope3: {
        tCO2e:
          scope3.tCO2e !== undefined
            ? toNumber(scope3.tCO2e)
            : scope3.tco2e !== undefined
              ? toNumber(scope3.tco2e)
              : scope3.co2e_kg !== undefined
                ? kgToTons(scope3.co2e_kg)
                : scope3Fallback.tCO2e,
        percentage:
          scope3.percentage !== undefined
            ? toNumber(scope3.percentage)
            : scope3Fallback.percentage,
      },
    };

    // ---------------------------------------------------------
    // Category breakdown
    // ---------------------------------------------------------

    const backendCategoryBreakdown =
      carbonSummary.category_breakdown || backend.category_breakdown || [];

    const categoryBreakdown =
      Array.isArray(backendCategoryBreakdown) &&
      backendCategoryBreakdown.length > 0
        ? backendCategoryBreakdown.map((item: any) => ({
            category: item.category || "energy",
            label:
              item.label || item.categoryLabel || item.category || "Energy",
            tCO2e: readTCO2e(item),
            percentage: toNumber(item.percentage),
          }))
        : Object.entries(
            emissionBreakdown.reduce(
              (acc, item) => {
                const category = item.category;

                if (!acc[category]) {
                  acc[category] = 0;
                }

                acc[category] += item.tCO2e;
                return acc;
              },
              {} as Record<string, number>,
            ),
          ).map(([category, tCO2e]) => ({
            category: category as EmissionCategory,
            label: CATEGORY_LABELS[category as EmissionCategory] || category,
            tCO2e: Number(tCO2e.toFixed(2)),
            percentage:
              totalTCO2e > 0
                ? Number(((tCO2e / totalTCO2e) * 100).toFixed(1))
                : 0,
          }));

    // ---------------------------------------------------------
    // Recommendations
    // ---------------------------------------------------------

    const backendRecommendations = Array.isArray(backend.recommendations)
      ? backend.recommendations
      : Array.isArray(backend.recommendations?.candidates)
        ? backend.recommendations.candidates
        : [];

    const recommendations: Recommendation[] = backendRecommendations.map(
      (item: any, index: number) => ({
        id: item.id || `rec-${index + 1}`,

        title:
          item.title || item.action || "Recommended Decarbonization Action",

        targetHotspot:
          item.targetHotspot || item.target_hotspot || primaryHotspot.source,

        whyRelevant: item.whyRelevant || item.reason || item.description || "",

        actionPlan: item.actionPlan || item.action || item.description || "",

        difficulty:
          item.difficulty || item.implementation_difficulty || "Medium",

        capitalLevel: item.capitalLevel || item.capital_level || "Medium",

        circularity:
          item.circularity !== undefined ? String(item.circularity) : "",

        tier: item.tier || "Recommended",

        impact: item.impact || {
          estimatedCostRange: "",
          estimatedCostMinUSD: 0,
          estimatedCostMaxUSD: 0,
          potentialCo2ReductionPercent: 0,
          potentialCo2ReductionTons: 0,
          annualSavingsUSD: 0,
          paybackPeriodYears: "",
          roiLevel: "Unknown",
        },
      }),
    );

    // ---------------------------------------------------------
    // Confidence
    // ---------------------------------------------------------

    const backendConfidence =
      backend.data_agent?.confidence || backend.confidence || {};

    const confidenceScore = toNumber(
      backendConfidence.score ?? backendConfidence.confidence_score ?? 0,
    );

    const confidenceLevel =
      backendConfidence.level ||
      (confidenceScore >= 85
        ? "High"
        : confidenceScore >= 70
          ? "Medium"
          : "Preliminary");

    const confidence: ConfidenceMetrics = {
      score: confidenceScore,
      level: confidenceLevel,
      missingDataPenalty: 100 - confidenceScore,
      verifiedPointsCount: toNumber(
        backendConfidence.verified_points_count ??
          backendConfidence.verifiedPointsCount ??
          0,
      ),
      totalPointsCount: toNumber(
        backendConfidence.total_points_count ??
          backendConfidence.totalPointsCount ??
          0,
      ),
    };

    // ---------------------------------------------------------
    // Final frontend-compatible result
    // ---------------------------------------------------------

    const result: AssessmentResult = {
      id: `asm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,

      createdAt: new Date().toISOString(),

      facilityName: input.facilityName || "Industrial Facility",

      facilityLocation: input.facilityLocation || "",

      reportingPeriod: input.reportingPeriod || "Annual",

      industry: input.industry,

      industryName: INDUSTRIES_METADATA[input.industry].name,

      total_co2e: Number(totalTCO2e.toFixed(2)),

      productionVolume: input.annualProductionVolume,

      productionUnit: input.productionUnit,

      carbonIntensity:
        input.annualProductionVolume > 0
          ? Number((totalTCO2e / input.annualProductionVolume).toFixed(3))
          : 0,

      primary_hotspot: primaryHotspot,

      secondary_hotspot: secondaryHotspot,

      confidence,

      emission_breakdown: emissionBreakdown,

      scope_breakdown: scopeBreakdown,

      category_breakdown: categoryBreakdown,

      recommendations,

      rawInputs: input,
    };

    // Keep the existing frontend history behavior.
    this.saveToHistory(result);

    return result;
  }

  /**
   * Generates actionable decarbonization interventions with ROI, CAPEX, circularity tags, and payback.
   */
  private generateRecommendations(
    industry: IndustryType,
    primary: Hotspot,
    secondary: Hotspot,
    totalTCO2e: number,
  ): Recommendation[] {
    const recs: Recommendation[] = [];

    // Primary Hotspot Targeted Action
    recs.push({
      id: "rec-001",
      title: `Decarbonization Overhaul for ${primary.source}`,
      targetHotspot: primary.source,
      whyRelevant: `Directly attacks the #1 emission hotspot generating ${primary.percentage}% of facility carbon emissions (${primary.tCO2e.toLocaleString()} tCO₂e).`,
      actionPlan: `Implement heat recovery loops, variable frequency drives, or fuel switching to lower specific consumption on ${primary.source}.`,
      difficulty: primary.category === "energy" ? "Medium" : "High",
      capitalLevel:
        primary.category === "energy" ? "Medium ($25k-$150k)" : "High (>$150k)",
      circularity: "Direct Heat/Energy Reuse",
      tier: "Quick Win",
      impact: {
        estimatedCostRange: "$45,000 - $120,000",
        estimatedCostMinUSD: 45000,
        estimatedCostMaxUSD: 120000,
        potentialCo2ReductionPercent: Math.round(primary.percentage * 0.35),
        potentialCo2ReductionTons: Math.round(primary.tCO2e * 0.35),
        annualSavingsUSD: Math.round(primary.tCO2e * 0.35 * 42),
        paybackPeriodYears: "1.4 - 2.2 yrs",
        roiLevel: "High",
      },
    });

    // Secondary Hotspot Targeted Action
    recs.push({
      id: "rec-002",
      title: `Efficiency Optimization & Material Switching for ${secondary.source}`,
      targetHotspot: secondary.source,
      whyRelevant: `Mitigates the secondary hotspot responsible for ${secondary.percentage}% of total emissions (${secondary.tCO2e.toLocaleString()} tCO₂e).`,
      actionPlan: `Deploy digital sub-metering, low-carbon certified raw inputs, and closed-loop process integration to curtail leakage and supply chain intensity.`,
      difficulty: "Low",
      capitalLevel: "Low (<$25k)",
      circularity: "Material Closed-Loop",
      tier: "Quick Win",
      impact: {
        estimatedCostRange: "$15,000 - $35,000",
        estimatedCostMinUSD: 15000,
        estimatedCostMaxUSD: 35000,
        potentialCo2ReductionPercent: Math.round(secondary.percentage * 0.28),
        potentialCo2ReductionTons: Math.round(secondary.tCO2e * 0.28),
        annualSavingsUSD: Math.round(secondary.tCO2e * 0.28 * 38),
        paybackPeriodYears: "0.8 - 1.5 yrs",
        roiLevel: "High",
      },
    });

    // Industry-specific strategic transformation recommendation
    if (industry === "textile") {
      recs.push({
        id: "rec-003",
        title: "On-Site Solar PPA & Low-Liquor Jet Dyeing Modernization",
        targetHotspot: "Purchased Electricity & Process Water",
        whyRelevant:
          "Textile wet processing carries massive thermal and pumping energy overhead.",
        actionPlan:
          "Transition 40% of grid load to rooftop solar wheeled power and install closed-loop water recovery.",
        difficulty: "Medium",
        capitalLevel: "High (>$150k)",
        circularity: "High",
        tier: "Medium-Term Modernization",
        impact: {
          estimatedCostRange: "$180,000 - $350,000",
          estimatedCostMinUSD: 180000,
          estimatedCostMaxUSD: 350000,
          potentialCo2ReductionPercent: 22,
          potentialCo2ReductionTons: Math.round(totalTCO2e * 0.22),
          annualSavingsUSD: Math.round(totalTCO2e * 0.22 * 55),
          paybackPeriodYears: "3.2 - 4.1 yrs",
          roiLevel: "High",
        },
      });
    } else if (industry === "steel") {
      recs.push({
        id: "rec-003",
        title: "Top Gas Pressure Recovery (TRT) & Slag Heat Granulation",
        targetHotspot: "Coke Combustion & Blast Furnace Gases",
        whyRelevant:
          "Blast furnace pressure and off-gases carry 30% of unrecovered energy.",
        actionPlan:
          "Install expansion turbine for captive electricity generation and granulated slag recycling.",
        difficulty: "High",
        capitalLevel: "High (>$150k)",
        circularity: "Direct Heat/Energy Reuse",
        tier: "Deep Decarbonization",
        impact: {
          estimatedCostRange: "$400,000 - $950,000",
          estimatedCostMinUSD: 400000,
          estimatedCostMaxUSD: 950000,
          potentialCo2ReductionPercent: 18,
          potentialCo2ReductionTons: Math.round(totalTCO2e * 0.18),
          annualSavingsUSD: Math.round(totalTCO2e * 0.18 * 62),
          paybackPeriodYears: "2.8 - 3.9 yrs",
          roiLevel: "High",
        },
      });
    } else if (industry === "food_processing") {
      recs.push({
        id: "rec-003",
        title:
          "Natural Refrigerant Conversion (NH3/CO2 Cascade) & Biogas Steam",
        targetHotspot: "Refrigerant Gases & Natural Gas Boilers",
        whyRelevant:
          "Eliminates high-GWP fugitive HFCs and turns organic waste into green boiler steam.",
        actionPlan:
          "Replace legacy R-404a chillers with ammonia cascade systems and route organic wash effluent to digester.",
        difficulty: "Medium",
        capitalLevel: "Medium ($25k-$150k)",
        circularity: "Direct Heat/Energy Reuse",
        tier: "Medium-Term Modernization",
        impact: {
          estimatedCostRange: "$75,000 - $160,000",
          estimatedCostMinUSD: 75000,
          estimatedCostMaxUSD: 160000,
          potentialCo2ReductionPercent: 24,
          potentialCo2ReductionTons: Math.round(totalTCO2e * 0.24),
          annualSavingsUSD: Math.round(totalTCO2e * 0.24 * 48),
          paybackPeriodYears: "1.9 - 2.8 yrs",
          roiLevel: "High",
        },
      });
    } else if (industry === "cement") {
      recs.push({
        id: "rec-003",
        title:
          "Clinker Substitution (LC3 Limestone Calcined Clay) & RDF Co-Processing",
        targetHotspot: "Limestone Calcination & Kiln Coal",
        whyRelevant:
          "Direct limestone calcination emits unavoidable process CO2; substituting clinker with activated clay slashes intensity by 40%.",
        actionPlan:
          "Increase alternative fuel thermal substitution to 35% and formulate LC3 low-carbon blend.",
        difficulty: "High",
        capitalLevel: "High (>$150k)",
        circularity: "Material Closed-Loop",
        tier: "Deep Decarbonization",
        impact: {
          estimatedCostRange: "$320,000 - $700,000",
          estimatedCostMinUSD: 320000,
          estimatedCostMaxUSD: 700000,
          potentialCo2ReductionPercent: 31,
          potentialCo2ReductionTons: Math.round(totalTCO2e * 0.31),
          annualSavingsUSD: Math.round(totalTCO2e * 0.31 * 50),
          paybackPeriodYears: "2.4 - 3.5 yrs",
          roiLevel: "High",
        },
      });
    } else {
      recs.push({
        id: "rec-003",
        title: "Closed-Loop Solvent Distillation & Low-NOx Cracking Combustors",
        targetHotspot: "Hydrocarbon Feedstocks & Flare Emissions",
        whyRelevant:
          "Recovers 90%+ of organic solvent streams and reduces feedstock cracking losses.",
        actionPlan:
          "Install automated fractional vacuum columns and flare gas recovery compressor skids.",
        difficulty: "High",
        capitalLevel: "High (>$150k)",
        circularity: "Material Closed-Loop",
        tier: "Deep Decarbonization",
        impact: {
          estimatedCostRange: "$220,000 - $480,000",
          estimatedCostMinUSD: 220000,
          estimatedCostMaxUSD: 480000,
          potentialCo2ReductionPercent: 26,
          potentialCo2ReductionTons: Math.round(totalTCO2e * 0.26),
          annualSavingsUSD: Math.round(totalTCO2e * 0.26 * 58),
          paybackPeriodYears: "2.1 - 3.4 yrs",
          roiLevel: "High",
        },
      });
    }

    return recs;
  }

  /**
   * History Management
   */
  async getAssessmentHistory(): Promise<HistoricalAssessment[]> {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(this.historyStorageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed reading history from storage", e);
    }
    return this.getDefaultHistory();
  }

  private saveToHistory(result: AssessmentResult): void {
    if (typeof window === "undefined") return;
    try {
      const current = this.getHistorySync();
      const newItem: HistoricalAssessment = {
        id: result.id,
        facilityName: result.facilityName,
        reportingPeriod: result.reportingPeriod,
        industry: result.industry,
        industryName: result.industryName,
        total_co2e: result.total_co2e,
        carbonIntensity: result.carbonIntensity,
        primaryHotspotName: result.primary_hotspot.source,
        primaryHotspotPercentage: result.primary_hotspot.percentage,
        secondaryHotspotName: result.secondary_hotspot.source,
        confidenceScore: result.confidence.score,
        createdAt: result.createdAt,
      };
      const updated = [
        newItem,
        ...current.filter((i) => i.id !== result.id),
      ].slice(0, 20);
      localStorage.setItem(this.historyStorageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed storing assessment in history", e);
    }
  }

  private getHistorySync(): HistoricalAssessment[] {
    if (typeof window === "undefined") return this.getDefaultHistory();
    try {
      const stored = localStorage.getItem(this.historyStorageKey);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
    return this.getDefaultHistory();
  }

  private getDefaultHistory(): HistoricalAssessment[] {
    return [
      {
        id: "hist-001",
        facilityName: "Arvind Mills - Unit 4 Spinning & Dyeing",
        reportingPeriod: "Q4 2025",
        industry: "textile",
        industryName: "Textile Manufacturing",
        total_co2e: 45878.08,
        carbonIntensity: 1.42,
        primaryHotspotName: "Purchased Grid Electricity",
        primaryHotspotPercentage: 45.1,
        secondaryHotspotName: "Polyester / Synthetic Fibre",
        confidenceScore: 94,
        createdAt: "2026-01-15T10:30:00Z",
      },
      {
        id: "hist-002",
        facilityName: "Tata Steel - Jamshedpur Blast Furnace 3",
        reportingPeriod: "Q4 2025",
        industry: "steel",
        industryName: "Steel Manufacturing",
        total_co2e: 182400.5,
        carbonIntensity: 1.85,
        primaryHotspotName: "Metallurgical Coke & Coal",
        primaryHotspotPercentage: 58.3,
        secondaryHotspotName: "Direct Reduced Iron (DRI)",
        confidenceScore: 91,
        createdAt: "2026-01-20T14:15:00Z",
      },
      {
        id: "hist-003",
        facilityName: "Nestle - Sanand Dairy & Confectionery",
        reportingPeriod: "Q4 2025",
        industry: "food_processing",
        industryName: "Food Processing",
        total_co2e: 14230.2,
        carbonIntensity: 0.38,
        primaryHotspotName: "Natural Gas (Steam Boilers)",
        primaryHotspotPercentage: 39.4,
        secondaryHotspotName: "Refrigerant Gas Top-Up (R-134a)",
        confidenceScore: 89,
        createdAt: "2026-02-05T09:00:00Z",
      },
      {
        id: "hist-004",
        facilityName: "UltraTech Cement - Kotputli Clinker Line 2",
        reportingPeriod: "Q3 2025",
        industry: "cement",
        industryName: "Cement Manufacturing",
        total_co2e: 312000.0,
        carbonIntensity: 0.69,
        primaryHotspotName: "Raw Limestone (CaCO3 Calcination)",
        primaryHotspotPercentage: 54.2,
        secondaryHotspotName: "Kiln Fuel (Petcoke & Coal)",
        confidenceScore: 95,
        createdAt: "2025-11-12T11:00:00Z",
      },
      {
        id: "hist-005",
        facilityName: "Reliance Industries - Dahej Olefins Complex",
        reportingPeriod: "Q3 2025",
        industry: "chemical",
        industryName: "Chemical Manufacturing",
        total_co2e: 98500.4,
        carbonIntensity: 1.15,
        primaryHotspotName: "Hydrocarbon Feedstock (Naphtha)",
        primaryHotspotPercentage: 42.0,
        secondaryHotspotName: "Natural Gas (Cracking Furnaces)",
        confidenceScore: 92,
        createdAt: "2025-10-30T16:20:00Z",
      },
    ];
  }
}

export const assessmentService = new AssessmentService();
