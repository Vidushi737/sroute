package com.sroute.modules.place.repository;

import java.util.UUID;

public interface PlaceSearchResult {
    UUID getId();
    String getName();
    String getDescription();
    String getCategory();
    String getAddress();
    String getCity();
    String getCountry();
    String getPhone();
    String getWebsite();
    Integer getPriceLevel();
    String getOpeningHours();
    Double getAverageRating();
    Integer getReviewCount();
    String getMetadata();
    Double getLatitude();
    Double getLongitude();
    Double getAuthenticityScore();
    Double getDistanceMeters();
}
