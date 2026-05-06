package eeoc.congreso_espirita.DTOS;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SimulatedPaymentRequestDTO {
    
    @NotBlank(message = "El ticketId es requerido")
    private String ticketId;
 
    // Simulación: "success", "failure" — en prod esto no existe,
    // el resultado lo determina la pasarela vía webhook.
    @NotBlank
    @Pattern(regexp = "success|failure", message = "Debe ser 'success' o 'failure'")
    private String simulatedResult;
 
    // Método de pago seleccionado por el usuario en el frontend
    // En prod vendrá del paymentMethod de Stripe o BAC
    private String paymentMethod; // "CARD", "BAC", "TRANSFER"
}
