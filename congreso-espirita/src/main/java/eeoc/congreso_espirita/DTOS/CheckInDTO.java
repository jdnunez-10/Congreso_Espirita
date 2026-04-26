package eeoc.congreso_espirita.DTOS;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckInDTO {
    
    private String qrToken;
    private Integer dayNumber;
}
