package eeoc.congreso_espirita.DTOS;



import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * Body de POST /api/tickets/reserve
 * Enviado por el frontend al completar el formulario del asistente (Paso 2).
 */
@Getter
@Setter
public class ReserveTicketRequestDTO {

    @NotBlank(message = "El ID del evento es requerido")
    private String eventId;

    @NotBlank(message = "El nombre del asistente es requerido")
    private String attendeeName;

    @NotBlank(message = "El correo del asistente es requerido")
    @Email(message = "Formato de correo inválido")
    private String attendeeEmail;

    @NotNull
    @Min(value = 1, message = "Debe reservar al menos 1 boleto")
    private Integer quantity;
}