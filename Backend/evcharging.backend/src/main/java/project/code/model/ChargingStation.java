package project.code.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "charging_stations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChargingStation {

    public enum StationStatus {
        AVAILABLE,
        IN_USE,
        OFFLINE,
        FAULTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="station_id")
    private Long stationId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private String location;


    @Enumerated(EnumType.STRING)
    @Column(length = 100, nullable = false)
    private StationStatus status;

    @Column(name="total_charging_point")
    private int totalChargingPoint;

    @Column(name="available_chargers")
    private int availableChargers;

    @OneToMany(mappedBy = "station", cascade = CascadeType.ALL)
    @JsonIgnore  // ← THÊM DÒNG NÀY ĐỂ NGĂN VÒNG LẶP
    private List<ChargingPoint> chargingPoints;
}