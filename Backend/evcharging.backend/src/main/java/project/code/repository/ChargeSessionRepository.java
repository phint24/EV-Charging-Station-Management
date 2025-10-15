package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.code.model.ChargeSession;

@Repository
public interface ChargeSessionRepository extends JpaRepository<ChargeSession, String> {
}
