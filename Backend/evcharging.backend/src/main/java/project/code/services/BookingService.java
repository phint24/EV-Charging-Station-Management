package project.code.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.code.model.*;
import project.code.model.enums.BookingStatus;
import project.code.repository.*;
import project.code.dto.booking.CreateBookingRequest;
import project.code.dto.booking.BookingDto;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ChargingPointRepository pointRepository;
    private final EVDriverRepository driverRepository;

    @Transactional
    public BookingDto createBooking(User currentUser, CreateBookingRequest request) {
        EVDriver driver = driverRepository.findByUserAccount(currentUser)
                .orElseThrow(() -> new EntityNotFoundException("Driver profile not found"));

        ChargingPoint point = pointRepository.findById(request.chargingPointId())
                .orElseThrow(() -> new EntityNotFoundException("Charging Point not found"));

        if (request.startTime().isAfter(request.endTime())) {
            throw new IllegalArgumentException("Thời gian kết thúc phải sau thời gian bắt đầu.");
        }

        boolean isOccupied = bookingRepository.existsOverlappingBooking(point, request.startTime(), request.endTime());
        if (isOccupied) {
            throw new IllegalStateException("Cổng sạc này đã được đặt trong khung giờ bạn chọn.");
        }

        Booking booking = Booking.builder()
                .driver(driver)
                .chargingPoint(point)
                .startTime(request.startTime())
                .endTime(request.endTime())
                .status(BookingStatus.PENDING)
                .build();

        return mapToDto(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getMyBookings(User currentUser) {
        EVDriver driver = driverRepository.findByUserAccount(currentUser).orElseThrow();
        return bookingRepository.findByDriver(driver).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingDto cancelBooking(User currentUser, Long bookingId) {
        EVDriver driver = driverRepository.findByUserAccount(currentUser)
                .orElseThrow(() -> new EntityNotFoundException("Driver profile not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy lịch đặt chỗ ID: " + bookingId));

        if (!booking.getDriver().getId().equals(driver.getId())) {
            throw new AccessDeniedException("Bạn không có quyền hủy lịch đặt chỗ này.");
        }

        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalStateException("Không thể hủy lịch đặt chỗ đã " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return mapToDto(bookingRepository.save(booking));
    }

    private BookingDto mapToDto(Booking b) {
        return new BookingDto(
                b.getId(),
                b.getDriver().getId(),
                b.getChargingPoint().getChargingPointId(),
                b.getChargingPoint().getStation().getName(),
                b.getStartTime(),
                b.getEndTime(),
                b.getStatus()
        );
    }
}