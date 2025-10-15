package project.code.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.code.model.ChargingPoint;
import project.code.services.ChargingPointService;

import java.util.List;

@RestController
@RequestMapping("/api/charging-points")
@CrossOrigin(origins = "*")
public class ChargingPointController {

    @Autowired
    private ChargingPointService service;

    @GetMapping
    public List<ChargingPoint> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChargingPoint> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ChargingPoint create(@RequestBody ChargingPoint cp) {
        return service.save(cp);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChargingPoint> update(@PathVariable Long id, @RequestBody ChargingPoint cp) {
        try {
            ChargingPoint updated = service.update(id, cp);
            return ResponseEntity.ok(updated);
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
