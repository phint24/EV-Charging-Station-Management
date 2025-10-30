package project.code.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.code.model.ChargingPoint;
import project.code.model.ChargingStation;
import project.code.repository.ChargingPointRepository;
import project.code.repository.ChargingStationRepository;

import project.code.dto.chargingpoint.ChargingPointDto;
import project.code.dto.chargingpoint.CreateChargingPointRequest;
import project.code.dto.chargingpoint.UpdateChargingPointRequest;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChargingPointService {

    private final ChargingPointRepository chargingPointRepository;
    private final ChargingStationRepository chargingStationRepository;

    @Transactional(readOnly = true)
    public List<ChargingPointDto> getAll() {
        return chargingPointRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ChargingPointDto> getById(Long id) {
        return chargingPointRepository.findById(id)
                .map(this::mapToDto);
    }

    @Transactional
    public ChargingPointDto create(CreateChargingPointRequest request) {
        ChargingStation station = chargingStationRepository.findById(request.stationId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Trạm sạc (ChargingStation) với ID: " + request.stationId()));

        ChargingPoint cp = ChargingPoint.builder()
                .station(station) // Gán trạm
                .type(request.type())
                .power(request.power())
                .status(request.status())
                .build();

        ChargingPoint savedCp = chargingPointRepository.save(cp);
        return mapToDto(savedCp);
    }

    @Transactional
    public ChargingPointDto update(Long id, UpdateChargingPointRequest request) {
        ChargingPoint cp = chargingPointRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy ChargingPoint ID: " + id));

        if (request.type() != null) cp.setType(request.type());
        if (request.power() != null) cp.setPower(request.power());
        if (request.status() != null) cp.setStatus(request.status());

        ChargingPoint updatedCp = chargingPointRepository.save(cp);
        return mapToDto(updatedCp);
    }

    @Transactional
    public void delete(Long id) {
        if (!chargingPointRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy ChargingPoint ID: " + id);
        }
        // (Bạn cũng nên giảm số lượng 'totalChargingPoint' trong ChargingStation tại đây)
        chargingPointRepository.deleteById(id);
    }

    private ChargingPointDto mapToDto(ChargingPoint cp) {
        return new ChargingPointDto(
                cp.getChargingPointId(),
                cp.getStation().getStationId(), // Lấy ID của trạm cha
                cp.getType(),
                cp.getPower(),
                cp.getStatus()
        );
    }
}