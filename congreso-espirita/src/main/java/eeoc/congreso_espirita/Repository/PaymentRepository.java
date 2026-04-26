package eeoc.congreso_espirita.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eeoc.congreso_espirita.Entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    
    Optional<Payment> findByExternalReference(String externalReference);
}
