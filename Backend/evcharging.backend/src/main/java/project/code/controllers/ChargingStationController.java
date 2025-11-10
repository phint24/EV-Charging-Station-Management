package project.code.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.code.model.ChargingStation;
import project.code.model.ChargingStation.StationStatus;
import project.code.services.ChargingStationService;

import java.util.List;

@RestController
@RequestMapping("/api/charging-stations")
@RequiredArgsConstructor
public class ChargingStationController {

    private final ChargingStationService service;

    @GetMapping
    public List<ChargingStation> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChargingStation> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ChargingStation create(@RequestBody ChargingStation station) {
        return service.create(station);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChargingStation> update(@PathVariable Long id, @RequestBody ChargingStation newStation) {
        try {
            return ResponseEntity.ok(service.update(id, newStation));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ChargingStation> updateStatus(@PathVariable Long id,
                                                        @RequestParam StationStatus status) {
        try {
            return ResponseEntity.ok(service.updateStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}