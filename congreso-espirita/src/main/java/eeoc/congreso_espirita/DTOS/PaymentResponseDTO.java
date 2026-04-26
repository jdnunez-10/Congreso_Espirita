package eeoc.congreso_espirita.DTOS;

import java.math.BigDecimal;

import eeoc.congreso_espirita.enums.EnumPaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentResponseDTO {
    
    private String id;
    private BigDecimal amount;
    private EnumPaymentStatus status;
    private String method;
}
