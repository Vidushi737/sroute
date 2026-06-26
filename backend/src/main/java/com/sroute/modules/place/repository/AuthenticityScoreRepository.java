package com.sroute.modules.place.repository;

import com.sroute.modules.place.entity.AuthenticityScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthenticityScoreRepository extends JpaRepository<AuthenticityScore, UUID> {
    Optional<AuthenticityScore> findByPlaceId(UUID placeId);
}
