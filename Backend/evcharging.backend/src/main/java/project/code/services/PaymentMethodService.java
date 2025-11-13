package project.code.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.code.model.EVDriver;
import project.code.model.PaymentMethod;
import project.code.model.User;
import project.code.repository.EVDriverRepository;
import project.code.repository.PaymentMethodRepository;

import project.code.dto.payment.CreatePaymentMethodRequest;
import project.code.dto.payment.PaymentMethodDto;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;
    private final EVDriverRepository evDriverRepository;

    @Transactional(readOnly = true)
    public List<PaymentMethodDto> getAllPaymentMethods(User currentUser) {
        EVDriver driver = findDriverProfileByUser(currentUser);
        return paymentMethodRepository.findByDriver(driver)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<PaymentMethodDto> getPaymentMethodById(Long methodId, User currentUser) {
        EVDriver driver = findDriverProfileByUser(currentUser);
        PaymentMethod paymentMethod = findMethodByIdOrThrow(methodId);

        // Kiểm tra quyền sở hữu
        if (!paymentMethod.getDriver().getId().equals(driver.getId())) {
            throw new AccessDeniedException("Bạn không có quyền xem phương thức thanh toán này.");
        }

        return Optional.of(mapToDto(paymentMethod));
    }

    @Transactional
    public PaymentMethodDto createPaymentMethod(CreatePaymentMethodRequest request, User currentUser) {
        EVDriver driver = findDriverProfileByUser(currentUser);

        // (Kiểm tra bảo mật: Đảm bảo driverId trong request khớp với driverId của token)
        if (request.driverId() != null && !request.driverId().equals(driver.getId())) {
            throw new AccessDeniedException("Bạn chỉ có thể thêm phương thức thanh toán cho chính mình.");
        }

        if (request.isDefault()) {
            unsetOldDefaultMethods(driver);
        }

        PaymentMethod paymentMethod = PaymentMethod.builder()
                .driver(driver)
                .type(request.type())
                .provider(request.provider())
                .isDefault(request.isDefault())
                .build();

        PaymentMethod savedMethod = paymentMethodRepository.save(paymentMethod);
        return mapToDto(savedMethod);
    }

    @Transactional
    public boolean deletePaymentMethod(Long methodId, User currentUser) {
        EVDriver driver = findDriverProfileByUser(currentUser);
        PaymentMethod paymentMethod = findMethodByIdOrThrow(methodId);

        if (!paymentMethod.getDriver().getId().equals(driver.getId())) {
            throw new AccessDeniedException("Bạn không có quyền xóa phương thức thanh toán này.");
        }

        paymentMethodRepository.delete(paymentMethod);
        return true;
    }

    @Transactional
    public boolean setDefaultPaymentMethod(Long methodId, User currentUser) {
        EVDriver driver = findDriverProfileByUser(currentUser);
        PaymentMethod newDefaultMethod = findMethodByIdOrThrow(methodId);

        if (!newDefaultMethod.getDriver().getId().equals(driver.getId())) {
            throw new AccessDeniedException("Bạn không có quyền sửa phương thức thanh toán này.");
        }

        unsetOldDefaultMethods(driver);

        newDefaultMethod.setDefault(true);
        paymentMethodRepository.save(newDefaultMethod);
        return true;
    }

    // --- Helper Methods ---
    private EVDriver findDriverProfileByUser(User user) {
        return evDriverRepository.findByUserAccount(user)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy hồ sơ EVDriver cho người dùng: " + user.getEmail()));
    }

    private PaymentMethod findMethodByIdOrThrow(Long methodId) {
        return paymentMethodRepository.findById(methodId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phương thức thanh toán ID: " + methodId));
    }

    private void unsetOldDefaultMethods(EVDriver driver) {
        paymentMethodRepository.findByDriverAndIsDefault(driver, true)
                .ifPresent(oldDefault -> {
                    oldDefault.setDefault(false);
                    paymentMethodRepository.save(oldDefault);
                });
    }

    private PaymentMethodDto mapToDto(PaymentMethod method) {
        return new PaymentMethodDto(
                method.getMethodId(),
                method.getType(),
                method.getProvider(),
                method.isDefault()
        );
    }
}