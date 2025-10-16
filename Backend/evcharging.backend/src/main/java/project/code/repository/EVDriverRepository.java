package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.code.model.EVDriver;

public interface EVDriverRepository extends JpaRepository<EVDriver, Long> {
    EVDriver findByDriverId(String driverId);
}
