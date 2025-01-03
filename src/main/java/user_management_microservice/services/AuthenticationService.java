package user_management_microservice.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import user_management_microservice.dtos.LoginRequest;
import user_management_microservice.entities.AuthenticationResponse;
import user_management_microservice.entities.Person;
import user_management_microservice.repositories.PersonRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final PersonRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(Person request){
        Person person = new Person();
        person.setUsername(request.getUsername());
        person.setName(request.getName());
        person.setPassword(passwordEncoder.encode(request.getPassword()));
        person.setRole("USER");
        person = userRepository.save(person);

        String token = jwtService.generateToken(person, person.getRole(), person.getId());
        return new AuthenticationResponse(token);
    }

    public AuthenticationResponse authenticate(LoginRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        Optional<Person> user = userRepository.findByUsername(request.getUsername());
        if (user.isPresent()){
            String token = jwtService.generateToken(user.get(), user.get().getRole(), user.get().getId());
            return new AuthenticationResponse(token);
        }
        return null;
    }


}
