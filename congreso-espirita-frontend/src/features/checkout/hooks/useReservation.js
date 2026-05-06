// ─── Hook: useReservation ─────────────────────────────────────────────────
// Maneja el estado global del flujo de compra:
//   step, quantity, attendee form, timer, reserva, disponibilidad.
// Los componentes solo leen estado y llaman actions — sin lógica propia.

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchEventAvailability, reserveTicket, releaseReservation, simulatePayment } from '../data/checkoutApi';
import { ACTIVE_EVENT_ID, RESERVATION_DURATION_SECS, EVENT_CONFIG } from '../data/checkoutData';

const INITIAL_FORM = { name: '', email: '', phone: '' };

export const useReservation = () => {
  // ── Navegación ──────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);

  // ── Selección de boletos ────────────────────────────────────────────────
  const [quantity, setQuantity] = useState(1);
  const [availability, setAvailability] = useState(null); // { availableTickets, ticketPrice }
  const [availLoading, setAvailLoading] = useState(true);
  const [availError, setAvailError] = useState(null);

  // ── Formulario de asistente ─────────────────────────────────────────────
  const [form, setForm] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});

  // ── Estado de la reserva ────────────────────────────────────────────────
  const [reservation, setReservation] = useState(null); // { ticketId, reservedUntil }
  const [reserving, setReserving] = useState(false);
  const [reserveError, setReserveError] = useState(null);

  // ── Estado del pago ─────────────────────────────────────────────────────
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null); // { id, amount, status, method }

  // ── Timer de reserva ────────────────────────────────────────────────────
  const [secsLeft, setSecsLeft] = useState(RESERVATION_DURATION_SECS);
  const timerRef = useRef(null);
  const ticketIdRef = useRef(null); // para cleanup sin stale closure

  // ── Precio calculado ────────────────────────────────────────────────────
  const unitPrice = availability?.ticketPrice ?? EVENT_CONFIG.price;
  const subtotal   = unitPrice * quantity;
  const total      = subtotal + EVENT_CONFIG.serviceFee;

  // ── Fetch disponibilidad al montar ──────────────────────────────────────
useEffect(() => {
  let cancelled = false;
  
  fetchEventAvailability(ACTIVE_EVENT_ID)
    .then((data) => { 
      if (!cancelled) setAvailability(data); 
    })
    .catch(() => { 
      if (!cancelled) setAvailError('No se pudo verificar disponibilidad.'); 
    })
    .finally(() => { 
      if (!cancelled) setAvailLoading(false); 
    });
  
  return () => { cancelled = true; };
}, []);

  // ── Timer: arranca cuando hay reserva activa ────────────────────────────
  useEffect(() => {
    if (!reservation) return;
    const expiry = new Date(reservation.reservedUntil).getTime();
    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.round((expiry - Date.now()) / 1000));
      setSecsLeft(remaining);
      if (remaining === 0) {
        clearInterval(timerRef.current);
        releaseReservation(ticketIdRef.current);
        setReservation(null);
        setStep(1); // vuelve al inicio — reserva expiró
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [reservation]);

  // ── Liberar reserva si el usuario cierra/navega fuera ──────────────────
  useEffect(() => {
    const release = () => {
      if (ticketIdRef.current) releaseReservation(ticketIdRef.current);
    };
    window.addEventListener('beforeunload', release);
    return () => {
      window.removeEventListener('beforeunload', release);
      release();
    };
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────
  const changeQuantity = useCallback((delta) => {
    setQuantity((q) => Math.max(1, Math.min(10, q + delta)));
  }, []);

  const updateField = useCallback((field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setFormErrors((e) => ({ ...e, [field]: '' }));
  }, []);


  /**
   * Paso 1 → 2: solo avanza (no reserva aún, para no bloquear stock si el
   * usuario no completa el formulario).
   */
  const goToAttendeeForm = useCallback(() => setStep(2), []);

  /**
   * Paso 2 → 3: valida el form Y llama al backend para crear la reserva.
   * Solo en este momento se bloquea el stock.
   */
 const submitAttendeeAndReserve = useCallback(async () => {
  // Validar dentro del callback
  const errors = {};
  if (!form.name.trim()) errors.name = 'El nombre es requerido';
  if (!form.email.trim()) errors.email = 'El correo es requerido';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Ingresa un correo válido';
  
  setFormErrors(errors);
  
  if (Object.keys(errors).length !== 0) return; // ✅ Validación falló
  
  // Si llega aquí, la validación pasó
  setReserving(true);
  setReserveError(null);
  try {
    const data = await reserveTicket({
      eventId: ACTIVE_EVENT_ID,
      attendeeName: form.name,
      attendeeEmail: form.email,
      quantity,
    });
    ticketIdRef.current = data.ticketId;
    setReservation(data);
    setSecsLeft(RESERVATION_DURATION_SECS);
    setStep(3);
  } catch (err) {
    setReserveError(
      err.message === 'SOLD_OUT'
        ? 'Lo sentimos, no quedan boletos disponibles.'
        : 'Ocurrió un error al reservar. Intenta de nuevo.'
    );
  } finally {
    setReserving(false);
  }
}, [form, quantity]); // ✅ Dependencias limpias

  const goToSuccess = useCallback(() => {
    clearInterval(timerRef.current);
    setStep(4);
  }, []);

  /**
   * Paso 3: llama al backend /api/payments/simulate.
   * Si el pago es exitoso → paso 4 (confirmación).
   * Si falla → muestra error sin salir del paso 3.
   *
   * @param {string} simulatedResult - "success" | "failure"
   * @param {string} paymentMethod   - "CARD" | "BAC" | "TRANSFER"
   */
  const submitPayment = useCallback(async (simulatedResult, paymentMethod) => {
    if (!reservation?.ticketId) return;
    setPaying(true);
    setPayError(null);
    try {
      const result = await simulatePayment({
        ticketId: reservation.ticketId,
        simulatedResult,
        paymentMethod,
      });
      setPaymentResult(result);
      if (result.status === 'SUCCESS') {
        clearInterval(timerRef.current);
        setStep(4);
      } else {
        setPayError('El pago fue rechazado. Verifica tus datos e intenta de nuevo.');
      }
    } catch (err) {
      setPayError(err.message ?? 'Error al procesar el pago. Intenta de nuevo.');
    } finally {
      setPaying(false);
    }
  }, [reservation]);

  return {
    // estado
    step, quantity, form, formErrors,
    availability, availLoading, availError,
    reservation, reserving, reserveError,
    paying, payError, paymentResult,
    secsLeft, unitPrice, subtotal, total,
    // actions
    changeQuantity, updateField,
    goToAttendeeForm, submitAttendeeAndReserve, goToSuccess,
    submitPayment,
    setStep,
  };
};