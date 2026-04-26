package eeoc.congreso_espirita.DTOS;

import eeoc.congreso_espirita.enums.EnumRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    
    private String id;
    private String email;
    private String name;
    private EnumRole role;
}
