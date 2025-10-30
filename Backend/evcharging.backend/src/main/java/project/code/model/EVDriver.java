package project.code.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.code.model.User;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "evdriver_profiles")
public class EVDriver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User userAccount;

    @Column(name="phone_number", length = 10)
    private String phoneNumber;

    @Column(name = "wallet_balance", nullable = false)
    private double walletBalance;

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL)
    private List<Vehicle> vehicles;

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL)
    private List<ChargeSession> chargeSessions;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id")
    private SubscriptionPackage subscriptionPackage;
}