package project.code.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.code.model.ChargeSession;
import project.code.services.ChargeSessionService;

import java.util.List;

@RestController
@RequestMapping("/api/charge-sessions")
@CrossOrigin(origins = "*")
public class ChargeSessionController {

    @Autowired
    private ChargeSessionService service;

    @GetMapping
    public List<ChargeSession> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChargeSession> getById(@PathVariable String id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ChargeSession create(@RequestBody ChargeSession session) {
        return service.create(session);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChargeSession> update(@PathVariable String id, @RequestBody ChargeSession newSession) {
        try {
            return ResponseEntity.ok(service.update(id, newSession));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/stop")
    public ResponseEntity<ChargeSession> stopSession(@PathVariable String id) {
        try {
            return ResponseEntity.ok(service.stopSession(id));
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
