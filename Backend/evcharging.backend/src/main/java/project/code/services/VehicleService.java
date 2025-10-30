package project.code.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.code.model.Vehicle;
import project.code.repository.VehicleRepository;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    // Lấy tất cả xe
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    // Lấy xe theo ID trong database (id tự tăng)
    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }

    // Lấy xe theo vehicleId
    public Vehicle getVehicleByVehicleId(String vehicleId) {
        return vehicleRepository.findByVehicleId(vehicleId);
    }

    // Lấy danh sách xe theo ownerId (driverId)
    public List<Vehicle> getVehiclesByOwnerId(String ownerId) {
        return vehicleRepository.findByOwnerId(ownerId);
    }

    // Tạo mới xe
    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    // Cập nhật xe
    public Vehicle updateVehicle(Long id, Vehicle updatedVehicle) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(id);
        if (optionalVehicle.isPresent()) {
            Vehicle vehicle = optionalVehicle.get();
            vehicle.setBrand(updatedVehicle.getBrand());
            vehicle.setModel(updatedVehicle.getModel());
            vehicle.setBatteryCapacity(updatedVehicle.getBatteryCapacity());
            vehicle.setConnectorType(updatedVehicle.getConnectorType());
            vehicle.setOwnerId(updatedVehicle.getOwnerId());
            vehicle.setVehicleId(updatedVehicle.getVehicleId());
            return vehicleRepository.save(vehicle);
        }
        return null;
    }

    // Xoá xe
    public boolean deleteVehicle(Long id) {
        if (vehicleRepository.existsById(id)) {
            vehicleRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
