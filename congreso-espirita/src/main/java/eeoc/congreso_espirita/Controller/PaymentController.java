package eeoc.congreso_espirita.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eeoc.congreso_espirita.DTOS.ConfirmPaymentRequestDTO;
import eeoc.congreso_espirita.DTOS.PaymentResponseDTO;
import eeoc.congreso_espirita.DTOS.SimulatedPaymentRequestDTO;
import eeoc.congreso_espirita.Services.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    
    private final PaymentService paymentService;
 
    // ─── DEV: Pago simulado ───────────────────────────────────────────────────
 
    /**
     * POST /api/payments/simulate
     *
     * Solo disponible en desarrollo — simula éxito o fallo del pago.
     * El frontend envía { ticketId, simulatedResult: "success"|"failure" }
     *
     * Respuestas:
     *  200 → { id, amount, status: "SUCCESS", method }
     *  409 → { error: "El ticket no está en RESERVED" | "Reserva expirada" }
     *  404 → { error: "Ticket no encontrado" }
     *
     * TODO: proteger con @Profile("dev") cuando configures los perfiles de Spring
     */
    @PostMapping("/simulate")
    public ResponseEntity<?> simulate(
            @Valid @RequestBody SimulatedPaymentRequestDTO request) {
        try {
            PaymentResponseDTO response = paymentService.simulatePayment(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        }
    }
 
    // ─── PROD: Webhook de pasarela real ───────────────────────────────────────
 
    /**
     * POST /api/payments/webhook
     *
     * Recibe la confirmación de pago de Stripe o BAC Credomatic.
     * Este endpoint NO requiere autenticación de usuario —
     * la seguridad viene de la validación de la firma del webhook.
     *
     * TODO Módulo 3 producción:
     *  1. Leer header "Stripe-Signature" o equivalente de BAC
     *  2. Validar firma antes de procesar (evitar webhooks falsos)
     *  3. Responder 200 rápido — Stripe reintenta si no recibe respuesta
     *
     * Stripe espera respuesta en < 30 segundos.
     * Si la lógica es lenta, procesar en @Async o cola de mensajes.
     */
    @PostMapping("/webhook")
    public ResponseEntity<?> webhook(
            @RequestBody ConfirmPaymentRequestDTO request
            // TODO: @RequestHeader("Stripe-Signature") String stripeSignature
    ) {
        try {
            PaymentResponseDTO response = paymentService.confirmPayment(request);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            // Pago duplicado o ticket en estado incorrecto
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
