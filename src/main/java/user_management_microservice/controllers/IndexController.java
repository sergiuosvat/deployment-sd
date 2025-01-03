package user_management_microservice.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import user_management_microservice.dtos.LoginRequest;
import user_management_microservice.dtos.PersonDTO;
import user_management_microservice.dtos.builders.PersonBuilder;
import user_management_microservice.entities.AuthenticationResponse;
import user_management_microservice.services.AuthenticationService;


@RestController
@CrossOrigin
public class IndexController {
    private final AuthenticationService authenticationService;

    @GetMapping(value = "/")
    public String index() {
        return "User Management Microservice";
    }

    public IndexController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping(value = "/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authenticationService.authenticate(loginRequest));
    }

    @PostMapping(value = "/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody PersonDTO personDTO) {
        return ResponseEntity.ok(authenticationService.register(PersonBuilder.toEntity(personDTO)));
    }
}
