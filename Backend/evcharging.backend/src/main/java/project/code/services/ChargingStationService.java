package project.code.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.code.model.ChargingStation;
import project.code.model.ChargingStation.StationStatus;
import project.code.repository.ChargingStationRepository;
import project.code.dto.station.ChargingStationDto;
import project.code.dto.station.CreateStationRequest;
import project.code.dto.station.UpdateStationRequest;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChargingStationService {

    private final ChargingStationRepository repository;

    @Transactional(readOnly = true)
    public List<ChargingStationDto> getAll() {
        return repository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ChargingStationDto> getById(Long id) {
        return repository.findById(id)
                .map(this::mapToDto);
    }

    @Transactional
    public ChargingStationDto create(CreateStationRequest request) {
        ChargingStation station = ChargingStation.builder()
                .name(request.name())
                .location(request.location())
                .status(request.status())
                .totalChargingPoint(request.totalChargingPoint())
                .availableChargers(request.availableChargers())
                .build();

        ChargingStation savedStation = repository.save(station);
        return mapToDto(savedStation);
    }

    @Transactional
    public ChargingStationDto update(Long id, UpdateStationRequest request) {
        ChargingStation station = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ChargingStation ID: " + id));

        station.setName(request.name());
        station.setLocation(request.location());
        station.setStatus(request.status());
        station.setTotalChargingPoint(request.totalChargingPoint());
        station.setAvailableChargers(request.availableChargers());

        ChargingStation updatedStation = repository.save(station);
        return mapToDto(updatedStation);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy ChargingStation ID để xóa: " + id);
        }
        repository.deleteById(id);
    }

    @Transactional
    public ChargingStationDto updateStatus(Long id, StationStatus status) {
        ChargingStation station = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ChargingStation không tồn tại: " + id));

        station.setStatus(status);
        ChargingStation updatedStation = repository.save(station);
        return mapToDto(updatedStation);
    }

    private ChargingStationDto mapToDto(ChargingStation station) {
        return new ChargingStationDto(
                station.getStationId(),
                station.getName(),
                station.getLocation(),
                station.getStatus(),
                station.getTotalChargingPoint(),
                station.getAvailableChargers()
        );
    }
}