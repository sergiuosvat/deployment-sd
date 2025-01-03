package user_management_microservice.dtos.builders;

import user_management_microservice.dtos.PersonDTO;
import user_management_microservice.entities.Person;

public class PersonBuilder {

    private PersonBuilder() {
    }

    public static PersonDTO toPersonDTO(Person person) {
        return new PersonDTO(person.getId(), person.getName(), person.getRole(), person.getUsername(), person.getPassword());
    }

    public static Person toEntity(PersonDTO personDTO) {
        return new Person(
                personDTO.getUsername(),
                personDTO.getPassword(),
                personDTO.getName(),
                personDTO.getRole()
        );
    }
}
