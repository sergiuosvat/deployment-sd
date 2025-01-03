package user_management_microservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import user_management_microservice.entities.Person;

import java.util.Optional;

public interface PersonRepository extends JpaRepository<Person, Long> {
    Optional<Person> findByUsername(String username);
}
