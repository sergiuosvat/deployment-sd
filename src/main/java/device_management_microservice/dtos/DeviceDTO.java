package device_management_microservice.dtos;

import lombok.*;

@Data
@AllArgsConstructor
public class DeviceDTO {
    private Long id;
    private String description;
    private String address;
    private Long consumption;
    private Long userID;

}
