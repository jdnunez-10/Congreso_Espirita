package eeoc.congreso_espirita.Services;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import eeoc.congreso_espirita.DTOS.EventAvailabilityResponseDTO;
import eeoc.congreso_espirita.Entity.Event;
import eeoc.congreso_espirita.Repository.EventRepository;
import eeoc.congreso_espirita.Repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventService {
 
    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;
 
    /**
     * Calcula la disponibilidad real del evento en tiempo real.
     * Usado por GET /api/events/:eventId/availability
     *
     * El stock disponible = totalCapacity - activeTickets
     * donde activeTickets = PAID + RESERVED vigentes (reservedUntil > now)
     */
    public EventAvailabilityResponseDTO getAvailability(String eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado: " + eventId));
 
        long active = ticketRepository.countActiveTickets(eventId, LocalDateTime.now());
        int available = Math.max(0, event.getTotalCapacity() - (int) active);
 
        log.debug("Evento {}: capacidad={}, activos={}, disponibles={}",
                eventId, event.getTotalCapacity(), active, available);
 
        return new EventAvailabilityResponseDTO(available, event.getTicketPrice(), event.getCurrency());
    }
}
 