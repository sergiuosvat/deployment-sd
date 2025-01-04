package device_management_microservice.controllers;


import com.fasterxml.jackson.core.JsonProcessingException;
import device_management_microservice.services.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import device_management_microservice.dtos.DeviceDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin
@RequestMapping(value = "/device")
public class DeviceController {

    private final DeviceService deviceService;

    @Autowired
    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping(value = "/get-devices")
    public ResponseEntity<List<DeviceDTO>> getDevices() {
        List<DeviceDTO> dtos = deviceService.findDevices();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping(value = "/insert")
    public ResponseEntity<Long> insertPerson(@RequestBody DeviceDTO deviceDTO) {
        Long deviceID = deviceService.insert(deviceDTO);
        return new ResponseEntity<>(deviceID, HttpStatus.CREATED);
    }

    @GetMapping(value = "/get/{id}")
    public ResponseEntity<DeviceDTO> getDevice(@PathVariable("id") Long deviceId) throws Exception {
        DeviceDTO dto = deviceService.findDeviceById(deviceId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PostMapping(value = "/update/{id}")
    public ResponseEntity<Long> updateDevice(@PathVariable("id") Long deviceId, @RequestBody DeviceDTO deviceDTO) throws Exception {
        Long deviceID = deviceService.update(deviceId, deviceDTO);
        return new ResponseEntity<>(deviceID, HttpStatus.OK);
    }

    @PostMapping(value = "/delete/{id}")
    public ResponseEntity<Long> deleteDevice(@PathVariable("id") Long deviceId) throws Exception {
        deviceService.delete(deviceId);
        return new ResponseEntity<>(deviceId, HttpStatus.OK);
    }

    @PostMapping(value = "/delete-by-user/{user-id}")
    public ResponseEntity<Long> deleteDeviceByUserId(@PathVariable("user-id") Long userId) throws JsonProcessingException {
        deviceService.deleteByUserId(userId);
        return new ResponseEntity<>(userId, HttpStatus.OK);
    }

    @PostMapping(value = "/restore-by-user/{user-id}")
    public ResponseEntity<Void> restoreDeviceByUserId(@PathVariable("user-id") Long userId) {
        deviceService.restoreDevicesByUserId(userId);
        return ResponseEntity.ok().build();
    }

}
