package project.code.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import project.code.dto.wallet.WalletBalanceApiResponse;
import project.code.dto.wallet.WalletTopUpRequest;
import project.code.model.User;
import project.code.model.enums.BookingStatus;
import project.code.services.CSStaffService;
import project.code.services.BookingService;
import project.code.dto.csstaff.CreateCSStaffRequest;
import project.code.dto.csstaff.UpdateCSStaffProfileRequest;
import project.code.dto.csstaff.CsStaffResponseDto;
import project.code.dto.booking.BookingDto;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/csstaffs")
@RequiredArgsConstructor
public class CSStaffController {

    private final CSStaffService csStaffService;
    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCSStaff(@Valid @RequestBody CreateCSStaffRequest request) {
        try {
            CsStaffResponseDto staffDto = csStaffService.createCSStaff(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(staffDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<CsStaffResponseDto>> getAllCSStaffs() {
        return ResponseEntity.ok(csStaffService.getAllCSStaffs());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getCSStaffById(@PathVariable Long id) {
        Optional<CsStaffResponseDto> staffDto = csStaffService.getCSStaffById(id);
        return staffDto.isPresent()
                ? ResponseEntity.ok(staffDto.get())
                : ResponseEntity.status(404).body("Không tìm thấy nhân viên CSStaff có ID: " + id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCSStaff(@PathVariable Long id) {
        boolean deleted = csStaffService.deleteCSStaff(id);
        return deleted
                ? ResponseEntity.ok("Đã xóa nhân viên có ID: " + id)
                : ResponseEntity.status(404).body("Không tìm thấy nhân viên để xóa");
    }

    @GetMapping("/me/bookings")
    public ResponseEntity<List<BookingDto>> getBookingsForStaffStation() {
        User user = getCurrentUser();
        return ResponseEntity.ok(bookingService.getAllBookingsForStation(user));
    }

    @PostMapping("/me/bookings/{bookingId}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam BookingStatus newStatus) {

        try {
            User user = getCurrentUser();
            BookingDto updatedBooking = bookingService.updateBookingStatus(user, bookingId, newStatus);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof User)) {
            throw new RuntimeException("Không thể xác định người dùng đang đăng nhập.");
        }
        return (User) authentication.getPrincipal();
    }
}