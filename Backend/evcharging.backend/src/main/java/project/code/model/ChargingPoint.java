package project.code.model;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "chargingPoints")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChargingPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String chargingPointId;

    @Column(nullable = false, length = 50)
    private String type;
    private double power;

    @Column(length = 50)
    private String status;

    // Constructors
    public ChargingPoint() {}

    public ChargingPoint(String chargingPointId, String type, double power, String status) {
        this.chargingPointId = chargingPointId;
        this.type = type;
        this.power = power;
        this.status = status;
    }
    // End Constructors

    // Methods
    public void startCharging(String sessionId) {
        System.out.println("Bắt đầu sạc cho phiên: " + sessionId);
    }

    public void stopCharging() {
        System.out.println("Đã dừng sạc");
    }

    public void updateStatus(String newStatus) {
        this.status = newStatus;
    }

    // public boolean isAvailable() {
    //     return this.status.equalsIgnoreCase("available");
    // }
    public boolean isAvailable() {
        return "available".equalsIgnoreCase(status);
    }
    // End Methods


    // Các Hàm Getters - Setters
    public String getChargingPointId() { 
        return chargingPointId; 
    }
    public void setChargingPointId(String chargingPointId) {
         this.chargingPointId = chargingPointId; 
    }

    public String getType() {
         return type;
    }
    public void setType(String type) {
         this.type = type; 
    }

    public double getPower() {
         return power; 
    }
    public void setPower(double power) {
         this.power = power; 
    }

    public String getStatus() {
         return status; 
    }
    public void setStatus(String status) {
         this.status = status; 
    }
    // End Các Hàm Getters - Setters
}
