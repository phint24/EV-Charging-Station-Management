package project.code.model;

import jakarta.persistence.*;
import lombok.*;
// (1) Import Enum mới
import project.code.model.enums.ConnectorType;

import java.util.List;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="vehicle_id", nullable = false, length = 50)
    private String vehicleId;

    @Column(nullable = false, length = 50)
    private String brand;

    @Column(nullable = false, length = 50)
    private String model;

    @Column(name="battery_capacity", nullable = false)
    private double batteryCapacity;

    @Enumerated(EnumType.STRING)
    @Column(name="connector_type", nullable = false, length = 50)
    private ConnectorType connectorType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private EVDriver driver;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<ChargeSession> chargeSessions;
}