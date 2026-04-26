package eeoc.congreso_espirita.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eeoc.congreso_espirita.Entity.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {
    
}
