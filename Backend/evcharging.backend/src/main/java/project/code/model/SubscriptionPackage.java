package project.code.model;

import jakarta.persistence.*;
import lombok.*;
import project.code.model.enums.SubscriptionType;

@Entity
@Table(name = "subscription_package")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id")
    private Long packageId;

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private SubscriptionType type;
}