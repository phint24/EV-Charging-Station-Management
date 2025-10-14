package project.code.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import project.code.model.Admin;

@Repository
public interface AdminRepository extends JpaRepository <Admin, Long> {
    Optional<Admin> findByEmail(String email);
}
