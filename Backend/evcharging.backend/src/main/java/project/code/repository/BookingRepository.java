package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import project.code.model.Booking;
import project.code.model.ChargingPoint;
import project.code.model.ChargingStation;
import project.code.model.EVDriver;
import project.code.model.enums.BookingStatus;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByDriver(EVDriver driver);

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b " +
            "WHERE b.chargingPoint = :point " +
            "AND b.status IN ('PENDING', 'CONFIRMED') " +
            "AND b.startTime < :endTime AND b.endTime > :startTime")
    boolean existsOverlappingBooking(ChargingPoint point, LocalDateTime startTime, LocalDateTime endTime);

    List<Booking> findByChargingPoint_Station(ChargingStation station);
}