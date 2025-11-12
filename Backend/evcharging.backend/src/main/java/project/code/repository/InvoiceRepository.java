package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.code.model.ChargeSession;
import project.code.model.EVDriver;
import project.code.model.Invoice;
import project.code.model.enums.InvoiceStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByChargeSession(ChargeSession chargeSession);
    List<Invoice> findByDriver(EVDriver driver);
    List<Invoice> findByStatus(InvoiceStatus status);
}