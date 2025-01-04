package device_management_microservice.dtos.builders;

import device_management_microservice.dtos.DeviceDTO;
import device_management_microservice.entities.Device;

public class DeviceBuilder {

    private DeviceBuilder() {
    }

    public static DeviceDTO toDeviceDTO(Device device) {
        return new DeviceDTO(device.getId(), device.getDescription(), device.getAddress(), device.getConsumption(), device.getUserID());
    }

    public static Device toEntity(DeviceDTO deviceDTO) {
        return new Device(
                deviceDTO.getDescription(),
                deviceDTO.getAddress(),
                deviceDTO.getConsumption(),
                deviceDTO.getUserID()
        );
    }
}
