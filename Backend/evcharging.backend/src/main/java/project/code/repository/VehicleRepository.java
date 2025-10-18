package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.code.model.Vehicle;
import java.util.List;

@Repository

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    // Tìm tất cả xe theo mã tài xế (ownerId)
    List<Vehicle> findByOwnerId(String ownerId);
    // Tìm xe theo mã xe (vehicleId)
    Vehicle findByVehicleId(String vehicleId);
}
