package project.code.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.code.model.*;
import project.code.model.enums.*;
import project.code.repository.*;

import project.code.dto.session.CreateChargeSessionRequest;
import project.code.dto.session.StopChargeSessionRequest;
import project.code.dto.session.ChargeSessionDto;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChargeSessionService {

    private final ChargeSessionRepository repository;
    private final EVDriverRepository evDriverRepository;
    private final VehicleRepository vehicleRepository;
    private final ChargingPointRepository chargingPointRepository;
    private final ChargingStationRepository stationRepository;

    @Transactional(readOnly = true)
    // (2) SỬA KIỂU TRẢ VỀ
    public List<ChargeSessionDto> getAll() {
        return repository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    // (2) SỬA KIỂU TRẢ VỀ
    public Optional<ChargeSessionDto> getById(Long id) {
        return repository.findById(id)
                .map(this::mapToDto);
    }

    @Transactional
    // (2) SỬA KIỂU TRẢ VỀ
    public ChargeSessionDto startSession(CreateChargeSessionRequest request) {

        EVDriver driver = evDriverRepository.findById(request.driverId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy EVDriver ID: " + request.driverId()));

        Vehicle vehicle = vehicleRepository.findById(request.vehicleId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Vehicle ID: " + request.vehicleId()));

        ChargingPoint point = chargingPointRepository.findById(request.chargingPointId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy ChargingPoint ID: " + request.chargingPointId()));

        if (point.getStatus() != ChargingPointStatus.AVAILABLE) {
            throw new IllegalStateException("Điểm sạc này không sẵn sàng");
        }

        point.setStatus(ChargingPointStatus.CHARGING);
        chargingPointRepository.save(point);

        ChargeSession session = ChargeSession.builder()
                .driver(driver)
                .vehicle(vehicle)
                .chargingPoint(point)
                .station(point.getStation())
                .startTime(LocalDateTime.now())
                .status(SessionStatus.ACTIVE)
                .energyUsed(0.0)
                .cost(0.0)
                .build();

        ChargeSession savedSession = repository.save(session);

        return mapToDto(savedSession);
    }

    @Transactional
    public ChargeSessionDto stopSession(Long sessionId, StopChargeSessionRequest request) {

        ChargeSession session = repository.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Session không tồn tại: " + sessionId));

        if (session.getStatus() != SessionStatus.ACTIVE) {
            throw new IllegalStateException("Phiên sạc không ở trạng thái ACTIVE.");
        }

        session.setEndTime(LocalDateTime.now());
        session.setStatus(SessionStatus.COMPLETED);
        session.setEnergyUsed(request.energyUsed());

        double cost = calculateCost(session);
        session.setCost(cost);

        ChargingPoint point = session.getChargingPoint();
        point.setStatus(ChargingPointStatus.AVAILABLE);
        chargingPointRepository.save(point);

        ChargeSession savedSession = repository.save(session);

        return mapToDto(savedSession);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy ChargeSession ID: " + id);
        }
        repository.deleteById(id);
    }

    private double calculateCost(ChargeSession session) {
        // TODO: Logic tính toán chi phí
        return session.getEnergyUsed() * 1.5;
    }

    private ChargeSessionDto mapToDto(ChargeSession session) {
        return new ChargeSessionDto(
                session.getSessionId(),
                session.getDriver().getId(),
                session.getVehicle().getId(),
                session.getChargingPoint().getChargingPointId(),
                session.getStation().getStationId(),
                session.getStartTime(),
                session.getEndTime(),
                session.getEnergyUsed(),
                session.getCost(),
                session.getStatus()
        );
    }
}