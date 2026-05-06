package eeoc.congreso_espirita.Controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eeoc.congreso_espirita.DTOS.ReserveTicketRequestDTO;
import eeoc.congreso_espirita.DTOS.ReserveTicketResponseDTO;
import eeoc.congreso_espirita.Services.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {
 
    private final TicketService ticketService;
 
    /**
     * POST /api/tickets/reserve
     *
     * Crea una reserva temporal (RESERVED, 15 min).
     * Requiere usuario autenticado — el userId viene del Principal (JWT/sesión).
     */
    @PostMapping("/reserve")
public ResponseEntity<?> reserve(
        @Valid @RequestBody ReserveTicketRequestDTO request) {  // ← quita Principal

    // TODO: reemplazar por JWT cuando implementes Auth
    String userId = "user-dev-001";

    try {
        ReserveTicketResponseDTO response = ticketService.reserveTicket(request, userId);
        return ResponseEntity.ok(response);
    } catch (IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", e.getMessage()));
    }
}
 
    /**
     * DELETE /api/tickets/:ticketId/release
     *
     * Libera una reserva activa cuando el usuario abandona el flujo de pago.
     * Llamado por el frontend en el evento beforeunload o cuando el timer llega a 0.
     *
     * 204: reserva liberada (o ya estaba vencida — idempotente)
     */
    @DeleteMapping("/{ticketId}/release")
    public ResponseEntity<Void> release(@PathVariable String ticketId) {
        ticketService.releaseReservation(ticketId);
        return ResponseEntity.noContent().build(); // 204
    }
}