package eeoc.congreso_espirita.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import eeoc.congreso_espirita.Entity.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, String> {

    Optional<Ticket> findByQrToken(String qrToken);

    List<Ticket> findByUserId(String userId);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.event.id = :eventId " +
       "AND t.status IN ('RESERVED', 'PAID') " +
       "AND (t.status = 'PAID' OR t.reservedUntil > :now)")
long countActiveTickets(@Param("eventId") String eventId,
                        @Param("now") LocalDateTime now);



    @Modifying
    @Query("""
        UPDATE Ticket t 
        SET t.status = 'CANCELLED'
        WHERE t.status = 'RESERVED'
        AND t.reservedUntil < :now
    """)
    int cancelExpiredReservations(@Param("now") LocalDateTime now);
}
