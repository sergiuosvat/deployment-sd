package demo;

import demo.entities.MaxConsumption;
import demo.repository.ConsumptionRepository;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableRabbit
public class MonitoringAndCommunicationMicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(MonitoringAndCommunicationMicroserviceApplication.class, args);
	}

	@Bean
	public CommandLineRunner dataLoader(ConsumptionRepository maxConsumptionRepository)
	{
		return args -> {
			if (maxConsumptionRepository.count() > 0) {
				return;
			}
			MaxConsumption consumption = new MaxConsumption();
			consumption.setDeviceId(1L);
			consumption.setMaximum_consumption((double) 10);

			MaxConsumption consumption2 = new MaxConsumption();
			consumption2.setDeviceId(2L);
			consumption2.setMaximum_consumption((double) 200);

			maxConsumptionRepository.save(consumption);
			maxConsumptionRepository.save(consumption2);
		};
	}
}
