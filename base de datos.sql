use congreso_espirita;

CREATE TABLE users (
    id CHAR(30) PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NULL,
    provider ENUM('GOOGLE', 'EMAIL') NOT NULL,
    role ENUM('USER', 'ADMIN', 'SCANNER') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- =========================================
-- TABLA: events (escalabilidad futura)
-- =========================================
CREATE TABLE events (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- TABLA: tickets
-- =========================================
CREATE TABLE tickets (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    event_id CHAR(36) NOT NULL,
    qr_token VARCHAR(191) NOT NULL UNIQUE,
    status ENUM('PENDING', 'PAID', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    price_at_purchase DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'HNL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tickets_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tickets_event FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_qr_token ON tickets(qr_token);

-- =========================================
-- TABLA: payments
-- =========================================
CREATE TABLE payments (
    id CHAR(36) PRIMARY KEY,
    ticket_id CHAR(36) NOT NULL,
    external_reference VARCHAR(191) NOT NULL,
    payment_method VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',
    raw_response JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_ticket FOREIGN KEY (ticket_id)
        REFERENCES tickets(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_payments_ticket_id ON payments(ticket_id);
CREATE INDEX idx_payments_external_reference ON payments(external_reference);

-- =========================================
-- TABLA: check_ins
-- =========================================
CREATE TABLE check_ins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id CHAR(36) NOT NULL,
    day_number INT NOT NULL,
    scanned_by CHAR(36),
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_checkins_ticket FOREIGN KEY (ticket_id)
        REFERENCES tickets(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_checkins_user FOREIGN KEY (scanned_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT unique_ticket_day UNIQUE (ticket_id, day_number)
);

CREATE INDEX idx_checkins_ticket_id ON check_ins(ticket_id);