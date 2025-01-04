package demo.repository;

import demo.entities.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    void deleteByDeviceId(Long device_id);
    List<Device> findAllByDeviceIdAndDay(Long id, LocalDate day);
}
