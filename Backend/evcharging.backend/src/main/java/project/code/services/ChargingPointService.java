package project.code.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.code.model.ChargingPoint;
import project.code.repository.ChargingPointRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ChargingPointService {

    @Autowired
    private ChargingPointRepository repository;

    public List<ChargingPoint> getAll() {
        return repository.findAll();
    }

    public Optional<ChargingPoint> getById(Long id) {
        return repository.findById(id);
    }

    public ChargingPoint save(ChargingPoint cp) {
        return repository.save(cp);
    }

    public ChargingPoint update(Long id, ChargingPoint newCP) {
        return repository.findById(id)
                .map(cp -> {
                    cp.setType(newCP.getType());
                    cp.setPower(newCP.getPower());
                    cp.setStatus(newCP.getStatus());
                    return repository.save(cp);
                }).orElseThrow(() -> new RuntimeException("Không tìm thấy ChargingPoint ID: " + id));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}

