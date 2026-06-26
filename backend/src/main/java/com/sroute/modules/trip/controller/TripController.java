package com.sroute.modules.trip.controller;

import com.sroute.modules.place.entity.Place;
import com.sroute.modules.place.repository.PlaceRepository;
import com.sroute.modules.trip.entity.Itinerary;
import com.sroute.modules.trip.entity.Trip;
import com.sroute.modules.trip.repository.ItineraryRepository;
import com.sroute.modules.trip.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1/trips")
@CrossOrigin(origins = "*")
public class TripController {

    @Value("${app.ai-service.url}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final TripRepository tripRepository;
    private final ItineraryRepository itineraryRepository;
    private final PlaceRepository placeRepository;

    // Keep memory fallback list in case database is down or unconfigured
    private final Map<String, Map<String, Object>> mockTrips = new ConcurrentHashMap<>();

    @Autowired
    public TripController(TripRepository tripRepository, 
                          ItineraryRepository itineraryRepository, 
                          PlaceRepository placeRepository) {
        this.tripRepository = tripRepository;
        this.itineraryRepository = itineraryRepository;
        this.placeRepository = placeRepository;
    }

    @GetMapping
    public ResponseEntity<?> getTrips() {
        try {
            List<Trip> trips = tripRepository.findAll();
            return ResponseEntity.ok(trips);
        } catch (Exception e) {
            System.err.println("Failed to fetch trips from database: " + e.getMessage());
            return ResponseEntity.ok(mockTrips.values());
        }
    }

    @PostMapping
    public ResponseEntity<?> createTrip(@RequestBody Map<String, Object> request) {
        UUID defaultUserUuid = UUID.fromString("00000000-0000-0000-0000-000000000000");

        try {
            Trip trip = Trip.builder()
                    .userId(defaultUserUuid)
                    .title((String) request.getOrDefault("title", "My Authentic Getaway"))
                    .description((String) request.getOrDefault("description", "A travel plan constructed by Sroute."))
                    .startDate(request.containsKey("startDate") && request.get("startDate") != null ? 
                            LocalDate.parse((String) request.get("startDate")) : LocalDate.now())
                    .endDate(request.containsKey("endDate") && request.get("endDate") != null ? 
                            LocalDate.parse((String) request.get("endDate")) : LocalDate.now().plusDays(3))
                    .status("planning")
                    .isPublic(false)
                    .build();

            Trip savedTrip = tripRepository.save(trip);
            return ResponseEntity.ok(savedTrip);
        } catch (Exception e) {
            System.err.println("Failed to write trip to database: " + e.getMessage() + ". Using memory fallback.");
            
            // Memory Fallback
            String tripId = UUID.randomUUID().toString();
            Map<String, Object> tripMap = new HashMap<>();
            tripMap.put("id", tripId);
            tripMap.put("title", request.getOrDefault("title", "My Authentic Getaway"));
            tripMap.put("description", request.getOrDefault("description", "A travel plan constructed by Sroute."));
            tripMap.put("startDate", request.get("startDate"));
            tripMap.put("endDate", request.get("endDate"));
            tripMap.put("status", "planning");
            tripMap.put("createdAt", new Date());

            mockTrips.put(tripId, tripMap);
            return ResponseEntity.ok(tripMap);
        }
    }

    @PostMapping("/{tripId}/generate")
    public ResponseEntity<?> generateItinerary(
            @PathVariable String tripId,
            @RequestBody Map<String, Object> request) {
        
        // Prepare request payload for FastAPI AI Service
        Map<String, Object> payload = new HashMap<>();
        payload.put("tripId", tripId);
        payload.put("city", request.getOrDefault("city", "Tokyo"));
        payload.put("days", request.getOrDefault("days", 3));
        payload.put("budgetPerDay", request.getOrDefault("budgetPerDay", 100.0));
        payload.put("style", request.getOrDefault("style", "cultural"));
        payload.put("preferences", request.getOrDefault("preferences", Collections.emptyList()));

        Map<String, Object> itineraryResult = null;
        try {
            // Forward request to FastAPI Service
            String aiEndpoint = aiServiceUrl + "/api/v1/recommend/generate";
            itineraryResult = restTemplate.postForObject(aiEndpoint, payload, Map.class);
        } catch (Exception e) {
            System.err.println("Failed to reach AI service: " + e.getMessage() + ". Generating fallback local itinerary.");
            itineraryResult = generateFallbackItinerary(tripId, request);
        }

        // Save generated itineraries to database
        if (itineraryResult != null) {
            try {
                saveItineraryToDatabase(tripId, itineraryResult);
            } catch (Exception e) {
                System.err.println("Failed to persist itinerary to database: " + e.getMessage());
            }
        }

        return ResponseEntity.ok(itineraryResult);
    }

    @SuppressWarnings("unchecked")
    private void saveItineraryToDatabase(String tripIdStr, Map<String, Object> itineraryResult) {
        UUID tripId = UUID.fromString(tripIdStr);
        
        // Clear any old itineraries for this trip first
        itineraryRepository.deleteByTripId(tripId);

        List<Map<String, Object>> days = (List<Map<String, Object>>) itineraryResult.get("days");
        if (days == null) return;

        for (Map<String, Object> day : days) {
            Integer dayNumber = (Integer) day.get("dayNumber");
            List<Map<String, Object>> items = (List<Map<String, Object>>) day.get("items");
            if (items == null) continue;

            for (Map<String, Object> item : items) {
                Integer position = (Integer) item.get("position");
                String itemTitle = (String) item.get("title");
                String itemNotes = (String) item.get("notes");
                String startTimeStr = (String) item.get("startTime");
                String endTimeStr = (String) item.get("endTime");
                String itemType = (String) item.get("type");

                Map<String, Object> placeMap = (Map<String, Object>) item.get("place");
                UUID placeId = null;

                if (placeMap != null) {
                    String placeName = (String) placeMap.get("name");
                    List<Place> existingPlaces = placeRepository.findByName(placeName);
                    
                    if (!existingPlaces.isEmpty()) {
                        placeId = existingPlaces.get(0).getId();
                    } else {
                        // Create Place dynamic entry in DB — use city/country from place data
                        String placeCity = (String) placeMap.getOrDefault("city", "Unknown");
                        String placeCountry = (String) placeMap.getOrDefault("country", "Unknown");
                        
                        Place newPlace = Place.builder()
                                .name(placeName)
                                .category((String) placeMap.getOrDefault("category", "restaurant"))
                                .address((String) placeMap.get("address"))
                                .city(placeCity)
                                .country(placeCountry)
                                .averageRating(4.0)
                                .reviewCount(1)
                                .description((String) placeMap.get("description"))
                                .build();
                        
                        Place savedPlace = placeRepository.save(newPlace);
                        placeId = savedPlace.getId();
                    }
                }

                // Format times
                LocalTime startTime = startTimeStr != null ? LocalTime.parse(startTimeStr, DateTimeFormatter.ofPattern("HH:mm:ss")) : LocalTime.of(9, 0);
                LocalTime endTime = endTimeStr != null ? LocalTime.parse(endTimeStr, DateTimeFormatter.ofPattern("HH:mm:ss")) : LocalTime.of(10, 0);

                Itinerary itinerary = Itinerary.builder()
                        .tripId(tripId)
                        .placeId(placeId)
                        .dayNumber(dayNumber)
                        .position(position)
                        .title(itemTitle)
                        .notes(itemNotes)
                        .startTime(startTime)
                        .endTime(endTime)
                        .type(itemType)
                        .build();

                itineraryRepository.save(itinerary);
            }
        }
    }

    private Map<String, Object> generateFallbackItinerary(String tripId, Map<String, Object> request) {
        String city = (String) request.getOrDefault("city", "your destination");
        int days = (Integer) request.getOrDefault("days", 3);

        Map<String, Object> response = new HashMap<>();
        response.put("tripId", tripId);

        List<Map<String, Object>> daysList = new ArrayList<>();
        for (int i = 1; i <= days; i++) {
            Map<String, Object> dayMap = new HashMap<>();
            dayMap.put("dayNumber", i);

            List<Map<String, Object>> items = new ArrayList<>();

            // Item 1: Morning Café
            Map<String, Object> cafe = new HashMap<>();
            cafe.put("position", 0);
            cafe.put("title", "Morning coffee at a local café in " + city);
            cafe.put("notes", "Find a neighborhood café away from tourist areas. Ask locals for their favorite morning spot.");
            cafe.put("startTime", "09:00:00");
            cafe.put("endTime", "10:00:00");
            cafe.put("type", "meal");

            Map<String, Object> cafePlace = new HashMap<>();
            cafePlace.put("name", "Local Café in " + city);
            cafePlace.put("category", "cafe");
            cafePlace.put("address", city);
            cafePlace.put("city", city);
            cafePlace.put("country", "");
            cafePlace.put("latitude", 0.0);
            cafePlace.put("longitude", 0.0);
            cafePlace.put("authenticity_score", 85.0);
            cafePlace.put("description", "A neighborhood café in " + city + " frequented by locals.");
            cafe.put("place", cafePlace);
            items.add(cafe);

            // Item 2: Cultural Attraction
            Map<String, Object> attraction = new HashMap<>();
            attraction.put("position", 1);
            attraction.put("title", "Explore a cultural landmark in " + city);
            attraction.put("notes", "Visit a historic or cultural site. Avoid the most crowded tourist spots and seek out lesser-known gems.");
            attraction.put("startTime", "10:30:00");
            attraction.put("endTime", "12:30:00");
            attraction.put("type", "visit");

            Map<String, Object> attrPlace = new HashMap<>();
            attrPlace.put("name", "Cultural Landmark in " + city);
            attrPlace.put("category", "attraction");
            attrPlace.put("address", city);
            attrPlace.put("city", city);
            attrPlace.put("country", "");
            attrPlace.put("latitude", 0.0);
            attrPlace.put("longitude", 0.0);
            attrPlace.put("authenticity_score", 90.0);
            attrPlace.put("description", "A historic or cultural site in " + city + " with local significance.");
            attraction.put("place", attrPlace);
            items.add(attraction);

            // Item 3: Local Dinner
            Map<String, Object> dinner = new HashMap<>();
            dinner.put("position", 2);
            dinner.put("title", "Dinner at a local restaurant in " + city);
            dinner.put("notes", "Seek out a family-run restaurant serving traditional local cuisine. Look for places packed with locals, not tourists.");
            dinner.put("startTime", "18:00:00");
            dinner.put("endTime", "19:30:00");
            dinner.put("type", "meal");

            Map<String, Object> dinnerPlace = new HashMap<>();
            dinnerPlace.put("name", "Local Restaurant in " + city);
            dinnerPlace.put("category", "restaurant");
            dinnerPlace.put("address", city);
            dinnerPlace.put("city", city);
            dinnerPlace.put("country", "");
            dinnerPlace.put("latitude", 0.0);
            dinnerPlace.put("longitude", 0.0);
            dinnerPlace.put("authenticity_score", 92.0);
            dinnerPlace.put("description", "A family-run restaurant in " + city + " serving authentic local cuisine.");
            dinner.put("place", dinnerPlace);
            items.add(dinner);

            dayMap.put("items", items);
            daysList.add(dayMap);
        }
        response.put("days", daysList);
        return response;
    }
}
