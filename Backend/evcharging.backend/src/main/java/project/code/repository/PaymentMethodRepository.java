package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.code.model.EVDriver; // (1) Import EVDriver
import project.code.model.PaymentMethod;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, String> {
    List<PaymentMethod> findByDriver(EVDriver driver);
    Optional<PaymentMethod> findByDriverAndIsDefault(EVDriver driver, boolean isDefault);
}