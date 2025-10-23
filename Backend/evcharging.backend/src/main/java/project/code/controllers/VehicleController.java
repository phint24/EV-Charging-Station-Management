package project.code.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.code.model.Vehicle;
import project.code.services.VehicleService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    // Lấy toàn bộ danh sách xe
    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    // Lấy xe theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getVehicleById(@PathVariable Long id) {
        Optional<Vehicle> vehicle = vehicleService.getVehicleById(id);
        return vehicle.isPresent()
                ? ResponseEntity.ok(vehicle.get())
                : ResponseEntity.status(404).body("Không tìm thấy xe với ID: " + id);
    }

    // Lấy xe theo vehicleId
    @GetMapping("/code/{vehicleId}")
    public ResponseEntity<?> getVehicleByVehicleId(@PathVariable String vehicleId) {
        Vehicle vehicle = vehicleService.getVehicleByVehicleId(vehicleId);
        return vehicle != null
                ? ResponseEntity.ok(vehicle)
                : ResponseEntity.status(404).body("Không tìm thấy xe có mã: " + vehicleId);
    }

    // Lấy danh sách xe của 1 tài xế (ownerId)
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<?> getVehiclesByOwnerId(@PathVariable String ownerId) {
        List<Vehicle> vehicles = vehicleService.getVehiclesByOwnerId(ownerId);
        return vehicles.isEmpty()
                ? ResponseEntity.status(404).body("Tài xế này chưa đăng ký xe nào.")
                : ResponseEntity.ok(vehicles);
    }

    // Tạo xe mới
    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        Vehicle created = vehicleService.createVehicle(vehicle);
        return ResponseEntity.status(201).body(created);
    }

    // Cập nhật xe
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        Vehicle updated = vehicleService.updateVehicle(id, vehicle);
        return updated != null
                ? ResponseEntity.ok(updated)
                : ResponseEntity.status(404).body("Không tìm thấy xe để cập nhật");
    }

    // Xoá xe
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVehicle(@PathVariable Long id) {
        boolean deleted = vehicleService.deleteVehicle(id);
        return deleted
                ? ResponseEntity.ok("Đã xoá xe thành công")
                : ResponseEntity.status(404).body("Không tìm thấy xe để xoá");
    }
}
