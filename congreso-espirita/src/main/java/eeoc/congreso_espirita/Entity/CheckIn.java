package eeoc.congreso_espirita.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "check_ins", 
uniqueConstraints = @UniqueConstraint(columnNames = {"ticket_id", "day_number"}))
@Getter
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class CheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @Column(name = "day_number", nullable = false)
    private Integer dayNumber;

    @ManyToOne
    @JoinColumn(name = "scanned_by")
    private User scannedBy;

    @Column(name = "scanned_at")
    private LocalDateTime scannedAt;
}