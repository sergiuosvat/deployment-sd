package demo.entities;

import lombok.Data;
import lombok.ToString;


@Data
@ToString
public class DeviceMeasurement {
    private Long timestamp;
    private Long deviceId;
    private Double measurement_value;
}
