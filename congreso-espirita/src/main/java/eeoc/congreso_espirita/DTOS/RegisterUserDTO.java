package eeoc.congreso_espirita.DTOS;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterUserDTO {
    
    private String email;
    private String name;
    private String password;
}
