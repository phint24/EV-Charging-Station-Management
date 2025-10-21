package project.code.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;


@Entity
@Table(name = "chargeSessions")
@Data
@Builder
public class ChargeSession {
     @Id
     @Column(name= "session_id")
     private String sessionId;

     @Column(name="station_id", nullable = false)
     private String stationId;

     @Column(name= "charging_point_id", nullable = false)
     private String chargingPointId;

     @Column(name="start_time", length = 100)
     private LocalDateTime startTime;

     @Column(name="end_time", length = 100)
     private LocalDateTime endTime;
     @Column(name="energy_used", length = 100)
     private double energyUsed;
     @Column(length = 100)
     private double cost;

     @Column(length = 100)
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
