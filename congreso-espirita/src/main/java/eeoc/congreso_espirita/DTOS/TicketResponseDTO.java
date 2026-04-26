package eeoc.congreso_espirita.DTOS;

import java.math.BigDecimal;

import eeoc.congreso_espirita.enums.EnumTicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponseDTO {
    
    private String id;
    private String qrToken;
    private EnumTicketStatus status;
    private BigDecimal price;
    private String currency;
}
