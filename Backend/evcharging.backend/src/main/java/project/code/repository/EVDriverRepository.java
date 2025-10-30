package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.code.model.EVDriver;
import project.code.model.User;
import java.util.Optional;

public interface EVDriverRepository extends JpaRepository<EVDriver, Long> {
    Optional<EVDriver> findByUserAccount(User userAccount);
}
