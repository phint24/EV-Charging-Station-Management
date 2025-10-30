package project.code.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project.code.services.ChargingPointService;

import project.code.dto.chargingpoint.ChargingPointDto;
import project.code.dto.chargingpoint.CreateChargingPointRequest;
import project.code.dto.chargingpoint.UpdateChargingPointRequest;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/charging-points")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ChargingPointController {

    private final ChargingPointService service;

    @GetMapping
    public ResponseEntity<List<ChargingPointDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChargingPointDto> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ChargingPointDto> create(@Valid @RequestBody CreateChargingPointRequest request) { // (5) Dùng DTO
        ChargingPointDto createdCp = service.create(request);
        return ResponseEntity.status(201).body(createdCp);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody UpdateChargingPointRequest request) { // (5) Dùng DTO
        try {
            ChargingPointDto updated = service.update(id, request);
            return ResponseEntity.ok(updated);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok("Đã xóa ChargingPoint ID: " + id);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}