package project.code.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.code.model.ChargingStation.StationStatus;
import project.code.services.ChargingStationService;

import project.code.dto.station.ChargingStationDto;
import project.code.dto.station.CreateStationRequest;
import project.code.dto.station.UpdateStationRequest;
import jakarta.validation.Valid; // Import Valid

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/charging-stations")
@RequiredArgsConstructor
public class ChargingStationController {

    private final ChargingStationService service;

    @GetMapping
    public ResponseEntity<List<ChargingStationDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChargingStationDto> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ChargingStationDto> create(@Valid @RequestBody CreateStationRequest request) {
        ChargingStationDto createdStation = service.create(request);
        return ResponseEntity.status(201).body(createdStation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChargingStationDto> update(@PathVariable Long id, @Valid @RequestBody UpdateStationRequest request) {
        try {
            ChargingStationDto updatedStation = service.update(id, request);
            return ResponseEntity.ok(updatedStation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ChargingStationDto> updateStatus(@PathVariable Long id,
                                                           @RequestParam StationStatus status) {
        try {
            ChargingStationDto updatedStation = service.updateStatus(id, status);
            return ResponseEntity.ok(updatedStation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}