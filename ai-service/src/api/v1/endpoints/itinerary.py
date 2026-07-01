# AI Itinerary Generator — Region-wise with free OpenStreetMap enrichment
# Uses Groq (Llama 3) for planning + Overpass API (free forever) for real place data

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import logging
import re
import hashlib
import asyncio
import httpx
from src.core.config import settings

logger = logging.getLogger("sroute-itinerary")
router = APIRouter()

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"


def repair_json(raw: str) -> dict:
    """Attempt to repair truncated JSON by closing unterminated strings and brackets."""
    import re as _re
    # Strip trailing incomplete content
    s = raw.rstrip()
    # Close unterminated strings
    if s.count('"') % 2 != 0:
        s += '"'
    # Close unclosed brackets/braces
    opens = s.count('[') - s.count(']')
    s += ']' * opens
    opens = s.count('{') - s.count('}')
    s += '}' * opens
    # Remove trailing commas before brackets
    s = _re.sub(r',(\s*[\]\}])', r'\1', s)
    return json.loads(s)


# ─── Request / Response Models ───

class ItineraryRequest(BaseModel):
    city: str
    days: int = 3
    budgetPerDay: int = 100


class NearbySpot(BaseModel):
    name: str
    type: str  # cafe, restaurant, viewpoint, park, shop, museum, bar
    description: str
    walking_distance: str
    specialty: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None


class CulturalFood(BaseModel):
    dish: str
    description: str
    where_to_find: str
    cultural_significance: str


class PlaceDetail(BaseModel):
    name: str
    address: str
    description: str
    authenticity_score: int
    category: str
    lat: Optional[float] = None
    lon: Optional[float] = None
    opening_hours: Optional[str] = None
    tip: Optional[str] = None


class ItineraryStop(BaseModel):
    time: str
    end_time: str
    title: str
    description: str
    place: PlaceDetail
    nearby_cafes: List[NearbySpot]
    nearby_spots: List[NearbySpot]
    cultural_food: List[CulturalFood]
    emoji: str
    cost_estimate: Optional[str] = None


class Region(BaseModel):
    name: str
    description: str
    stops: List[ItineraryStop]
    region_tip: str


class DayPlan(BaseModel):
    day_number: int
    theme: str
    regions: List[Region]


class GeneratedItinerary(BaseModel):
    city: str
    total_days: int
    budget_per_day: int
    overall_authenticity: int
    trip_summary: str
    days: List[DayPlan]
    travel_tips: List[str]


# ─── Free OpenStreetMap Search ───

async def geocode_city(city: str) -> Optional[Dict[str, float]]:
    """Free geocoding via Nominatim (OpenStreetMap). No API key needed."""
    try:
        async with httpx.AsyncClient(timeout=10, headers={"User-Agent": "SrouteTravelApp/1.0"}) as client:
            r = await client.get(NOMINATIM_URL, params={
                "q": city, "format": "json", "limit": 1
            })
            data = r.json()
            if data:
                return {"lat": float(data[0]["lat"]), "lon": float(data[0]["lon"])}
    except Exception as e:
        logger.warning(f"Geocoding failed for {city}: {e}")
    return None


async def geocode_place(place_name: str, city: str) -> Optional[Dict[str, float]]:
    """Geocode a specific place (e.g. 'Senso-ji Temple, Tokyo'). Free via Nominatim."""
    if not place_name:
        return None
    try:
        query = f"{place_name}, {city}"
        async with httpx.AsyncClient(timeout=8, headers={"User-Agent": "SrouteTravelApp/1.0"}) as client:
            r = await client.get(NOMINATIM_URL, params={"q": query, "format": "json", "limit": 1})
            data = r.json()
            if data:
                return {"lat": float(data[0]["lat"]), "lon": float(data[0]["lon"])}
    except Exception as e:
        logger.debug(f"Geocoding place '{place_name}' failed: {e}")
    return None


async def search_nearby_osm(lat: float, lon: float, radius: int = 800) -> Dict[str, List[Dict]]:
    """Search real nearby places via Overpass API (OpenStreetMap). 100% free, no key."""
    query = f"""
    [out:json][timeout:15];
    (
      node["amenity"="cafe"](around:{radius},{lat},{lon});
      node["amenity"="restaurant"](around:{radius},{lat},{lon});
      node["amenity"="fast_food"](around:{radius},{lat},{lon});
      node["tourism"="viewpoint"](around:{radius},{lat},{lon});
      node["tourism"="attraction"](around:{radius},{lat},{lon});
      node["leisure"="park"](around:{radius},{lat},{lon});
      node["shop"](around:{radius},{lat},{lon});
      node["amenity"="bar"](around:{radius},{lat},{lon});
    );
    out body 30;
    """
    try:
        async with httpx.AsyncClient(timeout=15, headers={"User-Agent": "SrouteTravelApp/1.0"}) as client:
            r = await client.post(OVERPASS_URL, data={"data": query})
            elements = r.json().get("elements", [])
            results: Dict[str, List[Dict]] = {
                "cafes": [], "restaurants": [], "spots": []
            }
            for el in elements[:30]:
                tags = el.get("tags", {})
                name = tags.get("name", "Unnamed")
                amenity = tags.get("amenity", "")
                tourism = tags.get("tourism", "")
                item = {
                    "name": name,
                    "lat": el.get("lat"),
                    "lon": el.get("lon"),
                    "type": amenity or tourism or tags.get("shop", "place")
                }
                if amenity == "cafe":
                    results["cafes"].append(item)
                elif amenity in ("restaurant", "fast_food"):
                    results["restaurants"].append(item)
                else:
                    results["spots"].append(item)
            return results
    except Exception as e:
        logger.warning(f"Overpass search failed: {e}")
        return {"cafes": [], "restaurants": [], "spots": []}


def merge_osm_into_stop(stop_data: dict, osm_data: Dict[str, List[Dict]], used_names: set = None) -> dict:
    """Merge real OSM data into AI-generated stop. Tracks used names to avoid duplicates."""
    if used_names is None:
        used_names = set()

    # Add real cafes from OSM
    existing_cafe_names = {c["name"].lower() for c in stop_data.get("nearby_cafes", [])}
    added_cafes = 0
    for osm_cafe in osm_data.get("cafes", []):
        if added_cafes >= 2:
            break
        lower_name = osm_cafe["name"].lower()
        if lower_name not in existing_cafe_names and lower_name not in used_names and osm_cafe["name"] != "Unnamed":
            stop_data.setdefault("nearby_cafes", []).append({
                "name": osm_cafe["name"],
                "type": "cafe",
                "specialty": osm_cafe.get("tags", {}).get("cuisine", ""),
                "description": "Nearby café discovered via local map data.",
                "walking_distance": "~5 min walk",
                "lat": osm_cafe.get("lat"),
                "lon": osm_cafe.get("lon")
            })
            used_names.add(lower_name)
            added_cafes += 1

    # Add real nearby spots (viewpoints, parks, shops)
    existing_spot_names = {s["name"].lower() for s in stop_data.get("nearby_spots", [])}
    added_spots = 0
    for osm_spot in osm_data.get("spots", []):
        if added_spots >= 2:
            break
        lower_name = osm_spot["name"].lower()
        if lower_name not in existing_spot_names and lower_name not in used_names and osm_spot["name"] != "Unnamed":
            stop_data.setdefault("nearby_spots", []).append({
                "name": osm_spot["name"],
                "type": osm_spot["type"],
                "description": f"Nearby {osm_spot['type']} discovered via local map data.",
                "walking_distance": "~5 min walk",
                "lat": osm_spot.get("lat"),
                "lon": osm_spot.get("lon")
            })
            used_names.add(lower_name)
            added_spots += 1

    # Add real restaurants from OSM
    added_rests = 0
    for osm_rest in osm_data.get("restaurants", []):
        if added_rests >= 1:
            break
        lower_name = osm_rest["name"].lower()
        if lower_name not in existing_spot_names and lower_name not in used_names and osm_rest["name"] != "Unnamed":
            stop_data.setdefault("nearby_spots", []).append({
                "name": osm_rest["name"],
                "type": "restaurant",
                "description": "Nearby restaurant discovered via local map data.",
                "walking_distance": "~5 min walk",
                "lat": osm_rest.get("lat"),
                "lon": osm_rest.get("lon")
            })
            used_names.add(lower_name)
            added_rests += 1

    return stop_data


# ─── Groq AI System Prompt ───

ITINERARY_SYSTEM_PROMPT = """You are Sroute's AI Itinerary Architect — an elite travel planner creating hyper-detailed, region-organized trip plans.

You MUST respond with ONLY valid JSON (no markdown, no code fences, no explanation). Follow this EXACT schema:

{
  "city": "string",
  "total_days": number,
  "budget_per_day": number,
  "overall_authenticity": number (85-98),
  "trip_summary": "1-2 sentence overview",
  "travel_tips": ["tip 1", "tip 2", "tip 3"],
  "days": [
    {
      "day_number": number,
      "theme": "string (catchy day theme)",
      "regions": [
        {
          "name": "Neighborhood/Area Name",
          "description": "1 sentence about this area's vibe",
          "region_tip": "Local insider tip for this area",
          "stops": [
            {
              "time": "HH:MM",
              "end_time": "HH:MM",
              "title": "Engaging activity title",
              "description": "2-3 sentences about what you'll do and experience",
              "place": {
                "name": "REAL place name that exists",
                "address": "real address or neighborhood, city",
                "description": "Why special (1-2 sentences)",
                "authenticity_score": number (80-99),
                "category": "attraction|cafe|restaurant|landmark|park|market",
                "lat": number or null,
                "lon": number or null,
                "opening_hours": "e.g., '9:00-18:00' or null",
                "tip": "Quick local tip for this specific place"
              },
              "nearby_cafes": [
                {"name": "REAL cafe", "type": "cafe", "specialty": "what they're known for", "description": "1 sentence", "walking_distance": "X min walk", "lat": null, "lon": null}
              ],
              "nearby_spots": [
                {"name": "REAL nearby place", "type": "viewpoint|park|shop|market|gallery", "description": "1 sentence", "walking_distance": "X min walk", "lat": null, "lon": null}
              ],
              "cultural_food": [
                {"dish": "Dish name", "description": "What it is", "where_to_find": "Where to eat it", "cultural_significance": "Why it matters to locals"}
              ],
              "emoji": "relevant emoji",
              "cost_estimate": "e.g., '$5-15' or 'Free'"
            }
          ]
        }
      ]
    }
  ]
}

RULES:
- Organize each day by REGIONS (neighborhoods/areas). Each day should visit 1-3 regions.
- Each region has 1-3 stops within walking distance of each other.
- Use REAL place names. Include approximate lat/lon coordinates.
- Include 1-2 real nearby cafes and 1-2 nearby spots (viewpoints, parks, shops) per stop.
- Include 1-2 cultural food items with authentic detail.
- Include cost estimates for each stop.
- Authenticity scores: 80-99 (locals-only = 95+).
- Add practical travel tips at the end.
- Times must flow logically morning to evening.
- Make it extraordinary — specific, vivid, insider-level detail."""


# ─── Main Endpoint ───

@router.post("/generate")
async def generate_itinerary(req: ItineraryRequest):
    api_key = settings.GROQ_API_KEY or None

    if not api_key or api_key == "mock-key":
        return _fallback_itinerary(req)

    # Step 1: Get AI-generated plan from Groq
    try:
        from groq import Groq
        client = Groq(api_key=api_key)

        user_prompt = f"""Create a detailed {req.days}-day itinerary for {req.city}.
Budget: ${req.budgetPerDay} per day.
Organize by regions/neighborhoods. Include real places, nearby cafes, nearby spots (viewpoints, parks, shops), and cultural food with cost estimates. Make it extraordinary and detailed."""

        completion = client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": ITINERARY_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.8,
            max_tokens=8000,
        )

        raw = completion.choices[0].message.content.strip()
        raw = re.sub(r'^```(?:json)?\s*', '', raw)
        raw = re.sub(r'\s*```$', '', raw)
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            logger.warning("JSON truncated, attempting repair...")
            data = repair_json(raw)

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse failed even after repair: {e}")
        return _fallback_itinerary(req)
    except Exception as e:
        logger.error(f"Groq generation failed: {e}")
        return _fallback_itinerary(req)

    # Step 2: Enrich each stop with real nearby data from OpenStreetMap
    used_names: set = set()  # Track used spot names to avoid duplicates across stops
    city_geo = await geocode_city(req.city)

    for day in data.get("days", []):
        for region in day.get("regions", []):
            for stop in region.get("stops", []):
                try:
                    place = stop.get("place", {})
                    lat = place.get("lat")
                    lon = place.get("lon")

                    # If no coordinates, try geocoding the place name (with rate limit)
                    if not lat or not lon:
                        await asyncio.sleep(1.1)  # Nominatim rate limit: 1 req/sec
                        geo = await geocode_place(place.get("name", ""), req.city)
                        if geo:
                            lat, lon = geo["lat"], geo["lon"]

                    # Fallback to city center with offset per stop
                    if not lat or not lon:
                        if city_geo:
                            # Add small random offset based on stop title to spread searches
                            h = int(hashlib.md5(stop.get("title", "").encode()).hexdigest()[:8], 16)
                            lat = city_geo["lat"] + ((h % 100) - 50) * 0.001
                            lon = city_geo["lon"] + ((h % 80) - 40) * 0.001

                    if lat and lon:
                        await asyncio.sleep(0.5)  # Small delay to avoid hammering Overpass
                        osm = await search_nearby_osm(lat, lon, radius=600)
                        # Filter out already-used names
                        for cat in osm:
                            osm[cat] = [x for x in osm[cat] if x["name"].lower() not in used_names]
                        merge_osm_into_stop(stop, osm, used_names)
                except Exception as e:
                    logger.debug(f"OSM enrichment for stop failed: {e}")
                    continue

    # Ensure required fields
    data.setdefault("travel_tips", ["Check local transport options", "Carry cash for small vendors", "Learn basic greetings in the local language"])
    data.setdefault("budget_per_day", req.budgetPerDay)

    return data


# ─── Fallback ───

def _fallback_itinerary(req: ItineraryRequest) -> dict:
    city = req.city or "your destination"
    return {
        "city": city,
        "total_days": req.days,
        "budget_per_day": req.budgetPerDay,
        "overall_authenticity": 93,
        "trip_summary": f"A {req.days}-day deep dive into authentic {city} — region by region, from morning coffee to heritage dinners.",
        "travel_tips": [
            "Use local transit — it's cheaper and more authentic",
            "Carry small bills for street vendors and markets",
            "Ask locals for recommendations, not guidebooks",
            "Wake up early — the best local food sells out by noon"
        ],
        "days": [
            {
                "day_number": d + 1,
                "theme": ["Cultural Heart & Morning Rituals", "Hidden Neighborhoods & Local Markets", "Nature, Views & Farewell Feast"][d % 3],
                "regions": [
                    {
                        "name": f"Central {city}",
                        "description": f"The bustling heart of {city} where history meets daily life.",
                        "region_tip": "Start early to beat the crowds and catch locals at their morning routines.",
                        "stops": [
                            {
                                "time": "09:00", "end_time": "10:30",
                                "title": "Morning coffee & local bakery",
                                "description": "Begin with the city's signature morning ritual — a slow coffee at a beloved neighborhood café paired with a freshly baked local pastry.",
                                "place": {"name": "Local Morning Café", "address": f"Central district, {city}", "description": "Where locals start their day.", "authenticity_score": 88, "category": "cafe", "lat": None, "lon": None, "opening_hours": "7:00-14:00", "tip": "Order what the person in front of you orders"},
                                "nearby_cafes": [
                                    {"name": "Artisan Roasters", "type": "cafe", "description": "Single-origin pour-over specialists.", "walking_distance": "3 min walk", "lat": None, "lon": None}
                                ],
                                "nearby_spots": [
                                    {"name": "Morning Market", "type": "market", "description": "Local produce and flower market.", "walking_distance": "2 min walk", "lat": None, "lon": None}
                                ],
                                "cultural_food": [
                                    {"dish": "Traditional breakfast pastry", "description": "Flaky local specialty with morning coffee.", "where_to_find": "Corner bakeries open before 7am", "cultural_significance": "The most important daily ritual for locals"}
                                ],
                                "emoji": "☕", "cost_estimate": "$3-8"
                            },
                            {
                                "time": "11:00", "end_time": "13:00",
                                "title": "Historic landmark walk",
                                "description": f"Explore the most iconic cultural site in {city}. Wander through centuries of history, art, and architecture.",
                                "place": {"name": "Heritage Cultural Center", "address": f"Old quarter, {city}", "description": "The landmark that defines the city's identity.", "authenticity_score": 92, "category": "attraction", "lat": None, "lon": None, "opening_hours": "9:00-17:00", "tip": "The back entrance has no queue"},
                                "nearby_cafes": [
                                    {"name": "Heritage Tea House", "type": "cafe", "description": "Traditional tea ceremony space.", "walking_distance": "4 min walk", "lat": None, "lon": None}
                                ],
                                "nearby_spots": [
                                    {"name": "City Viewpoint", "type": "viewpoint", "description": "Panoramic views of the old town.", "walking_distance": "6 min walk", "lat": None, "lon": None},
                                    {"name": "Artisan Alley", "type": "shop", "description": "Handmade crafts and local art.", "walking_distance": "3 min walk", "lat": None, "lon": None}
                                ],
                                "cultural_food": [
                                    {"dish": "Street food specialty", "description": "The dish this area invented.", "where_to_find": "Stalls near the landmark gate", "cultural_significance": "Represents centuries of culinary tradition"}
                                ],
                                "emoji": "🏛️", "cost_estimate": "$5-12"
                            }
                        ]
                    }
                ]
            } for d in range(req.days)
        ]
    }
