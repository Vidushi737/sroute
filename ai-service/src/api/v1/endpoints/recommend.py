# Itinerary Generation & Recommendation Router
# Supports ANY city worldwide — AI generates real places, fallback uses city-aware templates

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import os
import json
import logging
from typing import Optional, List
from src.core.config import settings

logger = logging.getLogger("sroute-recommend")
router = APIRouter()

class PlaceMock(BaseModel):
    name: str
    category: str
    address: str
    latitude: float
    longitude: float
    authenticity_score: float
    description: str
    city: Optional[str] = None
    country: Optional[str] = None

class ItineraryItem(BaseModel):
    position: int
    title: str
    notes: str
    startTime: str
    endTime: str
    type: str
    place: PlaceMock

class DayItinerary(BaseModel):
    dayNumber: int
    items: List[ItineraryItem]

class ItineraryResponse(BaseModel):
    tripId: str
    days: List[DayItinerary]

class ItineraryRequest(BaseModel):
    tripId: str
    city: str
    days: int
    budgetPerDay: float
    style: str
    preferences: Optional[List[str]] = []

# City-specific place pools for high-fidelity fallback when AI is unavailable
CITY_POOLS = {
    "tokyo": {
        "country": "Japan",
        "places": [
            {"name": "Ramen Haruka", "category": "restaurant", "address": "1 Chome-3-10 Sotokanda, Chiyoda City, Tokyo", "latitude": 35.6984, "longitude": 139.7714, "authenticity_score": 96.4, "description": "Family-run basement ramen counter serving thick, traditional tonkotsu broth."},
            {"name": "Nezu Shrine Garden", "category": "attraction", "address": "1 Chome-28-9 Nezu, Bunkyo City, Tokyo", "latitude": 35.7202, "longitude": 139.7607, "authenticity_score": 94.8, "description": "Historical shrine with quiet tunnels of red Torii gates away from tourist hubs."},
            {"name": "Café de L'Ambre", "category": "cafe", "address": "8 Chome-10-15 Ginza, Chuo City, Tokyo", "latitude": 35.6698, "longitude": 139.7632, "authenticity_score": 98.1, "description": "A quiet temple of single-origin aged coffees roasting beans since 1948."},
            {"name": "Sushi Kanesaka", "category": "restaurant", "address": "8 Chome-10-3 Ginza, Chuo City, Tokyo", "latitude": 35.6702, "longitude": 139.7618, "authenticity_score": 88.2, "description": "Elegant traditional Edo-mae sushi with ingredients fresh from Toyosu market."},
            {"name": "Ryokan Kamogawa Asakusa", "category": "hotel", "address": "1 Chome-29-8 Asakusa, Taito City, Tokyo", "latitude": 35.7118, "longitude": 139.7958, "authenticity_score": 86.5, "description": "Family operated Ryokan with hot communal baths and tatami mats."},
        ]
    },
    "paris": {
        "country": "France",
        "places": [
            {"name": "Le Baratin", "category": "restaurant", "address": "3 Rue Jouye-Rouve, 75020 Paris", "latitude": 48.8717, "longitude": 2.3883, "authenticity_score": 95.3, "description": "Beloved neighborhood bistro in Belleville with daily handwritten menu and natural wines."},
            {"name": "Musée de la Chasse et de la Nature", "category": "attraction", "address": "62 Rue des Archives, 75003 Paris", "latitude": 48.8614, "longitude": 2.3578, "authenticity_score": 93.7, "description": "Quirky, offbeat museum in Le Marais with artistic taxidermy and contemporary art."},
            {"name": "Boot Café", "category": "cafe", "address": "19 Rue du Pont aux Choux, 75003 Paris", "latitude": 48.8634, "longitude": 2.3654, "authenticity_score": 91.2, "description": "Tiny standing-room-only specialty coffee bar in a former cobbler's shop."},
            {"name": "Parc des Buttes-Chaumont", "category": "attraction", "address": "1 Rue Botzaris, 75019 Paris", "latitude": 48.8809, "longitude": 2.3822, "authenticity_score": 97.1, "description": "Sprawling hilly park with waterfalls, a suspended bridge, and stunning hilltop views."},
        ]
    },
    "new york": {
        "country": "USA",
        "places": [
            {"name": "Di Fara Pizza", "category": "restaurant", "address": "1424 Avenue J, Brooklyn, NY 11230", "latitude": 40.6250, "longitude": -73.9613, "authenticity_score": 94.5, "description": "Legendary Brooklyn pizzeria where Dom DeMarco hand-makes every pie. Cash only."},
            {"name": "The Cloisters", "category": "attraction", "address": "99 Margaret Corbin Dr, New York, NY 10040", "latitude": 40.8649, "longitude": -73.9319, "authenticity_score": 96.8, "description": "Medieval European monastery reassembled in Fort Tryon Park with unicorn tapestries."},
            {"name": "Russ & Daughters", "category": "restaurant", "address": "179 E Houston St, New York, NY 10002", "latitude": 40.7225, "longitude": -73.9882, "authenticity_score": 95.2, "description": "Iconic Lower East Side appetizing shop since 1914. Hand-sliced smoked salmon and bagels."},
            {"name": "Green-Wood Cemetery", "category": "attraction", "address": "500 25th St, Brooklyn, NY 11232", "latitude": 40.6582, "longitude": -73.9903, "authenticity_score": 97.5, "description": "478-acre National Historic Landmark with rolling hills and Gothic architecture."},
        ]
    },
    "barcelona": {
        "country": "Spain",
        "places": [
            {"name": "Cal Pep", "category": "restaurant", "address": "Plaça de les Olles, 8, 08003 Barcelona", "latitude": 41.3835, "longitude": 2.1819, "authenticity_score": 92.8, "description": "Legendary tapas counter bar with explosive Catalan seafood. No reservations at the bar."},
            {"name": "Bunkers del Carmel", "category": "attraction", "address": "Carrer de Marià Labèrnia, s/n, 08032 Barcelona", "latitude": 41.4189, "longitude": 2.1617, "authenticity_score": 96.5, "description": "Civil War bunkers atop a hill with 360° panoramic views of the city. A true local secret."},
            {"name": "Satan's Coffee Corner", "category": "cafe", "address": "Carrer de l'Arc de Sant Ramon del Call, 11, 08002 Barcelona", "latitude": 41.3852, "longitude": 2.1813, "authenticity_score": 90.4, "description": "Minimalist specialty coffee with no Wi-Fi by design and a rebellious local vibe."},
        ]
    },
    "bali": {
        "country": "Indonesia",
        "places": [
            {"name": "Warung Babi Guling Ibu Oka", "category": "restaurant", "address": "Jl. Tegal Sari No.2, Ubud, Gianyar, Bali", "latitude": -8.5069, "longitude": 115.2635, "authenticity_score": 93.6, "description": "Anthony Bourdain's favorite Balinese roast suckling pig warung. Sells out daily by 2pm."},
            {"name": "Tirta Empul Temple", "category": "attraction", "address": "Jl. Tirta, Manukaya, Tampaksiring, Gianyar, Bali", "latitude": -8.4153, "longitude": 115.3155, "authenticity_score": 89.2, "description": "Sacred Hindu water temple where locals perform purification rituals in spring pools."},
            {"name": "Seniman Coffee Studio", "category": "cafe", "address": "Jl. Sriwedari No.5, Ubud, Gianyar, Bali", "latitude": -8.5046, "longitude": 115.2614, "authenticity_score": 91.5, "description": "Artisan coffee roastery sourcing exclusively from Indonesian smallholder farms."},
        ]
    },
    "istanbul": {
        "country": "Turkey",
        "places": [
            {"name": "Çiya Sofrası", "category": "restaurant", "address": "Güneşli Bahçe Sk. No:43, 34710 Kadıköy/İstanbul", "latitude": 40.9903, "longitude": 29.0270, "authenticity_score": 95.7, "description": "Legendary restaurant preserving vanishing Anatolian recipes. Featured in Netflix Chef's Table."},
            {"name": "Chora Church (Kariye Museum)", "category": "attraction", "address": "Kariye Cami Sk. No:18, 34087 Fatih/İstanbul", "latitude": 41.0318, "longitude": 28.9394, "authenticity_score": 97.3, "description": "4th-century Byzantine church with the finest surviving medieval mosaics in the world."},
            {"name": "Mandabatmaz", "category": "cafe", "address": "Olivia Geçidi No:1, 34430 Beyoğlu/İstanbul", "latitude": 41.0338, "longitude": 28.9752, "authenticity_score": 94.1, "description": "Tiny sidewalk café famous for what many consider the best Turkish coffee in Istanbul."},
        ]
    },
}


def get_city_pool(city_name: str):
    """Find the best matching city pool, or return None for AI-only generation."""
    city_lower = city_name.lower().strip()
    # Try exact match first
    if city_lower in CITY_POOLS:
        return CITY_POOLS[city_lower]
    # Try partial match
    for key in CITY_POOLS:
        if key in city_lower or city_lower in key:
            return CITY_POOLS[key]
    return None


@router.post("/generate", response_model=ItineraryResponse)
async def generate_itinerary(req: ItineraryRequest):
    # Try calling Groq API if available
    api_key = settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY")
    
    if api_key:
        try:
            from groq import Groq
            client = Groq(api_key=api_key)
            
            prompt = f"""
            You are Sroute, an expert AI Travel Planner specializing in authentic, local-first experiences.
            Generate a detailed day-by-day travel itinerary for:
            City: {req.city}
            Days: {req.days}
            Budget: ${req.budgetPerDay} per day
            Style: {req.style}
            Preferences: {', '.join(req.preferences or [])}
            
            IMPORTANT: Generate REAL places that actually exist in {req.city}. Focus on authentic, 
            local-first spots that tourists rarely find. Avoid well-known tourist traps.
            Include the actual city name and country in each place.
            
            Format your response strictly as JSON matching this model structure:
            {{
                "tripId": "{req.tripId}",
                "days": [
                    {{
                        "dayNumber": 1,
                        "items": [
                            {{
                                "position": 0,
                                "title": "Activity name",
                                "notes": "Authentic tip or local guidance",
                                "startTime": "08:30:00",
                                "endTime": "09:30:00",
                                "type": "meal|visit|transit|accommodation|activity",
                                "place": {{
                                    "name": "Place name",
                                    "category": "restaurant|hotel|attraction|cafe|bar|museum|park|shopping",
                                    "address": "Physical street address",
                                    "latitude": 35.XXXX,
                                    "longitude": 139.XXXX,
                                    "authenticity_score": 92.5,
                                    "description": "Why this place is authentic and not a tourist trap",
                                    "city": "{req.city}",
                                    "country": "Country name"
                                }}
                            }}
                        ]
                    }}
                ]
            }}
            Make sure itineraries are logically paced, include authentic places in {req.city}, and respect the budget. Return ONLY JSON.
            """
            
            completion = client.chat.completions.create(
                model=settings.LLM_MODEL,
                messages=[
                    {"role": "system", "content": "You are a professional travel planner API that returns strictly valid JSON. You specialize in finding authentic, local-first experiences in any city worldwide."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            response_data = json.loads(completion.choices[0].message.content)
            return response_data
            
        except Exception as e:
            logger.error(f"Failed to generate itinerary with Groq API: {e}. Falling back to template planner.")
            
    # Fallback Template Planner — city-aware
    city_pool = get_city_pool(req.city)
    days_list = []
    
    if city_pool:
        # Use known city pool data
        places = city_pool["places"]
        country = city_pool["country"]
        
        for i in range(1, req.days + 1):
            day_items = []
            
            # Select places cyclically to vary across days
            cafe_candidates = [p for p in places if p["category"] in ("cafe",)]
            restaurant_candidates = [p for p in places if p["category"] in ("restaurant",)]
            attraction_candidates = [p for p in places if p["category"] in ("attraction", "museum", "park")]
            
            # Breakfast / cafe
            if cafe_candidates:
                cafe = cafe_candidates[(i - 1) % len(cafe_candidates)]
            elif restaurant_candidates:
                cafe = restaurant_candidates[0]
            else:
                cafe = places[0]
                
            day_items.append(ItineraryItem(
                position=0,
                title=f"Breakfast at {cafe['name']}",
                notes=f"Start your day at this authentic local spot in {req.city}.",
                startTime="09:00:00",
                endTime="10:00:00",
                type="meal",
                place=PlaceMock(
                    name=cafe['name'], category=cafe['category'], address=cafe['address'],
                    latitude=cafe['latitude'], longitude=cafe['longitude'],
                    authenticity_score=cafe['authenticity_score'], description=cafe['description'],
                    city=req.city, country=country
                )
            ))
            
            # Attraction
            if attraction_candidates:
                attr = attraction_candidates[(i - 1) % len(attraction_candidates)]
            else:
                attr = places[(i) % len(places)]
                
            day_items.append(ItineraryItem(
                position=1,
                title=f"Explore {attr['name']}",
                notes=f"A local favorite in {req.city}. Best experienced in the morning.",
                startTime="10:30:00",
                endTime="12:30:00",
                type="visit",
                place=PlaceMock(
                    name=attr['name'], category=attr['category'], address=attr['address'],
                    latitude=attr['latitude'], longitude=attr['longitude'],
                    authenticity_score=attr['authenticity_score'], description=attr['description'],
                    city=req.city, country=country
                )
            ))
            
            # Lunch / dinner restaurant
            if restaurant_candidates:
                rest = restaurant_candidates[(i - 1) % len(restaurant_candidates)]
            else:
                rest = places[-1]
                
            day_items.append(ItineraryItem(
                position=2,
                title=f"Lunch at {rest['name']}",
                notes=f"A beloved local restaurant in {req.city}. Come hungry.",
                startTime="13:00:00",
                endTime="14:00:00",
                type="meal",
                place=PlaceMock(
                    name=rest['name'], category=rest['category'], address=rest['address'],
                    latitude=rest['latitude'], longitude=rest['longitude'],
                    authenticity_score=rest['authenticity_score'], description=rest['description'],
                    city=req.city, country=country
                )
            ))
            
            days_list.append(DayItinerary(dayNumber=i, items=day_items))
    else:
        # Generic fallback for cities not in our pool — still city-aware
        for i in range(1, req.days + 1):
            day_items = []
            
            day_items.append(ItineraryItem(
                position=0,
                title=f"Morning coffee at a local café in {req.city}",
                notes=f"Find a neighborhood café in {req.city} away from tourist areas. Ask locals for their favorite morning spot.",
                startTime="09:00:00",
                endTime="10:00:00",
                type="meal",
                place=PlaceMock(
                    name=f"Local Café in {req.city}", category="cafe", address=req.city,
                    latitude=0.0, longitude=0.0, authenticity_score=85.0,
                    description=f"A neighborhood café in {req.city} frequented by locals.",
                    city=req.city, country=""
                )
            ))
            
            day_items.append(ItineraryItem(
                position=1,
                title=f"Explore a cultural landmark in {req.city}",
                notes=f"Visit a historic or cultural site in {req.city}. Seek out lesser-known gems over crowded attractions.",
                startTime="10:30:00",
                endTime="12:30:00",
                type="visit",
                place=PlaceMock(
                    name=f"Cultural Landmark in {req.city}", category="attraction", address=req.city,
                    latitude=0.0, longitude=0.0, authenticity_score=90.0,
                    description=f"A historic or cultural site in {req.city} with local significance.",
                    city=req.city, country=""
                )
            ))
            
            day_items.append(ItineraryItem(
                position=2,
                title=f"Dinner at a local restaurant in {req.city}",
                notes=f"Seek out a family-run restaurant in {req.city} serving traditional local cuisine.",
                startTime="18:00:00",
                endTime="19:30:00",
                type="meal",
                place=PlaceMock(
                    name=f"Local Restaurant in {req.city}", category="restaurant", address=req.city,
                    latitude=0.0, longitude=0.0, authenticity_score=92.0,
                    description=f"A family-run restaurant in {req.city} serving authentic local cuisine.",
                    city=req.city, country=""
                )
            ))
            
            days_list.append(DayItinerary(dayNumber=i, items=day_items))
        
    return ItineraryResponse(tripId=req.tripId, days=days_list)
