package eeoc.congreso_espirita.Entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import eeoc.congreso_espirita.enums.EnumPaymentStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payments")
@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @Column(name = "external_reference", nullable = false, length = 191)
    private String externalReference;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnumPaymentStatus status;

    @Column(name = "raw_response", columnDefinition = "json")
    private String rawResponse;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}