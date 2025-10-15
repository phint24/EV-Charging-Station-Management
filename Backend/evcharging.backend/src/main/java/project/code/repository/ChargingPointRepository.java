package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.code.model.ChargingPoint;

@Repository
public interface ChargingPointRepository extends JpaRepository<ChargingPoint, Long> {
}
