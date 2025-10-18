package project.code.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subscriptionPackage")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionPackage {
    
    @Id
    @Column(nullable = false, length = 100)
    private String packageId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private int durationDays;

    @Column(length = 1000)
    private String benefits;

    @Column(nullable = false, length = 50)
    private String type;

    // Getters - Setters
    public String getPackageId() {
        return packageId;
    }
    public void setPackageId(String packageId) {
        this.packageId = packageId;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }

    public int getDurationDays() {
        return durationDays;
    }
    public void setDurationDays(int durationDays) {
        this.durationDays = durationDays;
    }

    public String getBenefits() {
        return benefits;
    }
    public void setBenefits(String benefits) {
        this.benefits = benefits;
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    // Methods
    public void createPackage() {
        System.out.println("Tạo gói đăng ký: " + this.name);
    }

    public void updatePackage() {
        System.out.println("Cập nhật gói đăng ký: " + this.name);
    }

    public void deletePackage() {
        System.out.println("Xóa gói đăng ký: " + this.packageId);
    }

    public void activateForUser(String userId) {
        System.out.println("Kích hoạt gói " + this.name + " cho người dùng: " + userId);
    }

    public void cancelForUser(String userId) {
        System.out.println("Hủy gói " + this.name + " cho người dùng: " + userId);
    }
}