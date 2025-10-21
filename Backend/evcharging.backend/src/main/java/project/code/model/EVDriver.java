package project.code.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "evDriver")
public class
EVDriver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="driver_id", nullable = false, length = 50) private String driverId;
    @Column(nullable = false, length = 100) private String name;
    @Column(nullable = false, length = 100) private String email;
    @Column(name="phone_number",nullable = false, length = 11) private String phoneNumber;
    @Column(nullable = false) private String password;
    @Column(nullable = false, length = 100) private String vehicle;
    @Column(nullable = false) private String wallet;

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL)
    private List<Vehicle> vehicles;

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL)
    private List<ChargeSession> chargeSessions;

    @ManyToOne
    @JoinColumn(name = "package_id")
    private SubscriptionPackage subscriptionPackage;

    // ===== CONSTRUCTORS =====
    public EVDriver() {}

    public EVDriver(Long id, String driverId, String name, String email, String phoneNumber,
                    String password, String vehicle, String wallet) {
        this.id = id;
        this.driverId = driverId;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.vehicle = vehicle;
        this.wallet = wallet;
    }

    // ===== GETTERS & SETTERS =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getVehicle() { return vehicle; }
    public void setVehicle(String vehicle) { this.vehicle = vehicle; }

    public String getWallet() { return wallet; }
    public void setWallet(String wallet) { this.wallet = wallet; }

    public List<Vehicle> getVehicles() { return vehicles; }
    public void setVehicles(List<Vehicle> vehicles) { this.vehicles = vehicles; }

    public List<ChargeSession> getChargeSessions() { return chargeSessions; }
    public void setChargeSessions(List<ChargeSession> chargeSessions) { this.chargeSessions = chargeSessions; }

    public SubscriptionPackage getSubscriptionPackage() { return subscriptionPackage; }
    public void setSubscriptionPackage(SubscriptionPackage subscriptionPackage) { this.subscriptionPackage = subscriptionPackage; }

    // ===== BEHAVIOR METHODS =====
    public void register() {
        System.out.println("Tài xế " + name + " đã đăng ký thành công!");
    }

    public boolean login(String email, String password) {
        boolean success = this.email.equals(email) && this.password.equals(password);
        System.out.println(success ? "Đăng nhập thành công!" : "Sai email hoặc mật khẩu!");
        return success;
    }

    public void updateProfile(String newName, String newPhoneNumber) {
        this.name = newName;
        this.phoneNumber = newPhoneNumber;
        System.out.println("Hồ sơ tài xế " + name + " đã được cập nhật.");
    }

    public void bookCharger(String stationId) {
        System.out.println("Tài xế " + name + " đã đặt chỗ sạc tại trạm có ID: " + stationId);
    }

    public void startCharging(String chargerId) {
        System.out.println("Tài xế " + name + " bắt đầu phiên sạc tại bộ sạc có ID: " + chargerId);
    }

    public void viewChargingHistory() {
        System.out.println("Hiển thị lịch sử sạc của tài xế: " + name);
    }
}
