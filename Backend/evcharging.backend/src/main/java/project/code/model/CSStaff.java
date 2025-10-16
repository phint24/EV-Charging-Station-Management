package project.code.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "CSStaffs")
public class CSStaff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phoneNumber;

    @ManyToOne
    @JoinColumn(name = "stationId", nullable = false)
    private ChargingStation stationAssigned;

    public CSStaff() {}

    public CSStaff(Long id, String name, String email, String password, ChargingStation stationAssigned) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.stationAssigned = stationAssigned;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public ChargingStation getStationAssigned() {
        return stationAssigned;
    }
    public void setStationAssigned(ChargingStation stationAssigned) {
        this.stationAssigned = stationAssigned;
    }
}