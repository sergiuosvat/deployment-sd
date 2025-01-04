package device_management_microservice.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Data
@NoArgsConstructor
public class Device implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "consumption", nullable = false)
    private Long consumption;

    @Column(name = "userID", nullable = false)
    private Long userID;

    public Device(String description, String address, Long consumption, Long userID) {
        this.description = description;
        this.address = address;
        this.consumption = consumption;
        this.userID = userID;
    }
}
