package project.code.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.code.model.PaymentMethod;
import project.code.repository.PaymentMethodRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentMethodService {

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    public List<PaymentMethod> getAllPaymentMethods() {
        return paymentMethodRepository.findAll();
    }

    public Optional<PaymentMethod> getPaymentMethodById(String methodId) {
        return paymentMethodRepository.findById(methodId);
    }

    public PaymentMethod createPaymentMethod(PaymentMethod paymentMethod) {
        return paymentMethodRepository.save(paymentMethod);
    }

    public PaymentMethod updatePaymentMethod(String methodId, PaymentMethod updatedPaymentMethod) {
        return paymentMethodRepository.findById(methodId)
                .map(paymentMethod -> {
                    paymentMethod.setUserId(updatedPaymentMethod.getUserId());
                    paymentMethod.setType(updatedPaymentMethod.getType());
                    paymentMethod.setProvider(updatedPaymentMethod.getProvider());
                    paymentMethod.setDefault(updatedPaymentMethod.isDefault());
                    return paymentMethodRepository.save(paymentMethod);
                }).orElse(null);
    }

    public boolean deletePaymentMethod(String methodId) {
        if (paymentMethodRepository.existsById(methodId)) {
            paymentMethodRepository.deleteById(methodId);
            return true;
        }
        return false;
    }

    public boolean setDefaultPaymentMethod(String methodId) {
        Optional<PaymentMethod> optionalPaymentMethod = paymentMethodRepository.findById(methodId);
        if (optionalPaymentMethod.isPresent()) {
            PaymentMethod paymentMethod = optionalPaymentMethod.get();
            paymentMethod.setDefault(true);
            paymentMethodRepository.save(paymentMethod);
            // Reset other methods for the same user to false (if needed)
            paymentMethodRepository.findByUserId(paymentMethod.getUserId())
                    .stream()
                    .filter(pm -> !pm.getMethodId().equals(methodId))
                    .forEach(pm -> {
                        pm.setDefault(false);
                        paymentMethodRepository.save(pm);
                    });
            return true;
        }
        return false;
    }
}