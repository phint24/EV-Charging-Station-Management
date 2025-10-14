package project.code.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.code.model.Admin;
import project.code.repository.AdminRepository;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public Admin updateAdmin(Long id, Admin updatedAdmin) {
        return adminRepository.findById(id)
                .map(admin -> {
                    admin.setName(updatedAdmin.getName());
                    admin.setEmail(updatedAdmin.getEmail());
                    admin.setPassword(updatedAdmin.getPassword());
                    admin.setRole(updatedAdmin.getRole());
                    return adminRepository.save(admin);
                }).orElse(null);
    }

    public boolean deleteAdmin(Long id) {
        if (adminRepository.existsById(id)) {
            adminRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean login(String email, String password) {
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        return adminOpt.map(admin -> admin.getPassword().equals(password)).orElse(false);
    }
}
