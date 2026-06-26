package com.sroute.modules.place.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "authenticity_scores", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticityScore {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", nullable = false, unique = true)
    private Place place;

    @Column(name = "overall_score")
    private Double overallScore;

    @Column(name = "local_ratio")
    private Double localRatio;

    @Column(name = "sentiment_score")
    private Double sentimentScore;

    @Column(name = "price_anomaly_score")
    private Double priceAnomalyScore;

    @Column(name = "repeat_visitor_ratio")
    private Double repeatVisitorRatio;

    @Column(name = "last_calculated_at", insertable = false, updatable = false)
    private LocalDateTime lastCalculatedAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
