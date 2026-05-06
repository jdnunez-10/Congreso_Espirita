// ─── Módulo 2: Reserva y Proceso de Compra ────────────────────────────────
// Configuración central. Cuando el Event venga del backend, EVENT_CONFIG
// se reemplazará por la respuesta de GET /api/events/:id

export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

// ID del evento activo — en producción vendrá de la URL o contexto
export const ACTIVE_EVENT_ID = import.meta.env.VITE_EVENT_ID ?? 'congreso-2026';

// Datos del evento (mock hasta que GET /api/events/:id esté disponible)
export const EVENT_CONFIG = {
  id: ACTIVE_EVENT_ID,
  name: 'Congreso Espírita Hondureño 2026',
  date: '14 y 15 de agosto, 2026',
  venue: 'Auditorio Central UNAH, Tegucigalpa',
  price: 850,        // HNL — vendrá de event.ticketPrice
  currency: 'HNL',
  serviceFee: 25,    // cargo fijo por transacción
  totalCapacity: 250,
};

// Duración de la reserva temporal en segundos (debe coincidir con backend)
export const RESERVATION_DURATION_SECS = 14 * 60; // 14 min

export const STEPS = [
  { id: 1, label: 'Boletos' },
  { id: 2, label: 'Datos'   },
  { id: 3, label: 'Pago'    },
  { id: 4, label: 'Listo'   },
];