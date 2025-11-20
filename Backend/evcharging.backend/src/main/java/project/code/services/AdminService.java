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
                .map(this::mapToAdminResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<AdminResponseDto> getAdminProfileById(Long id) {
        return adminRepository.findById(id)
                .map(this::mapToAdminResponseDto);
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
    public boolean deleteAdmin(Long userId) {
        Optional<Admin> adminOpt = adminRepository.findByUserAccount_Id(userId);

        if (adminOpt.isPresent()) {

            adminRepository.delete(adminOpt.get());
            return true;
        } else {
            if (userRepository.existsById(userId)) {
                userRepository.deleteById(userId);
                return true;
            }
        }

        return false;
    }

    private AdminResponseDto mapToAdminResponseDto(Admin admin) {
        User user = admin.getUserAccount();
        UserSummaryDto userDto = new UserSummaryDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
        return new AdminResponseDto(admin.getId(), userDto);
    }
}