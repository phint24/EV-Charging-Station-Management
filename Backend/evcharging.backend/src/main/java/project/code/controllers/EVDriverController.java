package project.code.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.code.model.EVDriver;
import project.code.services.EVDriverService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*")
public class EVDriverController {

    @Autowired
    private EVDriverService driverService;

    // Lấy tất cả tài xế
    @GetMapping
    public ResponseEntity<List<EVDriver>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    // Lấy thông tin tài xế theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDriverById(@PathVariable Long id) {
        Optional<EVDriver> driver = driverService.getDriverById(id);
        return driver.isPresent()
                ? ResponseEntity.ok(driver.get())
                : ResponseEntity.status(404).body("Không tìm thấy tài xế với ID: " + id);
    }

    // Tạo mới tài xế
    @PostMapping
    public ResponseEntity<?> createDriver(@RequestBody EVDriver driver) {
        EVDriver created = driverService.saveDriver(driver);
        return ResponseEntity.status(201).body("Đã tạo tài xế thành công với ID: " + created.getId());
    }

    // Cập nhật thông tin tài xế
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDriver(@PathVariable Long id, @RequestBody EVDriver newDriver) {
        Optional<EVDriver> existingDriver = driverService.getDriverById(id);
        if (existingDriver.isPresent()) {
            EVDriver driver = existingDriver.get();
            driver.setName(newDriver.getName());
            driver.setEmail(newDriver.getEmail());
            driver.setPhoneNumber(newDriver.getPhoneNumber());
            driver.setVehicle(newDriver.getVehicle());
            driver.setWallet(newDriver.getWallet());
            driverService.saveDriver(driver);
            return ResponseEntity.ok("Đã cập nhật thông tin tài xế thành công");
        } else {
            return ResponseEntity.status(404).body("Không tìm thấy tài xế để cập nhật");
        }
    }

    // Xóa tài xế
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDriver(@PathVariable Long id) {
        Optional<EVDriver> driver = driverService.getDriverById(id);
        if (driver.isPresent()) {
            driverService.deleteDriver(id);
            return ResponseEntity.ok("Đã xoá tài xế thành công");
        } else {
            return ResponseEntity.status(404).body("Không tìm thấy tài xế để xoá");
        }
    }
}
