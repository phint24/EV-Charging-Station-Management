package project.code.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import project.code.dto.admin.AdminResponseDto;
import project.code.dto.admin.CreateAdminRequest;
import project.code.dto.UserSummaryDto;

import project.code.model.User;
import project.code.model.enums.Role;
import project.code.repository.UserRepository;
import project.code.model.Admin;
import project.code.repository.AdminRepository;
import project.code.model.ChargingStation;
import project.code.repository.ChargingStationRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Validated
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final ChargingStationRepository stationRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<AdminResponseDto> getAllAdminProfiles() {
        return adminRepository.findAll()
                .stream()
                .map(this::mapToAdminResponseDto) // Gọi hàm map
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true) // (4) Thêm Transactional
    public Optional<AdminResponseDto> getAdminProfileById(Long id) {
        return adminRepository.findById(id)
                .map(this::mapToAdminResponseDto); // Gọi hàm map
    }

    @Transactional
    public Admin createAdmin(CreateAdminRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }
        User userAccount = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.ROLE_ADMIN)
                .build();
        User savedUser = userRepository.save(userAccount);
        Admin adminProfile = Admin.builder()
                .userAccount(savedUser)
                .build();
        return adminRepository.save(adminProfile);
    }

    @Transactional
    public boolean deleteAdmin(Long id) {
        Optional<Admin> adminOpt = adminRepository.findById(id);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            User user = admin.getUserAccount();
            adminRepository.delete(admin);
            if (user != null) {
                userRepository.delete(user);
            }
            return true;
        }
        return false;
    }

    private AdminResponseDto mapToAdminResponseDto(Admin admin) {
        User user = admin.getUserAccount();
        // Cẩn thận: Nếu User cũng lazy-load các collection khác, bạn cần xử lý ở đây
        UserSummaryDto userDto = new UserSummaryDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
        return new AdminResponseDto(admin.getId(), userDto);
    }

//    public List<StationStatusDto> monitorAllStations() {
//        List<ChargingStation> stations = stationRepository.findAll();
//        return stations.stream()
//                .map(this::convertToStationStatusDto)
//                .collect(Collectors.toList());
//    }

//    @Transactional // Nên dùng Transactional cho các hàm cập nhật
//    public ChargingStation controlStation(Long stationId, StationControlRequest request) { // (5) Đổi ID thành Long
//
//        ChargingStation.StationStatus newStatus = request.newStatus();
//
//        if (newStatus != ChargingStation.StationStatus.AVAILABLE && newStatus != ChargingStation.StationStatus.OFFLINE) {
//            throw new IllegalArgumentException("Hành động không hợp lệ. Admin chỉ có thể đặt trạm ở trạng thái AVAILABLE hoặc OFFLINE.");
//        }
//
//        // (5) Sửa lỗi findById - dùng Long
//        ChargingStation station = stationRepository.findById(stationId)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạm sạc với ID: " + stationId));
//
//        if (station.getStatus() == ChargingStation.StationStatus.IN_USE && newStatus == ChargingStation.StationStatus.AVAILABLE) {
//            throw new IllegalStateException("Không thể chuyển trạng thái trạm đang được sử dụng (IN_USE) thành AVAILABLE.");
//        }
//
//        station.setStatus(newStatus);
//        return stationRepository.save(station);
//    }
//
//    private StationStatusDto convertToStationStatusDto(ChargingStation station) {
//        // (5) Sửa lỗi getId() -> getStationId()
//        return new StationStatusDto(station.getStationId(), station.getName(), station.getStatus());
//    }
}