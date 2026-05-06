// ─── Módulo 2 + 3: API Layer ─────────────────────────────────────────────
// Toda la comunicación con Spring Boot pasa por aquí.
// El frontend nunca llama a fetch() directamente desde los componentes.

import { API_BASE } from './checkoutData';

const headers = () => ({
  'Content-Type': 'application/json',
  // Authorization: `Bearer ${localStorage.getItem('token')}`, // ← activar en Módulo Auth
});

/**
 * GET /api/events/:eventId/availability
 * Devuelve { availableTickets: number, ticketPrice: number, currency: string }
 * Usado para validar stock en tiempo real antes de reservar.
 */
export const fetchEventAvailability = async (eventId) => {
  const res = await fetch(`${API_BASE}/api/events/${eventId}/availability`, {
    headers: headers(),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('No se pudo obtener disponibilidad del evento');
  return res.json();
};

/**
 * POST /api/tickets/reserve
 * Body: { eventId, attendeeName, attendeeEmail, quantity }
 * Devuelve: { ticketId, reservedUntil, status: "RESERVED" }
 *
 * El backend:
 *  1. Verifica stock (totalCapacity - countActiveTickets)
 *  2. Crea Ticket con status=RESERVED, reservedUntil=now+15min
 *  3. Retorna el ticketId para continuar al pago
 */
export const reserveTicket = async ({ eventId, attendeeName, attendeeEmail, quantity = 1 }) => {
  const res = await fetch(`${API_BASE}/api/tickets/reserve`, {
    method: 'POST',
    headers: headers(),
    credentials: 'include',
    body: JSON.stringify({ eventId, attendeeName, attendeeEmail, quantity }),
  });

  if (res.status === 409) throw new Error('SOLD_OUT'); // sin cupos
  if (!res.ok) throw new Error('Error al reservar el ticket');
  return res.json(); // { ticketId, reservedUntil }
};

/**
 * DELETE /api/tickets/:ticketId/release
 * Libera la reserva si el usuario abandona el flujo antes de pagar.
 * Se llama en el cleanup del componente o cuando el timer llega a 0.
 */
export const releaseReservation = async (ticketId) => {
  try {
    await fetch(`${API_BASE}/api/tickets/${ticketId}/release`, {
      method: 'DELETE',
      headers: headers(),
      credentials: 'include',
    });
  } catch {
    // Silent fail — el @Scheduled del backend limpiará igual
  }
};

// ─── Módulo 3 ─────────────────────────────────────────────────────────────

/**
 * POST /api/payments/simulate  (solo DEV)
 * { ticketId, simulatedResult: "success"|"failure", paymentMethod }
 * → { id, amount, status, method }
 *
 * TODO Módulo 3 PROD: reemplazar por initStripePayment() que crea
 * un PaymentIntent y retorna el clientSecret para Stripe Elements.
 */
export const simulatePayment = async ({ ticketId, simulatedResult, paymentMethod }) => {
  const res = await fetch(`${API_BASE}/api/payments/simulate`, {
    method: 'POST',
    headers: headers(),
    credentials: 'include',
    body: JSON.stringify({ ticketId, simulatedResult, paymentMethod }),
  });

  const data = await res.json();

  if (res.status === 409) throw new Error(data.error ?? 'Reserva expirada o inválida');
  if (res.status === 404) throw new Error(data.error ?? 'Ticket no encontrado');
  if (!res.ok)            throw new Error('Error al procesar el pago');

  return data; // { id, amount, status, method }
};

/*
 * TODO Módulo 3 PROD — descomentar cuando se integre Stripe:
 *
 * export const initStripePayment = async ({ ticketId, amount, currency }) => {
 *   const res = await fetch(`${API_BASE}/api/payments/create-intent`, {
 *     method: 'POST',
 *     headers: headers(),
 *     body: JSON.stringify({ ticketId, amount, currency }),
 *   });
 *   if (!res.ok) throw new Error('Error al crear PaymentIntent');
 *   return res.json(); // { clientSecret }
 * };
 */