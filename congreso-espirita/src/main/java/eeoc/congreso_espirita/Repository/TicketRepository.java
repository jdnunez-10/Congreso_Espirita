package eeoc.congreso_espirita.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eeoc.congreso_espirita.Entity.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, String> {

    Optional<Ticket> findByQrToken(String qrToken);

    List<Ticket> findByUserId(String userId);
    
}
