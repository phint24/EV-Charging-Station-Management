package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.code.model.CSStaff;
import project.code.model.User;

import java.util.Optional;

public interface CSStaffRepository extends JpaRepository<CSStaff, Long> {
    Optional<CSStaff> findByUserAccount(User user);
    Optional<CSStaff> findByUserAccount_Id(Long userId);
}