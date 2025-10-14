package project.code.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.code.model.Admin;
import project.code.services.AdminService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable Long id) {
        Optional<Admin> admin = adminService.getAdminById(id);
        return admin.isPresent() ? ResponseEntity.ok(admin.get())
                : ResponseEntity.status(404).body("Không tìm thấy admin");
    }

    @PostMapping
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) {
        return ResponseEntity.status(201).body(adminService.createAdmin(admin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable Long id, @RequestBody Admin admin) {
        Admin updated = adminService.updateAdmin(id, admin);
        return updated != null ? ResponseEntity.ok(updated)
                : ResponseEntity.status(404).body("Không tìm thấy admin để cập nhật");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable Long id) {
        boolean deleted = adminService.deleteAdmin(id);
        return deleted ? ResponseEntity.ok("Đã xoá admin thành công")
                : ResponseEntity.status(404).body("Không tìm thấy admin để xoá");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password) {
        boolean success = adminService.login(email, password);
        return success ? ResponseEntity.ok("Đăng nhập thành công")
                : ResponseEntity.status(401).body("Email hoặc mật khẩu sai");
    }
}
