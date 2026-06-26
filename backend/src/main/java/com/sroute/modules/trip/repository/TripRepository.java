package com.sroute.modules.trip.repository;

import com.sroute.modules.trip.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TripRepository extends JpaRepository<Trip, UUID> {
    List<Trip> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
