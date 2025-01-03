package user_management_microservice.dtos;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
