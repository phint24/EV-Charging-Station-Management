package project.code.model;   // Lưu thông tin gói (id, price, durationDays...)

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscription_packages")
public class SubscriptionPackage {
    @Id
    @Column(name = "package_id")
    private String packageId;

    private String name;

    @Column(length = 2000)
    private String description;

    private double price;

    private int durationDays; // số ngày hiệu lực

    @Column(length = 1000)
    private String benefits;

    private String type; // e.g. "monthly", "annual", "payg"

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SubscriptionPackage() {}

    // Constructor, getters và setters (omitted for brevity) — hiện thực đầy đủ khi coding
    // Generate getters/setters or use Lombok in project
    // Ví dụ getter/setter cho packageId:
    public String getPackageId() { return packageId; }
    public void setPackageId(String packageId) { this.packageId = packageId; }

    // ... các getter/setter khác

    @PrePersist
    public void prePersist() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate
    public void preUpdate() { updatedAt = LocalDateTime.now(); }
}
