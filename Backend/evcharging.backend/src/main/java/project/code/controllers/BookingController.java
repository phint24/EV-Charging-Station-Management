package project.code.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import project.code.model.User;
import project.code.services.BookingService;
import project.code.dto.booking.BookingDto;
import project.code.dto.booking.CreateBookingRequest;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EVDRIVER')")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        try {
            User user = getCurrentUser();
            return ResponseEntity.ok(bookingService.createBooking(user, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<List<BookingDto>> getMyBookings() {
        User user = getCurrentUser();
        return ResponseEntity.ok(bookingService.getMyBookings(user));
    }

    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId) {
        try {
            User user = getCurrentUser();
            BookingDto cancelledBooking = bookingService.cancelBooking(user, bookingId);
            return ResponseEntity.ok(cancelledBooking);
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