package device_management_microservice.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "change_logs")
public class ChangeLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long userId;

    private String operation;

    private LocalDateTime timestamp;

    @Lob
    private String previousState;

    @Lob
    private String newState;

    public ChangeLog(Long userId, String delete, LocalDateTime now, String previousState, Object o) {
        this.userId = userId;
        this.operation = delete;
        this.timestamp = now;
        this.previousState = previousState;
        this.newState = o.toString();
    }

    public ChangeLog() {

    }
}
