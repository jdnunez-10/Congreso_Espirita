package eeoc.congreso_espirita.Services;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import eeoc.congreso_espirita.DTOS.ReserveTicketRequestDTO;
import eeoc.congreso_espirita.DTOS.ReserveTicketResponseDTO;
import eeoc.congreso_espirita.Entity.Event;
import eeoc.congreso_espirita.Entity.Ticket;
import eeoc.congreso_espirita.Entity.User;
import eeoc.congreso_espirita.Repository.EventRepository;
import eeoc.congreso_espirita.Repository.TicketRepository;
import eeoc.congreso_espirita.Repository.UserRepository;
import eeoc.congreso_espirita.enums.EnumTicketStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class TicketService {
 
    // Duración del bloqueo temporal en minutos — debe coincidir con el frontend
    private static final int RESERVATION_MINUTES = 14;
 
    private final TicketRepository ticketRepository;
    private final EventRepository  eventRepository;
    private final UserRepository   userRepository;
 
    // ─── HU-2.1: Reserva temporal ────────────────────────────────────────────
 
    /**
     * Crea una reserva temporal de boleto (status = RESERVED).
     *
     * Flujo:
     *  1. Verifica que el evento existe
     *  2. Verifica stock disponible con lock (evita sobreventa)
     *  3. Crea el Ticket en RESERVED con reservedUntil = now + 15 min
     *  4. Retorna ticketId + reservedUntil al frontend para el countdown
     *
     * @throws IllegalStateException si no hay cupos disponibles (→ HTTP 409)
     */
    @Transactional
public ReserveTicketResponseDTO reserveTicket(ReserveTicketRequestDTO request, String userId) {
    Event event = eventRepository.findById(request.getEventId())
            .orElseThrow(() -> new IllegalArgumentException(
                    "Evento no encontrado: " + request.getEventId()));

    // TODO: reemplazar cuando Auth esté implementado
    // User user = userRepository.findById(userId)...
    // ticket.setUser(user);

    long active = ticketRepository.countActiveTickets(request.getEventId(), LocalDateTime.now());
    int available = event.getTotalCapacity() - (int) active;

    if (available < request.getQuantity()) {
        throw new IllegalStateException("Sin cupos disponibles");
    }

    LocalDateTime reservedUntil = LocalDateTime.now().plusMinutes(RESERVATION_MINUTES);

    Ticket ticket = Ticket.builder()
            .id(UUID.randomUUID().toString())
            .event(event)
            .user(null)          // ← null temporalmente hasta tener Auth
            .attendeeName(request.getAttendeeName())
            .attendeeEmail(request.getAttendeeEmail())
            .status(EnumTicketStatus.RESERVED)
            .reservedUntil(reservedUntil)
            .priceAtPurchase(event.getTicketPrice())
            .currency(event.getCurrency())
            .build();

    ticketRepository.save(ticket);

    return new ReserveTicketResponseDTO(ticket.getId(), reservedUntil, "RESERVED");
}
 
    // ─── HU-2.1: Liberación manual ───────────────────────────────────────────
 
    /**
     * Libera una reserva activa cuando el usuario abandona el flujo.
     * Llamado por DELETE /api/tickets/:ticketId/release desde el frontend
     * (evento beforeunload o timeout del timer).
     *
     * Solo cancela si el ticket sigue en RESERVED — no toca PAID ni CANCELLED.
     */
    @Transactional
    public void releaseReservation(String ticketId) {
        ticketRepository.findById(ticketId).ifPresent(ticket -> {
            if (ticket.getStatus() == EnumTicketStatus.RESERVED) {
                ticket.setStatus(EnumTicketStatus.CANCELLED);
                ticket.setReservedUntil(null);
                ticketRepository.save(ticket);
                log.info("Reserva liberada manualmente: ticketId={}", ticketId);
            }
        });
    }
 
    // ─── @Scheduled: Limpieza automática ───
 
    /**
     * Libera todas las reservas expiradas cada 60 segundos.
     
     */
    @Scheduled(fixedRate = 60_000) // cada 60 segundos
    @Transactional
    public void releaseExpiredReservations() {
        int released = ticketRepository.cancelExpiredReservations(LocalDateTime.now());
        if (released > 0) {
            log.info("Reservas expiradas liberadas automáticamente: {}", released);
        }
    }
}