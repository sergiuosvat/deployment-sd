package user_management_microservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import user_management_microservice.entities.Person;
import user_management_microservice.repositories.PersonRepository;

import java.util.TimeZone;

@SpringBootApplication
@Validated
public class StartApplication extends SpringBootServletInitializer {
    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        SpringApplication.run(user_management_microservice.StartApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(user_management_microservice.StartApplication.class);
    }

    @Bean
    public CommandLineRunner dataLoader(PersonRepository personRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (personRepository.count() == 0) {
                Person person1 = new Person();
                person1.setId(1L);
                person1.setUsername("user");
                person1.setPassword(passwordEncoder.encode("123"));
                person1.setName("John Doe");
                person1.setRole("USER");

                Person person2 = new Person();
                person2.setId(2L);
                person2.setUsername("admin");
                person2.setPassword(passwordEncoder.encode("456"));
                person2.setName("Jane Doe");
                person2.setRole("ADMIN");

                personRepository.save(person1);
                personRepository.save(person2);
            }
        };
    }
}
