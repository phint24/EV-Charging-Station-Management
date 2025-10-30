package project.code.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import project.code.model.CSStaff;
import project.code.repository.CSStaffRepository;
import project.code.model.User;
import project.code.model.enums.Role;
import project.code.repository.UserRepository;
import project.code.model.ChargingStation;
import project.code.repository.ChargingStationRepository;

import project.code.dto.csstaff.CreateCSStaffRequest;
import project.code.dto.csstaff.UpdateCSStaffProfileRequest;
import project.code.dto.csstaff.CsStaffResponseDto;
import project.code.dto.StationSummaryDto;
import project.code.dto.UserSummaryDto;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Validated
@RequiredArgsConstructor
public class CSStaffService {

    private final CSStaffRepository csStaffRepository;
    private final UserRepository userRepository;
    private final ChargingStationRepository stationRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public CsStaffResponseDto createCSStaff(CreateCSStaffRequest request) {

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }

        ChargingStation station = stationRepository.findById(request.stationId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạm sạc với ID: " + request.stationId()));

        User userAccount = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.ROLE_CSSTAFF)
                .build();
        User savedUser = userRepository.save(userAccount);

        CSStaff staffProfile = CSStaff.builder()
                .userAccount(savedUser)
                .phoneNumber(request.phoneNumber())
                .stationAssigned(station)
                .build();

        CSStaff savedStaff = csStaffRepository.save(staffProfile);

        return mapToCsStaffResponseDto(savedStaff);
    }

    @Transactional(readOnly = true)
    public List<CsStaffResponseDto> getAllCSStaffs() {
        return csStaffRepository.findAll().stream()
                .map(this::mapToCsStaffResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<CsStaffResponseDto> getCSStaffById(Long staffId) {
        return csStaffRepository.findById(staffId)
                .map(this::mapToCsStaffResponseDto);
    }

    @Transactional
    public Optional<CsStaffResponseDto> updateCSStaffProfile(Long staffId, UpdateCSStaffProfileRequest request) {
        return csStaffRepository.findById(staffId).map(staff -> {

            if (request.phoneNumber() != null) {
                staff.setPhoneNumber(request.phoneNumber());
            }

            if (request.stationId() != null &&
                    !request.stationId().equals(staff.getStationAssigned().getStationId())) {

                ChargingStation newStation = stationRepository.findById(request.stationId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy trạm sạc với ID: " + request.stationId()));
                staff.setStationAssigned(newStation);
            }

            CSStaff updatedStaff = csStaffRepository.save(staff);

            return mapToCsStaffResponseDto(updatedStaff);
        });
    }

    @Transactional
    public boolean deleteCSStaff(Long staffId) {
        Optional<CSStaff> staffOpt = csStaffRepository.findById(staffId);

        if (staffOpt.isPresent()) {
            CSStaff staff = staffOpt.get();
            User user = staff.getUserAccount();

            csStaffRepository.delete(staff);

            if (user != null) {
                userRepository.delete(user);
            }
            return true;
        }
        return false;
    }

    private CsStaffResponseDto mapToCsStaffResponseDto(CSStaff staff) {

        User user = staff.getUserAccount();
        UserSummaryDto userDto = new UserSummaryDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );

        ChargingStation station = staff.getStationAssigned();
        StationSummaryDto stationDto = new StationSummaryDto(
                station.getStationId(),
                station.getName(),
                station.getLocation(),
                station.getStatus()
        );

        return new CsStaffResponseDto(
                staff.getId(),
                userDto,
                staff.getPhoneNumber(),
                stationDto
        );
    }
}