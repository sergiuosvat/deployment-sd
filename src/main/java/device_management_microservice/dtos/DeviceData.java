package device_management_microservice.dtos;

import lombok.Data;

@Data
public class DeviceData {
    private String type;
    private Long deviceId;
    private double newConsumption;

    public DeviceData(String type, Long id, Long consumption) {
        this.type = type;
        this.deviceId = id;
        this.newConsumption = consumption;
    }
}
