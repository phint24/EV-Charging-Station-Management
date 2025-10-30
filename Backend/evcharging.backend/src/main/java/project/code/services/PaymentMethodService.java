package project.code.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.code.model.EVDriver;
import project.code.model.PaymentMethod;
import project.code.repository.EVDriverRepository;
import project.code.repository.PaymentMethodRepository;

import project.code.dto.CreatePaymentMethodRequest;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor // (4) Dùng Lombok
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;
    private final EVDriverRepository evDriverRepository;

    public List<PaymentMethod> getAllPaymentMethods() {
        return paymentMethodRepository.findAll();
    }

    public Optional<PaymentMethod> getPaymentMethodById(String methodId) {
        return paymentMethodRepository.findById(methodId);
    }

    @Transactional // (6) Dùng Transactional
    public PaymentMethod createPaymentMethod(CreatePaymentMethodRequest request) {

        // Tìm tài xế (EVDriver profile)
        EVDriver driver = evDriverRepository.findById(request.driverId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy EVDriver với ID: " + request.driverId()));

        // Nếu request yêu cầu "setDefault",
        // hãy tìm và bỏ 'default' của phương thức cũ
        if (request.isDefault()) {
            unsetOldDefaultMethod(driver);
        }

        // Tạo đối tượng
        PaymentMethod paymentMethod = PaymentMethod.builder()
                .methodId(request.methodId())
                .driver(driver)
                .type(request.type())
                .provider(request.provider())
                .isDefault(request.isDefault())
                .build();

        return paymentMethodRepository.save(paymentMethod);
    }

    public boolean deletePaymentMethod(String methodId) {
        if (paymentMethodRepository.existsById(methodId)) {
            paymentMethodRepository.deleteById(methodId);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean setDefaultPaymentMethod(String methodId) {
        Optional<PaymentMethod> optionalPaymentMethod = paymentMethodRepository.findById(methodId);

        if (optionalPaymentMethod.isPresent()) {
            PaymentMethod newDefaultMethod = optionalPaymentMethod.get();
            EVDriver driver = newDefaultMethod.getDriver();

            // 1. Bỏ 'default' của phương thức cũ (nếu có)
            unsetOldDefaultMethod(driver);

            // 2. Đặt 'default' cho phương thức mới
            newDefaultMethod.setDefault(true);
            paymentMethodRepository.save(newDefaultMethod);
            return true;
        }
        return false;
    }

    private void unsetOldDefaultMethod(EVDriver driver) {
        Optional<PaymentMethod> oldDefaultOpt = paymentMethodRepository.findByDriverAndIsDefault(driver, true);

        oldDefaultOpt.ifPresent(oldDefault -> {
            oldDefault.setDefault(false);
            paymentMethodRepository.save(oldDefault);
        });
    }
}