package eeoc.congreso_espirita.Entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import eeoc.congreso_espirita.enums.EnumTicketStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "qr_token", nullable = true, unique = true, length = 191)
    private String qrToken;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnumTicketStatus status;

    @Column(name = "price_at_purchase", nullable = false)
    private BigDecimal priceAtPurchase;

    @Column(nullable = false)
    private String currency;

    @Column(name = "reserved_until")
    private LocalDateTime reservedUntil;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "ticket")
    private List<Payment> payments;

    @Column(name = "attendee_name")
    private String attendeeName;

    @Column(name = "attendee_email")
    private String attendeeEmail;

    @OneToMany(mappedBy = "ticket")
    private List<CheckIn> checkIns;
}