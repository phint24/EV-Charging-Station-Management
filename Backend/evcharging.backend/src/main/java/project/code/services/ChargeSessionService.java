package project.code.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.code.model.ChargeSession;
import project.code.repository.ChargeSessionRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ChargeSessionService {

    @Autowired
    private ChargeSessionRepository repository;

    public List<ChargeSession> getAll() {
        return repository.findAll();
    }

    public Optional<ChargeSession> getById(String id) {
        return repository.findById(id);
    }

    public ChargeSession create(ChargeSession session) {
        session.startSession("Driver01", session.getChargingPointId());
         return repository.save(session);
    }
    
    public ChargeSession update(String id, ChargeSession newSession) {
        return repository.findById(id)
                .map(session -> {
                    session.setChargingPointId(newSession.getChargingPointId());
                    session.setStationId(newSession.getStationId());
                    session.setEnergyUsed(newSession.getEnergyUsed());
                    session.setCost(newSession.getCost());
                    session.setStatus(newSession.getStatus());
                    session.setEndTime(newSession.getEndTime());
                    return repository.save(session);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ChargeSession ID: " + id));
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    public ChargeSession stopSession(String id) {
        ChargeSession session = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session không tồn tại: " + id));
        session.endSession();
        return repository.save(session);
    }
}
