package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.code.model.Vehicle;
import project.code.model.EVDriver;
import java.util.List;
import java.util.Optional;

@Repository

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByDriver(EVDriver driver);
    Vehicle findByVehicleId(String vehicleId);
    boolean existsByDriverAndVehicleId(EVDriver driver, String vehicleId);
}
