package project.code.controllers;

import project.code.dto.admin.CreateAdminRequest;
import project.code.dto.admin.AdminResponseDto;
import project.code.dto.UserSummaryDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project.code.model.Admin;
import project.code.services.AdminService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<AdminResponseDto>> getAllAdminProfiles() {
        return ResponseEntity.ok(adminService.getAllAdminProfiles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminProfileById(@PathVariable Long id) {
        Optional<AdminResponseDto> adminDto = adminService.getAdminProfileById(id);
        return adminDto.isPresent() ? ResponseEntity.ok(adminDto.get())
                : ResponseEntity.status(404).body("Không tìm thấy admin profile");
    }

    @PostMapping
    public ResponseEntity<Admin> createAdmin(@Valid @RequestBody CreateAdminRequest request) {
        return ResponseEntity.status(201).body(adminService.createAdmin(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable Long id) {
        boolean deleted = adminService.deleteAdmin(id);
        return deleted ? ResponseEntity.ok("Đã xoá admin thành công")
                : ResponseEntity.status(404).body("Không tìm thấy admin để xoá");
    }
}