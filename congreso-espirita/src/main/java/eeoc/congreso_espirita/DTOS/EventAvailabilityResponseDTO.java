package eeoc.congreso_espirita.DTOS;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventAvailabilityResponseDTO {
    
    private int availableTickets;
    private BigDecimal ticketPrice;
    private String currency;
}
