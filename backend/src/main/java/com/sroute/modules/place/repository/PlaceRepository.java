package com.sroute.modules.place.repository;

import com.sroute.modules.place.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlaceRepository extends JpaRepository<Place, UUID> {

    @Query(value = "SELECT p.id as id, p.name as name, p.description as description, " +
            "CAST(p.category AS text) as category, p.address as address, p.city as city, " +
            "p.country as country, p.phone as phone, p.website as website, " +
            "p.price_level as priceLevel, p.opening_hours as openingHours, " +
            "p.average_rating as averageRating, p.review_count as reviewCount, " +
            "p.metadata as metadata, " +
            "ST_Y(p.location::geometry) as latitude, " +
            "ST_X(p.location::geometry) as longitude, " +
            "coalesce(a.overall_score, 0.0) as authenticityScore, " +
            "ST_Distance(p.location, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography) as distanceMeters " +
            "FROM places p " +
            "LEFT JOIN authenticity_scores a ON p.id = a.place_id " +
            "WHERE ST_DWithin(p.location, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, :radiusMeters) " +
            "AND (:category IS NULL OR p.category = CAST(:category AS place_category)) " +
            "AND (a.overall_score >= :minAuthenticity) " +
            "ORDER BY distanceMeters ASC", nativeQuery = true)
    List<PlaceSearchResult> searchPlacesNative(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radiusMeters") double radiusMeters,
            @Param("category") String category,
            @Param("minAuthenticity") double minAuthenticity
    );

    @Query("SELECT p FROM Place p WHERE p.name = :name")
    List<Place> findByName(@Param("name") String name);
}
