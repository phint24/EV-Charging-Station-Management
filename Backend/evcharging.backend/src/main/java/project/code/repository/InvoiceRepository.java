package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.code.model.Invoice;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {
}