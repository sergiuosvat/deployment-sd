package device_management_microservice.repositories;

import device_management_microservice.entities.ChangeLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChangeLogRepository extends JpaRepository<ChangeLog, Long> {
    List<ChangeLog> findByUserIdOrderByTimestampDesc(Long entityId);
}
