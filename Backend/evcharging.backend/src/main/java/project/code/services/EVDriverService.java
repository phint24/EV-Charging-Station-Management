package project.code.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.code.model.EVDriver;
import project.code.model.PaymentMethod;
import project.code.model.User;
import project.code.model.Vehicle;
import project.code.repository.EVDriverRepository;
import project.code.repository.PaymentMethodRepository;
import project.code.repository.UserRepository;
import project.code.repository.VehicleRepository;

import project.code.dto.wallet.WalletTopUpRequest;
import project.code.dto.wallet.WalletBalanceApiResponse;

import project.code.dto.evdriver.EVDriverProfileDto;
import project.code.dto.evdriver.UpdateEvDriverRequest;
import project.code.dto.UserSummaryDto;
import project.code.dto.vehicle.CreateVehicleRequest;
import project.code.dto.vehicle.UpdateVehicleRequest;
import project.code.dto.vehicle.VehicleDto;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EVDriverService {

    private final EVDriverRepository evDriverRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    @Transactional(readOnly = true)
    public EVDriverProfileDto getDriverProfile(User currentUser) {
        EVDriver driverProfile = findDriverProfileByUser(currentUser);
        return mapToEvDriverProfileDto(driverProfile);
    }

    @Transactional
    public EVDriverProfileDto updateDriverProfile(User currentUser, UpdateEvDriverRequest request) {
        User userToUpdate = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản User đang đăng nhập."));

        EVDriver driverProfile = findDriverProfileByUser(userToUpdate);

        boolean userChanged = false;
        boolean profileChanged = false;

        if (request.name() != null && !request.name().isBlank() && !request.name().equals(userToUpdate.getName())) {
            userToUpdate.setName(request.name());
            userChanged = true;
        }

        if (request.phoneNumber() != null && !request.phoneNumber().isBlank() && !request.phoneNumber().equals(driverProfile.getPhoneNumber())) {
            driverProfile.setPhoneNumber(request.phoneNumber());
            profileChanged = true;
        }

        if (userChanged) {
            userRepository.save(userToUpdate);
        }
        if (profileChanged) {
            evDriverRepository.save(driverProfile);
        }

        return mapToEvDriverProfileDto(driverProfile);
    }

    @Transactional(readOnly = true)
    public List<VehicleDto> getVehicles(User currentUser) {
        EVDriver driverProfile = findDriverProfileByUser(currentUser);
        List<Vehicle> vehicles = driverProfile.getVehicles();
        return vehicles.stream()
                .map(this::mapToVehicleDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public VehicleDto addVehicle(User currentUser, CreateVehicleRequest request) {
        EVDriver driverProfile = findDriverProfileByUser(currentUser);

        boolean exists = vehicleRepository.existsByDriverAndVehicleId(driverProfile, request.vehicleId());
        if (exists) {
            throw new IllegalArgumentException("Biển số xe " + request.vehicleId() + " đã được đăng ký.");
        }

        Vehicle newVehicle = Vehicle.builder()
                .driver(driverProfile)
                .vehicleId(request.vehicleId())
                .brand(request.brand())
                .model(request.model())
                .batteryCapacity(request.batteryCapacity())
                .connectorType(request.connectorType())
                .build();

        Vehicle savedVehicle = vehicleRepository.save(newVehicle);
        return mapToVehicleDto(savedVehicle);
    }

    @Transactional
    public VehicleDto updateVehicle(User currentUser, Long vehicleId, UpdateVehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy xe với ID: " + vehicleId));

        if (!vehicle.getDriver().getUserAccount().getId().equals(currentUser.getId())) {
            throw new SecurityException("Bạn không có quyền cập nhật xe này.");
        }

        if (request.brand() != null) vehicle.setBrand(request.brand());
        if (request.model() != null) vehicle.setModel(request.model());
        if (request.batteryCapacity() != null) vehicle.setBatteryCapacity(request.batteryCapacity());
        if (request.connectorType() != null) vehicle.setConnectorType(request.connectorType());

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return mapToVehicleDto(updatedVehicle);
    }

    @Transactional
    public void deleteVehicle(User currentUser, Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy xe với ID: " + vehicleId));

        if (!vehicle.getDriver().getUserAccount().getId().equals(currentUser.getId())) {
            throw new SecurityException("Bạn không có quyền xóa xe này.");
        }

        vehicleRepository.delete(vehicle);
    }

    @Transactional(readOnly = true)
    public WalletBalanceApiResponse getWalletBalance(User currentUser) {
        EVDriver driver = findDriverProfileByUser(currentUser);

        return new WalletBalanceApiResponse(
                driver.getId(),
                currentUser.getEmail(),
                driver.getWalletBalance(),
                0.0,
                driver.getWalletBalance()
        );
    }

    @Transactional
    public WalletBalanceApiResponse topUpWallet(User currentUser, WalletTopUpRequest request) {

        EVDriver driver = findDriverProfileByUser(currentUser);

        PaymentMethod paymentMethod = paymentMethodRepository.findByMethodId(request.paymentMethodId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phương thức thanh toán ID: " + request.paymentMethodId()));

        if (!paymentMethod.getDriver().getId().equals(driver.getId())) {
            throw new AccessDeniedException("Lỗi bảo mật: Bạn không có quyền dùng phương thức thanh toán này.");
        }

        boolean paymentSuccess = true; // Giả sử luôn thành công

        if (!paymentSuccess) {
            throw new RuntimeException("Thanh toán thất bại. Vui lòng thử lại.");
        }

        double oldBalance = driver.getWalletBalance();
        double amountToAdd = request.amount();
        double newBalance = oldBalance + amountToAdd;

        driver.setWalletBalance(newBalance);
        evDriverRepository.save(driver);

        return new WalletBalanceApiResponse(
                driver.getId(),
                currentUser.getEmail(),
                oldBalance,
                amountToAdd,
                newBalance
        );
    }

    private EVDriver findDriverProfileByUser(User user) {
        return evDriverRepository.findByUserAccount(user)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy hồ sơ EVDriver cho người dùng: " + user.getEmail()));
    }

    private EVDriverProfileDto mapToEvDriverProfileDto(EVDriver driver) {
        User user = driver.getUserAccount();
        UserSummaryDto userDto = new UserSummaryDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );

        List<VehicleDto> vehicleDtos = driver.getVehicles()
                .stream()
                .map(this::mapToVehicleDto)
                .collect(Collectors.toList());

        return new EVDriverProfileDto(
                driver.getId(),
                userDto,
                driver.getPhoneNumber(),
                driver.getWalletBalance(),
                vehicleDtos
        );
    }

    private VehicleDto mapToVehicleDto(Vehicle vehicle) {
        return new VehicleDto(
                vehicle.getId(),
                vehicle.getVehicleId(),
                vehicle.getBrand(),
                vehicle.getModel(),
                vehicle.getBatteryCapacity(),
                vehicle.getConnectorType()
        );
    }
}