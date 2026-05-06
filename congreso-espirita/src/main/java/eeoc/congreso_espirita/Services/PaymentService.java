package eeoc.congreso_espirita.Services;

import eeoc.congreso_espirita.DTOS.ConfirmPaymentRequestDTO;
import eeoc.congreso_espirita.DTOS.PaymentResponseDTO;
import eeoc.congreso_espirita.DTOS.SimulatedPaymentRequestDTO;
import eeoc.congreso_espirita.Entity.Payment;
import eeoc.congreso_espirita.Entity.Ticket;
import eeoc.congreso_espirita.Repository.PaymentRepository;
import eeoc.congreso_espirita.Repository.TicketRepository;
import eeoc.congreso_espirita.enums.EnumPaymentStatus;
import eeoc.congreso_espirita.enums.EnumTicketStatus;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {


    private final PaymentRepository paymentRepository;
    private final TicketRepository  ticketRepository;
    private final EmailService      emailService;     // ← Módulo 4

    // ─── Módulo 3 DEV: Pago simulado ─────────────────────────────────────────

    /**
     * Simula un pago exitoso o fallido para desarrollo.
     *
     * Flujo:
     *  1. Busca el ticket por ID y valida que esté en RESERVED
     *  2. Crea un Payment con externalReference simulado
     *  3. Si simulatedResult="success" → PAID + genera qrToken
     *     Si simulatedResult="failure" → FAILED + ticket vuelve a CANCELLED
     *
     * TODO Módulo 3 PROD: eliminar este método y usar confirmPayment()
     * que recibe el webhook real de Stripe/BAC.
     */
    @Transactional
    public PaymentResponseDTO simulatePayment(SimulatedPaymentRequestDTO request) {
        Ticket ticket = getReservedTicket(request.getTicketId());

        boolean success = "success".equals(request.getSimulatedResult());

        // Referencia externa simulada — en prod vendrá de Stripe (pi_xxx) o BAC
        String externalReference = "SIM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        EnumPaymentStatus paymentStatus = success
                ? EnumPaymentStatus.SUCCESS
                : EnumPaymentStatus.FAILED;

        Payment payment = Payment.builder()
                .id(UUID.randomUUID().toString())
                .ticket(ticket)
                .externalReference(externalReference)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "SIMULATED")
                .amount(ticket.getPriceAtPurchase())
                .status(paymentStatus)
                .rawResponse("{\"simulated\": true, \"result\": \"" + request.getSimulatedResult() + "\"}")
                .createdAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        if (success) {
            activateTicket(ticket);
            emailService.sendTicketEmail(ticket); // ← Módulo 4: envío async
            log.info("Pago simulado exitoso: ticketId={}, paymentId={}", ticket.getId(), payment.getId());
        } else {
            cancelTicket(ticket);
            log.warn("Pago simulado fallido: ticketId={}", ticket.getId());
        }

        return PaymentResponseDTO.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .method(payment.getPaymentMethod())
                .build();
    }

    // ─── Módulo 3 PROD: Webhook real de Stripe / BAC ─────────────────────────

    /**
     * Confirma un pago recibido por webhook de la pasarela real.
     *
     * TODO Módulo 3 producción — pasos a implementar:
     *  1. Validar firma del webhook:
     *     String sig = request.getHeader("Stripe-Signature");
     *     Event event = Webhook.constructEvent(payload, sig, endpointSecret);
     *  2. Extraer PaymentIntent del evento y mapear al ConfirmPaymentRequestDTO
     *  3. Verificar idempotencia: si externalReference ya existe → ignorar
     *  4. Llamar a este método con los datos mapeados
     *
     * Por ahora el método está listo para recibir la confirmación
     * sin cambiar la lógica de negocio.
     */
    @Transactional
    public PaymentResponseDTO confirmPayment(ConfirmPaymentRequestDTO request) {
        // Idempotencia: si ya procesamos este pago, retornar el existente
        paymentRepository.findByExternalReference(request.getExternalReference())
                .ifPresent(existing -> {
                    throw new IllegalStateException(
                            "Pago ya procesado: " + request.getExternalReference());
                });

        Ticket ticket = getReservedTicket(request.getTicketId());

        boolean success = "SUCCESS".equalsIgnoreCase(request.getStatus());

        Payment payment = Payment.builder()
                .id(UUID.randomUUID().toString())
                .ticket(ticket)
                .externalReference(request.getExternalReference())
                .paymentMethod(request.getPaymentMethod())
                .amount(request.getAmount())
                .status(success ? EnumPaymentStatus.SUCCESS : EnumPaymentStatus.FAILED)
                .rawResponse(request.getRawResponse())
                .createdAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        if (success) {
            activateTicket(ticket);
            emailService.sendTicketEmail(ticket); // ← Módulo 4
            log.info("Pago confirmado vía webhook: externalRef={}, ticketId={}",
                    request.getExternalReference(), ticket.getId());
        } else {
            cancelTicket(ticket);
            log.warn("Pago fallido vía webhook: externalRef={}, ticketId={}",
                    request.getExternalReference(), ticket.getId());
        }

        return PaymentResponseDTO.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .method(payment.getPaymentMethod())
                .build();
    }

    // ─── Helpers privados ─────────────────────────────────────────────────────

    /**
     * Busca el ticket y valida que esté en RESERVED y no expirado.
     * Lanza excepción si no cumple — el controller retorna 409.
     */
    private Ticket getReservedTicket(String ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Ticket no encontrado: " + ticketId));

        if (ticket.getStatus() != EnumTicketStatus.RESERVED) {
            throw new IllegalStateException(
                    "El ticket no está en estado RESERVED: " + ticket.getStatus());
        }

        if (ticket.getReservedUntil() != null &&
                ticket.getReservedUntil().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("La reserva ha expirado");
        }

        return ticket;
    }

    /**
     * Activa el ticket: RESERVED → PAID + genera qrToken único.
     * El qrToken es un UUID que el QR del PDF codifica.
     *
     * TODO Módulo 4: usar HMAC-SHA256 firmado con clave secreta
     * para que el qrToken sea verificable sin consultar la BD.
     */
    private void activateTicket(Ticket ticket) {
        ticket.setStatus(EnumTicketStatus.PAID);
        ticket.setReservedUntil(null);
        ticket.setQrToken(UUID.randomUUID().toString()); // TODO: firmar con HMAC
        ticketRepository.save(ticket);
    }

    /** Cancela el ticket cuando el pago falla. */
    private void cancelTicket(Ticket ticket) {
        ticket.setStatus(EnumTicketStatus.CANCELLED);
        ticket.setReservedUntil(null);
        ticketRepository.save(ticket);
    }
}