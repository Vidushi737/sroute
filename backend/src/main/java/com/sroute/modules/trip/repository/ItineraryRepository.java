package com.sroute.modules.trip.repository;

import com.sroute.modules.trip.entity.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, UUID> {
    List<Itinerary> findByTripIdOrderByDayNumberAscPositionAsc(UUID tripId);
    void deleteByTripId(UUID tripId);
}
