package user_management_microservice.dtos;

import lombok.Data;

@Data
public class PersonDTO{
    private Long id;
    private String username;
    private String password;
    private String name;
    private String role;

    public PersonDTO(Long id, String name, String role, String username, String password) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.username = username;
        this.password = password;
    }
}
