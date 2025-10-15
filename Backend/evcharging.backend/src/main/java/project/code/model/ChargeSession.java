package project.code.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "chargeSessions")
@Data
@Builder
public class ChargeSession {
     @Id
     private String sessionId;

     @Column(nullable = false)
     private String stationId;

     @Column(nullable = false)
     private String chargingPointId;
     private LocalDateTime startTime;
     private LocalDateTime endTime;
     private double energyUsed;
     private double cost;

     @Column(length = 50)
     private String status;

    // Constructors
    public ChargeSession() {}

    public ChargeSession(
        String sessionId, String stationId, String chargingPointId,
        LocalDateTime startTime, LocalDateTime endTime,
        double energyUsed, double cost, String status) {
        this.sessionId = sessionId;
        this.stationId = stationId;
        this.chargingPointId = chargingPointId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.energyUsed = energyUsed;
        this.cost = cost;
        this.status = status;
    }
    // End Constructors

    // Methods
    public void startSession(String driverId, String chargeId) {
        System.out.println("Phiên sạc được bắt đầu bởi tài xế: " + driverId + " sử dụng trạm sạc: " + chargeId);
    }

    public void endSession() {
        System.out.println("Phiên sạc đã kết thúc.");
    }

    public double calculateCost(double ratePerKWh) {
        return this.energyUsed * ratePerKWh;
    }
    // End Methods

    // Các Hàm Getters - Setters
    public String getSessionId() {
         return sessionId; 
    }
    public void setSessionId(String sessionId) { 
        this.sessionId = sessionId; 
    }

    public String getStationId() {
         return stationId; 
    }
    public void setStationId(String stationId) {
         this.stationId = stationId;
    }

    public String getChargingPointId() {
         return chargingPointId; 
    }
    public void setChargingPointId(String chargingPointId) {
         this.chargingPointId = chargingPointId; 
    }

    public LocalDateTime getStartTime() {
         return startTime; 
    }
    public void setStartTime(LocalDateTime startTime) {
         this.startTime = startTime; 
    }

    public LocalDateTime getEndTime() {
         return endTime; 
    }
    public void setEndTime(LocalDateTime endTime) {
         this.endTime = endTime; 
    }

    public double getEnergyUsed() {
         return energyUsed; 
    }
    public void setEnergyUsed(double energyUsed) {
         this.energyUsed = energyUsed; 
    }

    public double getCost() {
         return cost; 
    }
    public void setCost(double cost) {
         this.cost = cost; 
    }

    public String getStatus() {
         return status; 
    }
    public void setStatus(String status) {
         this.status = status; 
    }
    // End Các Hàm Getters - Setters
}
