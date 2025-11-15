package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.code.model.ChargeSession;

// (1) Import các kiểu dữ liệu mà phương thức mới cần
import project.code.model.ChargingStation;
import project.code.model.enums.SessionStatus;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChargeSessionRepository extends JpaRepository<ChargeSession, Long> {

    List<ChargeSession> findAllByStationAndStatusAndEndTimeBetween(
            ChargingStation station,
            SessionStatus status,
            LocalDateTime start,
            LocalDateTime end
    );

}