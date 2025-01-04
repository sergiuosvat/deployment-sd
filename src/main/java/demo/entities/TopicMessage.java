package demo.entities;

import lombok.Data;

@Data
public class TopicMessage {
    private String type;
    private Long deviceId;
    private double newConsumption;
}
