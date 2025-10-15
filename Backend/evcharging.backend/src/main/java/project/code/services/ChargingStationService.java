package project.code.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.code.model.ChargingStation;
import project.code.repository.ChargingStationRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ChargingStationService {

    @Autowired
    private ChargingStationRepository repository;

    public List<ChargingStation> getAll() {
        return repository.findAll();
    }

    public Optional<ChargingStation> getById(String id) {
        return repository.findById(id);
    }

    public ChargingStation create(ChargingStation station) {
        return repository.save(station);
    }

    public ChargingStation update(String id, ChargingStation newStation) {
        return repository.findById(id)
                .map(station -> {
                    station.setName(newStation.getName());
                    station.setLocation(newStation.getLocation());
                    station.setStatus(newStation.getStatus());
                    station.setTotalChargingPoint(newStation.getTotalChargingPoint());
                    station.setAvailableChargers(newStation.getAvailableChargers());
                    return repository.save(station);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ChargingStation ID: " + id));
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    public ChargingStation updateStatus(String id, String status) {
        ChargingStation station = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ChargingStation không tồn tại: " + id));
        station.updateStatus(status);
        return repository.save(station);
    }
}
