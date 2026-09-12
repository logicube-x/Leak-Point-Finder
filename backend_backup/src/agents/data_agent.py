from .field_mapper import map_raw_fields
from .unit_normalizer import normalize_units
from .validator import validate_data
from .confidence import compute_confidence

def run_data_agent(raw_data: dict) -> dict:
    """
    Data Agent Pipeline:
    Raw user input -> field mapping -> unit normalization -> validation -> confidence -> standardized data
    """
    mapped = map_raw_fields(raw_data)
    normalized = normalize_units(mapped)
    validated = validate_data(normalized)
    standardized = compute_confidence(validated)
    return standardized
