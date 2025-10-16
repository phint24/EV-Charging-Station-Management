package project.code.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "vehicle")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50) private String vehicleId;
    @Column(nullable = false, length = 50) private String ownerId; // liên kết tới EVDriver (driverId)
    @Column(nullable = false, length = 50) private String brand;
    @Column(nullable = false, length = 50) private String model;
    @Column(nullable = false) private double batteryCapacity;
    @Column(nullable = false, length = 50) private String connectorType;

    // Một xe thuộc về 1 tài xế
    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private EVDriver driver;

    // Một xe có thể có nhiều phiên sạc
    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<ChargeSession> chargeSessions;

    // ===== CONSTRUCTORS =====
    public Vehicle() {}

    public Vehicle(String vehicleId, String ownerId, String brand, String model,
                   double batteryCapacity, String connectorType, EVDriver driver) {
        this.vehicleId = vehicleId;
        this.ownerId = ownerId;
        this.brand = brand;
        this.model = model;
        this.batteryCapacity = batteryCapacity;
        this.connectorType = connectorType;
        this.driver = driver;
    }

    // ===== GETTERS & SETTERS =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }

    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public double getBatteryCapacity() { return batteryCapacity; }
    public void setBatteryCapacity(double batteryCapacity) { this.batteryCapacity = batteryCapacity; }

    public String getConnectorType() { return connectorType; }
    public void setConnectorType(String connectorType) { this.connectorType = connectorType; }

    public EVDriver getDriver() { return driver; }
    public void setDriver(EVDriver driver) { this.driver = driver; }

    public List<ChargeSession> getChargeSessions() { return chargeSessions; }
    public void setChargeSessions(List<ChargeSession> chargeSessions) { this.chargeSessions = chargeSessions; }

    // ===== BEHAVIOR METHODS =====
    public void registerVehicle() {
        System.out.println("Xe " + vehicleId + " của tài xế " + driver.getName() + " đã được đăng ký thành công.");
    }

    public void updateVehicleInfo(String newBrand, String newModel) {
        this.brand = newBrand;
        this.model = newModel;
        System.out.println("Thông tin xe " + vehicleId + " đã được cập nhật.");
    }
}
