package eeoc.congreso_espirita.DTOS;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * Response de POST /api/tickets/reserve
 * El frontend usa ticketId para identificar la reserva y
 * reservedUntil para calcular el countdown exacto.
 */
@Getter
@AllArgsConstructor
public class ReserveTicketResponseDTO {
    private String ticketId;
    private LocalDateTime reservedUntil;
    private String status; // siempre "RESERVED"
}