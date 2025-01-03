package user_management_microservice.services;

import user_management_microservice.dtos.PersonDTO;

import java.util.List;

public interface PersonService {
    List<PersonDTO> findPersons();
    PersonDTO findPersonById(Long id) throws Exception;
    Long insert(PersonDTO personDTO);
    Long update(Long id, PersonDTO personDTO) throws Exception;
    void delete(Long id) throws Exception;
}
