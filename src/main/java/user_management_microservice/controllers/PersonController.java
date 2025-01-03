package user_management_microservice.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import user_management_microservice.dtos.PersonDTO;
import user_management_microservice.services.PersonService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(value = "/person")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping(value = "/get-persons")
    public ResponseEntity<List<PersonDTO>> getPersons() {
        List<PersonDTO> dtos = personService.findPersons();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping(value = "/insert")
    public ResponseEntity<Long> insertPerson(@RequestBody PersonDTO personDTO) {
        Long personID = personService.insert(personDTO);
        return new ResponseEntity<>(personID, HttpStatus.CREATED);
    }

    @GetMapping(value = "/get/{id}")
    public ResponseEntity<PersonDTO> getPerson(@PathVariable("id") Long personId) throws Exception {
        PersonDTO dto = personService.findPersonById(personId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PostMapping(value = "/update/{id}")
    public ResponseEntity<Long> updatePerson(@PathVariable("id") Long personId, @RequestBody PersonDTO personDTO) throws Exception {
        Long personID = personService.update(personId, personDTO);
        return new ResponseEntity<>(personID, HttpStatus.CREATED);
    }

    @PostMapping(value = "/delete/{id}")
    public ResponseEntity<Long> deletePerson(@PathVariable("id") Long personId) throws Exception {
        personService.delete(personId);
        return new ResponseEntity<>(personId, HttpStatus.OK);
    }

}
