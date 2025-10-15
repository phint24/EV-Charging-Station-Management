package project.code.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chargingStations")
@Data
@Builder
public class ChargingStation {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private String stationId;

     @Column(nullable = false, length = 100)
     private String name;

     @Column(nullable = false)
     private String location;

     @Column(length = 50)
     private String status;
     private int totalChargingPoint;
     private int availableChargers;

    // Constructors
    public ChargingStation() {}

    public ChargingStation(
        String stationId, String name, String location, String status,
        int totalChargingPoint, int availableChargers) {
        this.stationId = stationId;
        this.name = name;
        this.location = location;
        this.status = status;
        this.totalChargingPoint = totalChargingPoint;
        this.availableChargers = availableChargers;
    }
    // End Constructors

    // Methods
    public void updateStatus(String newStatus) {
        this.status = newStatus;
    }

    public Report chargeReport(String period) {
          System.out.println("Đang tạo báo cáo sạc cho giai đoạn: " + period);
          Report report = new Report();
          report.setReportType("Charging Usage Report");
          report.setPeriodStart(LocalDateTime.now().minusDays(7));  
          report.setPeriodEnd(LocalDateTime.now());                
          report.setStationId(this.stationId);                  
          System.out.println("Báo cáo được tạo cho trạm: " + this.name + " - Mã: " + this.stationId);
          return report;
     }
    // // Methods

    // Các Hàm Getters - Setters
    public String getStationId() {
         return stationId; 
    }
    public void setStationId(String stationId) {
        this.stationId = stationId; 
    }

    public String getName() {
         return name; 
    }
    public void setName(String name) {
         this.name = name; 
    }

    public String getLocation() {
         return location; 
    }
    public void setLocation(String location) {
         this.location = location; 
    }

    public String getStatus() {
         return status; 
    }
    public void setStatus(String status) {
         this.status = status; 
    }

    public int getTotalChargingPoint() {
         return totalChargingPoint; 
        
    }
    public void setTotalChargingPoint(int totalChargingPoint) {
         this.totalChargingPoint = totalChargingPoint; 
    }

    public int getAvailableChargers() {
         return availableChargers;
    }
    public void setAvailableChargers(int availableChargers) {
         this.availableChargers = availableChargers; 
    }
    // End Các Hàm Getters - Setters
}
