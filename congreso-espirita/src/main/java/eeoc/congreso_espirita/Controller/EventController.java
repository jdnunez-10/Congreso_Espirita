package eeoc.congreso_espirita.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eeoc.congreso_espirita.DTOS.EventAvailabilityResponseDTO;
import eeoc.congreso_espirita.Services.EventService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
 
    private final EventService eventService;
 
    /**
     * GET /api/events/:eventId/availability
     *
     * Consultado por el frontend en Step1Tickets para mostrar stock en tiempo real.
     * No requiere autenticación — es información pública del evento.
     *
     */
    @GetMapping("/{eventId}/availability")
    public ResponseEntity<EventAvailabilityResponseDTO> getAvailability(
            @PathVariable String eventId) {
        return ResponseEntity.ok(eventService.getAvailability(eventId));
    }
}