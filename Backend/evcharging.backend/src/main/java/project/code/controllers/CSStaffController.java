package project.code.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.code.model.CSStaff;
import project.code.services.CSStaffService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/csstaffs")
public class CSStaffController {
    @Autowired
    private CSStaffService csStaffService;

    @PostMapping
    public ResponseEntity<CSStaff> createCSStaff(@RequestBody CSStaff staff) {
        return ResponseEntity.status(201).body(csStaffService.createCSStaff(staff));
    }

    @GetMapping
    public ResponseEntity<List<CSStaff>> getAllCSStaffs() {
        return ResponseEntity.ok(csStaffService.getAllCSStaffs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCSStaffById(@PathVariable Long id) {
        Optional<CSStaff> staff = csStaffService.getCSStaffById(id);
        return staff.isPresent()
                ? ResponseEntity.ok(staff.get())
                : ResponseEntity.status(404).body("Không tìm thấy nhân viên CSStaff có ID: " + id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCSStaff(@PathVariable Long id, @RequestBody CSStaff updatedStaff) {
        Optional<CSStaff> staff = csStaffService.updateCSStaff(id, updatedStaff);
        return staff.isPresent()
                ? ResponseEntity.ok(staff.get())
                : ResponseEntity.status(404).body("Không thể cập nhật, không tìm thấy CSStaff ID: " + id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCSStaff(@PathVariable Long id) {
        boolean deleted = csStaffService.deleteCSStaff(id);
        return deleted
                ? ResponseEntity.ok("Đã xóa nhân viên có ID: " + id)
                : ResponseEntity.status(404).body("Không tìm thấy nhân viên để xóa");
    }
}
