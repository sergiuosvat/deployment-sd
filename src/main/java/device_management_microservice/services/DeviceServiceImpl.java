package device_management_microservice.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import device_management_microservice.dtos.DeviceData;
import device_management_microservice.entities.ChangeLog;
import device_management_microservice.repositories.ChangeLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import device_management_microservice.dtos.DeviceDTO;
import device_management_microservice.dtos.builders.DeviceBuilder;
import device_management_microservice.entities.Device;
import device_management_microservice.repositories.DeviceRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DeviceServiceImpl implements DeviceService{
    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceServiceImpl.class);
    private final DeviceRepository deviceRepository;
    private final ChangeLogRepository changeLogRepository;
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    public DeviceServiceImpl(DeviceRepository deviceRepository, ChangeLogRepository changeLogRepository, RabbitTemplate rabbitTemplate) {
        this.deviceRepository = deviceRepository;
        this.changeLogRepository = changeLogRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    private void deviceNotFoundError(Long id) throws Exception {
        LOGGER.error("Device with id {} was not found in db", id);
        throw new Exception(Device.class.getSimpleName() + " with id: " + id);
    }

    public List<DeviceDTO> findDevices() {
        List<Device> deviceList = deviceRepository.findAll();
        return deviceList.stream()
                .map(DeviceBuilder::toDeviceDTO)
                .collect(Collectors.toList());
    }

    public DeviceDTO findDeviceById(Long id) throws Exception {
        Optional<Device> deviceOptional = deviceRepository.findById(id);
        if (deviceOptional.isEmpty()) {
            deviceNotFoundError(id);
            return null;
        }
        return DeviceBuilder.toDeviceDTO(deviceOptional.get());
    }

    public Long insert(DeviceDTO deviceDTO) {
        Device device = DeviceBuilder.toEntity(deviceDTO);
        device = deviceRepository.save(device);
        LOGGER.debug("Device with id {} was inserted in db", device.getId());
        return device.getId();
    }

    public Long update(Long id, DeviceDTO deviceDTO) throws Exception {
        Optional<Device> deviceOptional = deviceRepository.findById(id);
        if (deviceOptional.isEmpty()) {
            deviceNotFoundError(id);
            return null;
        }
        Device device = deviceOptional.get();
        if(!Objects.equals(deviceDTO.getConsumption(), device.getConsumption())){
            DeviceData deviceData = new DeviceData("update",device.getId(), deviceDTO.getConsumption());
            String message = objectMapper.writeValueAsString(deviceData);
            rabbitTemplate.convertAndSend("topic_exchange","device.sensor.consumption", message);
        }
        device.setDescription(deviceDTO.getDescription());
        device.setAddress(deviceDTO.getAddress());
        device.setConsumption(deviceDTO.getConsumption());
        device = deviceRepository.save(device);
        LOGGER.debug("Device with id {} was updated in db", device.getId());
        return device.getId();
    }

    public void sendDeleteMessage(Long id) throws JsonProcessingException {
        DeviceData deviceData = new DeviceData("delete",id, 0L);
        String message = objectMapper.writeValueAsString(deviceData);
        rabbitTemplate.convertAndSend("topic_exchange","device.sensor.consumption", message);
    }

    public void delete(Long id) throws Exception {
        Optional<Device> deviceOptional = deviceRepository.findById(id);
        if (deviceOptional.isEmpty()) {
            deviceNotFoundError(id);
        }
        deviceRepository.deleteById(id);
        sendDeleteMessage(id);
        LOGGER.debug("Device with id {} was deleted from db", id);
    }

    public void deleteByUserId(Long userId) throws JsonProcessingException {
        List<Device> deviceList = deviceRepository.findByUserID(userId);
        if (deviceList.isEmpty()) {
            LOGGER.error("Devices with user id {} were not found in db", userId);
            return;
        }
        String previousState;
        try{
            previousState = objectMapper.writeValueAsString(deviceList);
        } catch (Exception e){
            LOGGER.error("Error while converting device list to json", e);
            return;
        }
        for (Device device : deviceList) {
            deviceRepository.deleteById(device.getId());
            sendDeleteMessage(device.getId());
        }
        ChangeLog log = new ChangeLog(
                userId,
                "DELETE",
                LocalDateTime.now(),
                previousState,
                ""
        );
        LOGGER.debug("Devices with user id {} were deleted from db", userId);
        changeLogRepository.save(log);
    }

    public void restoreDevicesByUserId(Long userId) {
        List<ChangeLog> logs = changeLogRepository.findByUserIdOrderByTimestampDesc(userId);
        Optional<ChangeLog> deleteLogOpt = logs.stream()
                .filter(log -> "DELETE".equals(log.getOperation()))
                .findFirst();

        if (deleteLogOpt.isPresent()) {
            ChangeLog deleteLog = deleteLogOpt.get();
            List<Device> devices;
            try {
                devices = objectMapper.readValue(deleteLog.getPreviousState(),
                        objectMapper.getTypeFactory().constructCollectionType(List.class, Device.class));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to deserialize devices from log", e);
            }
            deviceRepository.saveAll(devices);
        } else {
            throw new RuntimeException("No deletion log found for user " + userId);
        }
    }

}
