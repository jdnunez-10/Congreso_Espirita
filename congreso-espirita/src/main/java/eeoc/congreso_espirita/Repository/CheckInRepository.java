package eeoc.congreso_espirita.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eeoc.congreso_espirita.Entity.CheckIn;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, String> {

    Optional<CheckIn> findByTicketIdAndDayNumber(String ticketId, Integer dayNumber);
    
}
