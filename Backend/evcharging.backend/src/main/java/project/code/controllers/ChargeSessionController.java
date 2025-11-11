package project.code.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// (1) XÓA IMPORT MODEL
// import project.code.model.ChargeSession;
import project.code.services.ChargeSessionService;

// (2) IMPORT CÁC DTO CẦN THIẾT
import project.code.dto.session.ChargeSessionDto;
import project.code.dto.session.CreateChargeSessionRequest;
import project.code.dto.session.StopChargeSessionRequest;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/charge-sessions")
@RequiredArgsConstructor
public class ChargeSessionController {

    private final ChargeSessionService service;

    @GetMapping
    public ResponseEntity<List<ChargeSessionDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChargeSessionDto> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/start")
    public ResponseEntity<?> startSession(@Valid @RequestBody CreateChargeSessionRequest request) {
        try {
            ChargeSessionDto sessionDto = service.startSession(request);
            return ResponseEntity.status(201).body(sessionDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/stop")
    public ResponseEntity<?> stopSession(@PathVariable Long id,
                                         @Valid @RequestBody StopChargeSessionRequest request) {
        try {
            ChargeSessionDto sessionDto = service.stopSession(id, request);
            return ResponseEntity.ok(sessionDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok("Đã xóa ChargeSession ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}