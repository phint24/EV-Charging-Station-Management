package project.code.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.code.model.CSStaff;
import project.code.repository.CSStaffRepository;
import java.util.List;
import java.util.Optional;

@Service
public class CSStaffService {
    @Autowired
    private CSStaffRepository csStaffRepository;

    public CSStaff createCSStaff(CSStaff staff) {
        return csStaffRepository.save(staff);
    }

    public List<CSStaff> getAllCSStaffs() {
        return csStaffRepository.findAll();
    }

    public Optional<CSStaff> getCSStaffById(Long staffId) {
        return csStaffRepository.findById(staffId);
    }

    public Optional<CSStaff> updateCSStaff(Long staffId, CSStaff updatedStaff) {
        return csStaffRepository.findById(staffId).map(staff -> {
            staff.setName(updatedStaff.getName());
            staff.setEmail(updatedStaff.getEmail());
            staff.setPassword(updatedStaff.getPassword());
            staff.setPhoneNumber(updatedStaff.getPhoneNumber());
            staff.setStationAssigned(updatedStaff.getStationAssigned());
            return csStaffRepository.save(staff);
        });
    }

    public boolean deleteCSStaff(Long staffId) {
        if (csStaffRepository.existsById(staffId)) {
            csStaffRepository.deleteById(staffId);
            return true;
        }
        return false;
    }
}
