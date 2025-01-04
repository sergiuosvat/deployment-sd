package demo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import demo.entities.*;
import demo.repository.ConsumptionRepository;
import demo.repository.DeviceRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class DeviceService {
    private static final AtomicInteger messageCounter = new AtomicInteger(0);
    private static LocalDate currentDay = LocalDate.now();
    private final DeviceRepository deviceRepository;
    private final ConsumptionRepository consumptionRepository;
    private final ObjectMapper jacksonObjectMapper;
    private Double previousConsumption = 0.0;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private HashMap<Long, Double> deviceMap;
    private final HashMap<Long, Boolean> alertMap = new HashMap<>();

    public DeviceService(DeviceRepository deviceRepository, ObjectMapper jacksonObjectMapper, ConsumptionRepository consumptionRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.deviceRepository = deviceRepository;
        this.jacksonObjectMapper = jacksonObjectMapper;
        this.consumptionRepository = consumptionRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    private void loadDeviceIds() {
        deviceMap = consumptionRepository.findAll().stream().collect(HashMap::new, (m, v) -> m.put(v.getDeviceId(), v.getMaximum_consumption()), HashMap::putAll);
    }

    private void sendAlertIfNecessary(Device device) {
        if (device.getHourly_consumption() > deviceMap.get(device.getDeviceId())) {
            if (alertMap.getOrDefault(device.getDeviceId(), false)) {
                return;
            }
            Alert alert = new Alert();
            alert.setAlert("Device with id " + device.getDeviceId() + " has exceeded the maximum consumption");
            simpMessagingTemplate.convertAndSend("/topic/alerts", alert);
            alertMap.put(device.getDeviceId(), true);
        } else {
            alertMap.put(device.getDeviceId(), false);
        }
    }

    @RabbitListener(queues = "sensor_data")
    public void receiveMessage(String message) {
        try {
            loadDeviceIds();
            DeviceMeasurement deviceMeasurement = jacksonObjectMapper.readValue(message, DeviceMeasurement.class);
            if (!deviceMap.containsKey(deviceMeasurement.getDeviceId())) {
                throw new Exception("Device not found");
            }
            Device device = new Device();
            device.setDeviceId(deviceMeasurement.getDeviceId());
            BigDecimal hourlyConsumption = new BigDecimal(deviceMeasurement.getMeasurement_value() - previousConsumption);
            device.setHourly_consumption(Double.valueOf(String.valueOf(hourlyConsumption.setScale(2, RoundingMode.HALF_UP))));
            sendAlertIfNecessary(device);
            if (messageCounter.incrementAndGet() == 25) {
                currentDay = currentDay.plusDays(1);
                messageCounter.set(0);
            }
            device.setDay(currentDay);
            deviceRepository.save(device);
            previousConsumption = deviceMeasurement.getMeasurement_value();
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    @RabbitListener(queues = "topic_queue")
    @Transactional
    public void receiveTopicMessage(String message) throws JsonProcessingException {
        TopicMessage topicMessage = jacksonObjectMapper.readValue(message, TopicMessage.class);
        switch (topicMessage.getType()) {
            case "delete":
                deviceRepository.deleteByDeviceId(topicMessage.getDeviceId());
                consumptionRepository.deleteByDeviceId(topicMessage.getDeviceId());
                break;
            case "update":
                MaxConsumption consumption = consumptionRepository.findByDeviceId(topicMessage.getDeviceId());
                if (consumption != null) {
                    consumption.setMaximum_consumption(topicMessage.getNewConsumption());
                    consumptionRepository.save(consumption);
                }
                break;
        }
    }

    public List<Double> getAllByDay(Long id, LocalDate day) {
        List<Device> devices = deviceRepository.findAllByDeviceIdAndDay(id ,day);
        return devices.stream().map(Device::getHourly_consumption).toList();
    }

}
