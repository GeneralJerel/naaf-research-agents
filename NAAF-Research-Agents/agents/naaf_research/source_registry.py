"""Source registry mapping each NAAF layer to preferred authoritative domains.

These domain lists are used to restrict web searches to trusted government,
IGO, and reputable index sources for traceable citations.
"""

from typing import Dict, List


# Layer number -> (layer name, preferred domains)
LAYER_SOURCES: Dict[int, Dict] = {
    1: {
        "name": "Power & Electricity",
        "short_name": "Power",
        "weight": 20.0,
        "domains": [
            "iea.org",
            "worldbank.org",
            "globalpetrolprices.com",
            "oecd.org",
            "eia.gov",
            "irena.org",
        ],
    },
    2: {
        "name": "Chipset Manufacturers",
        "short_name": "Chips",
        "weight": 15.0,
        "domains": [
            "semi.org",
            "chips.gov",
            "oecd.org",
            "asml.com",
            "tsmc.com",
            "intel.com",
        ],
    },
    3: {
        "name": "Cloud & Data Centers",
        "short_name": "Cloud",
        "weight": 15.0,
        "domains": [
            "datacentermap.com",
            "telegeography.com",
            "itu.int",
            "synergyrg.com",
            "cloudscene.com",
        ],
    },
    4: {
        "name": "Model Developers",
        "short_name": "Models",
        "weight": 10.0,
        "domains": [
            "top500.org",
            "wipo.int",
            "aiindex.stanford.edu",
            "arxiv.org",
            "github.com",
        ],
    },
    5: {
        "name": "Platform & Data",
        "short_name": "Data",
        "weight": 10.0,
        "domains": [
            "oecd.org",
            "worldbank.org",
            "opendatawatch.com",
            "thegovlab.org",
        ],
    },
    6: {
        "name": "Applications & Startups",
        "short_name": "Apps",
        "weight": 10.0,
        "domains": [
            "dealroom.co",
            "crunchbase.com",
            "cbinsights.com",
            "pitchbook.com",
            "github.com",
        ],
    },
    7: {
        "name": "Education & Consulting",
        "short_name": "Talent",
        "weight": 10.0,
        "domains": [
            "unesco.org",
            "uis.unesco.org",
            "topuniversities.com",
            "timeshighereducation.com",
            "linkedin.com",
        ],
    },
    8: {
        "name": "Implementation",
        "short_name": "Adoption",
        "weight": 10.0,
        "domains": [
            "oxfordinsights.com",
            "eurostat.ec.europa.eu",
            "oecd.org",
            "worldbank.org",
        ],
    },
}


def get_layer_domains(layer_number: int) -> List[str]:
    """Return the preferred domains for a given layer number."""
    layer = LAYER_SOURCES.get(layer_number)
    return layer["domains"] if layer else []


def get_layer_domains_csv(layer_number: int) -> str:
    """Return comma-separated domain string for use with youcom_domain_search."""
    return ",".join(get_layer_domains(layer_number))


def get_layer_name(layer_number: int) -> str:
    """Return the full name of a layer."""
    layer = LAYER_SOURCES.get(layer_number)
    return layer["name"] if layer else f"Layer {layer_number}"


def get_layer_weight(layer_number: int) -> float:
    """Return the scoring weight for a layer (out of 100)."""
    layer = LAYER_SOURCES.get(layer_number)
    return layer["weight"] if layer else 0.0
