package project.code.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import project.code.model.Admin;
import project.code.model.User;

@Repository
public interface AdminRepository extends JpaRepository <Admin, Long> {
    Optional<Admin> findByUserAccount(User userAccount);
    Optional<Admin> findByUserAccount_Id(Long userId);
}
