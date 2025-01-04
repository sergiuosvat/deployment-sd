package demo.repository;

import demo.entities.MaxConsumption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsumptionRepository extends JpaRepository<MaxConsumption, Long> {
    MaxConsumption findByDeviceId(Long device_id);
    void deleteByDeviceId(Long deviceId);
}
