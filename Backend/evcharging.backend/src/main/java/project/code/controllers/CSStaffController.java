package project.code.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.code.services.CSStaffService;
import project.code.dto.csstaff.CreateCSStaffRequest;
import project.code.dto.csstaff.UpdateCSStaffProfileRequest;
import project.code.dto.csstaff.CsStaffResponseDto;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/csstaffs")
@RequiredArgsConstructor
public class CSStaffController {

    private final CSStaffService csStaffService;

    @PostMapping
    public ResponseEntity<?> createCSStaff(@Valid @RequestBody CreateCSStaffRequest request) {
        try {
            CsStaffResponseDto staffDto = csStaffService.createCSStaff(request);
            return ResponseEntity.status(201).body(staffDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    // (4) SỬA KIỂU TRẢ VỀ
    public ResponseEntity<List<CsStaffResponseDto>> getAllCSStaffs() {
        return ResponseEntity.ok(csStaffService.getAllCSStaffs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCSStaffById(@PathVariable Long id) {
        Optional<CsStaffResponseDto> staffDto = csStaffService.getCSStaffById(id);
        return staffDto.isPresent()
                ? ResponseEntity.ok(staffDto.get())
                : ResponseEntity.status(404).body("Không tìm thấy nhân viên CSStaff có ID: " + id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCSStaffProfile(@PathVariable Long id, @Valid @RequestBody UpdateCSStaffProfileRequest request) {
        try {
            Optional<CsStaffResponseDto> staffDto = csStaffService.updateCSStaffProfile(id, request);
            return staffDto.isPresent()
                    ? ResponseEntity.ok(staffDto.get())
                    : ResponseEntity.status(404).body("Không thể cập nhật, không tìm thấy CSStaff ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCSStaff(@PathVariable Long id) {
        boolean deleted = csStaffService.deleteCSStaff(id);
        return deleted
                ? ResponseEntity.ok("Đã xóa nhân viên có ID: " + id)
                : ResponseEntity.status(404).body("Không tìm thấy nhân viên để xóa");
    }
}