package project.code.model;

import jakarta.persistence.*;
import lombok.*;
import project.code.model.enums.ConnectorType;
import project.code.model.enums.ChargingPointStatus;

@Entity
@Table(name = "charging_points")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChargingPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="charging_point_id")
    private Long chargingPointId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id", nullable = false)
    private ChargingStation station;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ConnectorType type;

    @Column(nullable = false)
    private double power;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ChargingPointStatus status;
}