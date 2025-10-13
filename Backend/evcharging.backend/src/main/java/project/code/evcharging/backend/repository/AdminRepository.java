package project.code.evcharging.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import project.code.evcharging.backend.model.Admin;

@Repository
public interface AdminRepository extends JpaRepository <Admin,String> {
    Optional<Admin> findByEmail(String email);
}
