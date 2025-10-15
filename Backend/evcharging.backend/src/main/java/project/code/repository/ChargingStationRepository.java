package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.code.model.ChargingStation;

@Repository
public interface ChargingStationRepository extends JpaRepository<ChargingStation, String> {
    
}
