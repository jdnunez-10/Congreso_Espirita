package eeoc.congreso_espirita.DTOS;

import lombok.Getter;
import lombok.Setter;
   
    /**
 * Body de POST /api/payments/webhook
 *
 * Este DTO modela el payload que enviará Stripe o BAC Credomatic
 * cuando un pago se confirme en producción.
 *
 * Stripe ejemplo:
 * {
 *   "externalReference": "pi_3Nxxx",   ← PaymentIntent ID
 *   "ticketId": "uuid-del-ticket",
 *   "status": "SUCCESS",
 *   "amount": 500.00,
 *   "paymentMethod": "CARD",
 *   "rawResponse": "{ ...json completo de Stripe... }"
 * }
 *
 * TODO Módulo 3 producción:
 *  - Validar firma del webhook (Stripe-Signature header)
 *  - Parsear el evento de Stripe con stripe-java SDK
 *  - Mapear los campos al formato de este DTO
 */
@Getter
@Setter
public class ConfirmPaymentRequestDTO {
    private String externalReference; // ID de Stripe/BAC
    private String ticketId;
    private String status;            // "SUCCESS" | "FAILED"
    private java.math.BigDecimal amount;
    private String paymentMethod;
    private String rawResponse;       // JSON completo de la pasarela
}
