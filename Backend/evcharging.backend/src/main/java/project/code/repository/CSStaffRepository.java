package project.code.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import project.code.model.CSStaff;

public interface CSStaffRepository extends JpaRepository<CSStaff,Long> {

}
