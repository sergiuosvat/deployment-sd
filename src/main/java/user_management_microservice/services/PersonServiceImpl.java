package user_management_microservice.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import user_management_microservice.dtos.PersonDTO;
import user_management_microservice.dtos.builders.PersonBuilder;
import user_management_microservice.entities.Person;
import user_management_microservice.repositories.PersonRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PersonServiceImpl implements PersonService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PersonServiceImpl.class);
    private final PersonRepository personRepository;
    private final RestTemplate restTemplate;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public PersonServiceImpl(PersonRepository personRepository, RestTemplate restTemplate, PasswordEncoder passwordEncoder) {
        this.personRepository = personRepository;
        this.restTemplate = restTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    private void personNotFoundError(Long id) throws Exception {
        LOGGER.error("Person with id {} was not found in db", id);
        throw new Exception(Person.class.getSimpleName() + " with id: " + id);
    }

    public List<PersonDTO> findPersons() {
        List<Person> personList = personRepository.findAll();
        return personList.stream()
                .map(PersonBuilder::toPersonDTO)
                .collect(Collectors.toList());
    }

    public PersonDTO findPersonById(Long id) throws Exception {
        Optional<Person> personOptional = personRepository.findById(id);
        if (personOptional.isEmpty()) {
            personNotFoundError(id);
            return null;
        }
        return PersonBuilder.toPersonDTO(personOptional.get());
    }

    public Long insert(PersonDTO personDTO) {
        Person person = PersonBuilder.toEntity(personDTO);
        person.setPassword(passwordEncoder.encode(personDTO.getPassword()));
        person = personRepository.save(person);
        LOGGER.debug("Person with id {} was inserted in db", person.getId());
        return person.getId();
    }

    public Long update(Long id, PersonDTO personDTO) throws Exception {
        Optional<Person> personOptional = personRepository.findById(id);
        if (personOptional.isEmpty()) {
            personNotFoundError(id);
            return null;
        }
        Person person = personOptional.get();
        person.setName(personDTO.getName());
        person.setRole(personDTO.getRole());
        person.setUsername(personDTO.getUsername());
        person = personRepository.save(person);
        LOGGER.debug("Person with id {} was updated in db", person.getId());
        return person.getId();
    }

    public void delete(Long id) throws Exception {
        Optional<Person> personOptional = personRepository.findById(id);
        if (personOptional.isEmpty()) {
            personNotFoundError(id);
        }

        String url = "http://ds-2024-30243-osvat-sergiu-a-2-device-manager-1:8081/deviceapi/device/delete-by-user/" + id;
        ResponseEntity<Long> response = restTemplate.postForEntity(url, null, Long.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            LOGGER.debug("Devices belonging to user with id {} were deleted from db", response.getBody());
            try{
                personRepository.deleteById(id);
            } catch (Exception e) {
                LOGGER.error("Failed to delete person with id {} from db", id);
                String url2 = "http://ds-2024-30243-osvat-sergiu-a-2-device-manager-1:8081/deviceapi/device/restore-by-user/" + id;
                restTemplate.postForEntity(url2, null, Long.class);
                return;
            }
        } else {
            LOGGER.error("Failed to delete devices for user with id {}. HTTP Status: {}", id, response.getStatusCode());
            throw new RuntimeException("Failed to delete devices for user with id " + id);
        }

        LOGGER.debug("Person with id {} was deleted from db", id);
    }


}
