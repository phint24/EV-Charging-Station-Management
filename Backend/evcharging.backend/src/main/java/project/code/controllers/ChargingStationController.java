package project.code.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.code.model.ChargingStation;
import project.code.services.ChargingStationService;

import java.util.List;

@RestController
@RequestMapping("/api/charging-stations")
@CrossOrigin(origins = "*")
public class ChargingStationController {

    @Autowired
    private ChargingStationService service;

    @GetMapping
    public List<ChargingStation> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChargingStation> getById(@PathVariable String id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ChargingStation create(@RequestBody ChargingStation station) {
        return service.create(station);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChargingStation> update(@PathVariable String id, @RequestBody ChargingStation newStation) {
        try {
            return ResponseEntity.ok(service.update(id, newStation));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ChargingStation> updateStatus(@PathVariable String id, @RequestParam String status) {
        try {
            return ResponseEntity.ok(service.updateStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
