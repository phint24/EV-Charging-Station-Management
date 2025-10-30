package project.code.model;

import jakarta.persistence.*;
import lombok.*;
// (1) Import Enum mới
import project.code.model.enums.PaymentType;

@Entity
@Table(name = "payment_methods")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "method_id")
    private Long methodId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private EVDriver driver;
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    private PaymentType type;

    @Column(name = "provider", nullable = false, length = 100)
    private String provider;

    @Column(name = "is_default", nullable = false)
    private boolean isDefault;
}