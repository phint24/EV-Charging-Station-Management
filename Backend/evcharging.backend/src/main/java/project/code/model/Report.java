package project.code.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;
import project.code.model.enums.ReportType; // <-- (1) Import Enum

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "report_id")
    private Long reportId;

    @Enumerated(EnumType.STRING)
    @Column(name= "report_type", nullable = false, length = 100)
    private ReportType reportType;

    @Column(name= "period_start", nullable = false)
    private LocalDateTime periodStart;

    @Column(name= "period_end", nullable = false)
    private LocalDateTime periodEnd;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id")
    private ChargingStation station;

    @Column(name= "total_sessions", nullable = false)
    private int totalSessions;

    @Column(name= "total_energy", nullable = false)
    private double totalEnergy;

    @Column(name= "total_revenue", nullable = false)
    private double totalRevenue;
}