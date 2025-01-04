package device_management_microservice;

import device_management_microservice.entities.Device;
import device_management_microservice.repositories.DeviceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.validation.annotation.Validated;

import java.util.TimeZone;

@SpringBootApplication
@Validated
public class StartApplication extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(device_management_microservice.StartApplication.class);
    }

    public static void main(String[] args) {
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        SpringApplication.run(device_management_microservice.StartApplication.class, args);
    }

    @Bean
    public CommandLineRunner dataLoader(DeviceRepository deviceRepository) {
        return args -> {
            if (deviceRepository.count() == 0) {
                Device device1 = new Device(
                        "Device 1",
                        "Address 1",
                        10L,
                        1L
                );

                Device device2 = new Device(
                        "Device 2",
                        "Address 2",
                        200L,
                        2L
                );

                deviceRepository.save(device1);
                deviceRepository.save(device2);
            }
        };
    }
}
