package device_management_microservice.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import device_management_microservice.dtos.DeviceDTO;

import java.util.List;

public interface DeviceService {
    List<DeviceDTO> findDevices();
    DeviceDTO findDeviceById(Long id) throws Exception;
    Long insert(DeviceDTO deviceDTO);
    Long update(Long id, DeviceDTO deviceDTO) throws Exception;
    void delete(Long id) throws Exception;
    void deleteByUserId(Long userId) throws JsonProcessingException;
    void restoreDevicesByUserId(Long userId);
}
