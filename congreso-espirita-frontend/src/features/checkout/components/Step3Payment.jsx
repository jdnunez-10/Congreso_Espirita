import { useState } from 'react';
import { ReservationTimer } from './ReservationTimer';
import { OrderSummary } from './OrderSummary';

const PAYMENT_METHODS = [
  { id: 'CARD',     label: 'Tarjeta crédito/débito', icon: '💳' },
  { id: 'BAC',      label: 'BAC Credomatic',          icon: '🏦' },
  { id: 'TRANSFER', label: 'Transferencia bancaria',  icon: '🔁' },
];

/**
 * HU-3.1 — Paso 3: Pago seguro.
 *
 * DEV: muestra formulario simulado con botones de éxito/fallo.
 * PROD: reemplazar el bloque "Simulación" por <StripeElements /> o
 *       el SDK de BAC Credomatic. El resto del componente no cambia.
 */
export const Step3Payment = ({
  secsLeft, reservation,
  quantity, unitPrice, subtotal, total,
  paying, payError,
  onBack, onSubmitPayment,
}) => {
  const [selectedMethod, setSelectedMethod] = useState('CARD');

  // ── Pantalla de procesando (HU-3.1: evitar doble clic / refresco) ────────
  if (paying) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="w-16 h-16 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin mb-6" />
        <p className="font-bold text-stone-900 text-lg mb-1">Procesando tu pago</p>
        <p className="text-stone-400 text-sm text-center max-w-xs">
          No cierres ni recargues esta página. Estamos confirmando tu transacción.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-black text-stone-900 mb-1">Pago seguro</h2>
          <p className="text-stone-400 text-sm">Tu boleto está reservado. Completa el pago.</p>
        </div>
        <ReservationTimer secsLeft={secsLeft} />
      </div>

      {/* Reserva activa */}
      {reservation?.ticketId && (
        <div className="bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
          <div>
            <p className="text-xs text-stone-400">Reserva activa</p>
            <p className="text-sm font-mono font-bold text-stone-700 truncate max-w-55">
              {reservation.ticketId}
            </p>
          </div>
        </div>
      )}

      {/* Método de pago */}
      <div className="mb-6">
        <p className="text-sm font-medium text-stone-700 mb-3">Método de pago</p>
        <div className="grid grid-cols-3 gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMethod(m.id)}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedMethod === m.id
                  ? 'border-amber-400 bg-amber-50 text-stone-900'
                  : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
              }`}
            >
              <div className="text-xl mb-1">{m.icon}</div>
              <div className="text-[10px] font-medium leading-tight">{m.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/*
        ── TODO Módulo 3 PROD ────────────────────────────────────────────────
        Reemplazar este bloque por <StripeElements /> o el widget de BAC.

        Con Stripe:
          1. Llamar a initStripePayment({ ticketId, amount, currency })
          2. Recibir clientSecret
          3. Montar <Elements stripe={stripePromise} options={{ clientSecret }}>
               <PaymentElement />
             </Elements>
          4. Al confirmar, Stripe llama al webhook automáticamente

        Con BAC Credomatic:
          1. Redirigir al usuario a la URL de pago de BAC con los parámetros
          2. BAC redirige de vuelta con el resultado
          3. El backend valida el retorno y actualiza el ticket
        ─────────────────────────────────────────────────────────────────────
      */}
      <div className="bg-amber-50 border border-dashed border-amber-300 rounded-2xl p-5 mb-6 text-center">
        <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
          Modo desarrollo
        </p>
        <p className="text-xs text-amber-600 mb-4">
          Aquí irá Stripe Elements o BAC Credomatic en producción.
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => onSubmitPayment('success', selectedMethod)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
          >
            ✓ Simular pago exitoso
          </button>
          <button
            onClick={() => onSubmitPayment('failure', selectedMethod)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
          >
            ✕ Simular fallo
          </button>
        </div>
      </div>

      {/* Error de pago */}
      {payError && (
        <div role="alert" className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
          <span>⚠</span> {payError}
        </div>
      )}

      <OrderSummary quantity={quantity} unitPrice={unitPrice} subtotal={subtotal} total={total} />

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-2xl border border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50 transition-all"
        >
          ← Atrás
        </button>
      </div>
      <p className="text-center text-xs text-stone-400 mt-3">
        🔒 Cifrado SSL · Cumplimiento PCI-DSS
      </p>
    </div>
  );
};