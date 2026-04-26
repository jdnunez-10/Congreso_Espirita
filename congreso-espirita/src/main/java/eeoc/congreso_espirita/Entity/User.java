package eeoc.congreso_espirita.Entity;

import java.time.LocalDateTime;
import java.util.List;

import eeoc.congreso_espirita.enums.EnumProvider;
import eeoc.congreso_espirita.enums.EnumRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor 
public class User {

    @Id
    @Column(length = 30)
    private String id;

    @Column(nullable = false, unique = true, length = 191)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(name = "password_hash")
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnumProvider provider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnumRole role;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user")
    private List<Ticket> tickets;
}
