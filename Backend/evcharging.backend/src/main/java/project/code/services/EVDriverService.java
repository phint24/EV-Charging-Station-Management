package project.code.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.code.model.EVDriver;
import project.code.repository.EVDriverRepository;

import java.util.List;
import java.util.Optional;

@Service

public class EVDriverService {
    @Autowired
    private EVDriverRepository driverRepository;

    // Lấy danh sách tất cả tài xế
    public List<EVDriver> getAllDrivers() {
        return driverRepository.findAll();
    }

    // Tìm tài xế theo ID
    public Optional<EVDriver> getDriverById(Long id) {
        return driverRepository.findById(id);
    }

    // Tìm tài xế theo driverId (chuỗi định danh riêng)
    public EVDriver getDriverByDriverId(String driverId) {
        return driverRepository.findByDriverId(driverId);
    }

    // Tạo hoặc cập nhật tài xế
    public EVDriver saveDriver(EVDriver driver) {
        return driverRepository.save(driver);
    }

    // Xóa tài xế theo ID
    public void deleteDriver(Long id) {
        driverRepository.deleteById(id);
    }
}
