package demo.controllers;

import demo.service.DeviceService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/device")
public class DeviceController {
    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping("/get-all-by-date")
    public List<Double> getAllByDate(@RequestParam Long id, @RequestParam LocalDate date) {
        return deviceService.getAllByDay(id, date);
    }
}
