package project.code.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.code.model.Admin;
import project.code.repository.AdminRepository;
import project.code.model.ChargingStation;
import project.code.repository.ChargingPointRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public Admin updateAdmin(Long id, Admin updatedAdmin) {
        return adminRepository.findById(id)
                .map(admin -> {
                    admin.setName(updatedAdmin.getName());
                    admin.setEmail(updatedAdmin.getEmail());
                    admin.setPassword(updatedAdmin.getPassword());
                    admin.setRole(updatedAdmin.getRole());
                    return adminRepository.save(admin);
                }).orElse(null);
    }

    public boolean deleteAdmin(Long id) {
        if (adminRepository.existsById(id)) {
            adminRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean login (String email, String password) {
        System.out.println("Login success");
        return true;
    }

//    public List<StationStatusDto> monitorAllStations() {
//        List<ChargingStation> stations = ChargingPointRepository.findAll();
//        return stations.stream()
//                .map(this::convertToStationStatusDto)
//                .collect(Collectors.toList());
//    }
//
//    public List<StationStatusDto> monitorAllStations() {
//        List<ChargingStation> stations = stationRepository.findAll();
//        return stations.stream()
//                .map(this::convertToStationStatusDto)
//                .collect(Collectors.toList());
//    }
//
//    public ChargingStation controlStation(Long stationId, StationControlRequest request) {
//        ChargingStation.StationStatus newStatus = request.getNewStatus();
//
//        if (newStatus != ChargingStation.StationStatus.AVAILABLE && newStatus != ChargingStation.StationStatus.OFFLINE) {
//            throw new IllegalArgumentException("Hành động không hợp lệ. Admin chỉ có thể đặt trạm ở trạng thái AVAILABLE (hoạt động) hoặc OFFLINE (dừng).");
//        }
//
//        ChargingStation station = stationRepository.findById(stationId)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạm sạc với ID: " + stationId));
//
//        if (station.getStatus() == ChargingStation.StationStatus.IN_USE && newStatus == ChargingStation.StationStatus.AVAILABLE) {
//            throw new IllegalStateException("Không thể chuyển trạng thái trạm đang được sử dụng thành AVAILABLE.");
//        }
//
//        station.setStatus(newStatus);
//        return stationRepository.save(station);
//    }
}
