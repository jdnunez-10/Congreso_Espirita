import { EVENT_CONFIG } from '../data/checkoutData';
import { OrderSummary } from './OrderSummary';

/**
 * HU-2.1 — Paso 1: Selección de boletos con validación de stock en tiempo real.
 */
export const Step1Tickets = ({
  quantity, changeQuantity,
  availability, availLoading, availError,
  unitPrice, subtotal, total,
  onNext,
}) => {
  const available = availability?.availableTickets ?? EVENT_CONFIG.totalCapacity;
  const soldOut   = available === 0;
  const lowStock  = available > 0 && available <= 20;

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-black text-stone-900 mb-1">Selecciona tu boleto</h2>
      <p className="text-stone-400 text-sm mb-8">Congreso Espírita Hondureño · 14 y 15 de agosto, 2026</p>

      {/* Tarjeta del boleto */}
      <div className={`border rounded-2xl p-6 mb-6 transition-colors ${
        soldOut ? 'border-red-200 bg-red-50' : 'border-stone-200 bg-white hover:border-amber-300'
      }`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-stone-900 text-lg">Boleto General — 2 Días</h3>
            <p className="text-stone-500 text-sm mt-1">
              Acceso completo · Conferencistas · Certificado digital
            </p>
          </div>
          <div className="text-right">
            <div className="font-black text-2xl text-amber-600">
              {EVENT_CONFIG.currency} {unitPrice.toLocaleString('es-HN')}
            </div>
            <div className="text-xs text-stone-400">por persona</div>
          </div>
        </div>

        {/* Disponibilidad en tiempo real */}
        <div className="flex items-center gap-2 mb-5">
          {availLoading && (
            <span className="text-xs text-stone-400 animate-pulse">Verificando disponibilidad...</span>
          )}
          {availError && (
            <span className="text-xs text-red-500">⚠ {availError}</span>
          )}
          {!availLoading && !availError && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              soldOut  ? 'bg-red-100 text-red-600'
              : lowStock ? 'bg-orange-100 text-orange-600'
              : 'bg-green-100 text-green-700'
            }`}>
              {soldOut   ? '✕ Agotado'
               : lowStock ? `⚠ Últimos ${available} cupos`
               : `✓ ${available} cupos disponibles`}
            </span>
          )}
        </div>

        {/* Control de cantidad */}
        {!soldOut && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-stone-500 font-medium">Cantidad:</span>
            <div className="flex items-center gap-3 bg-stone-50 rounded-xl p-1">
              <button
                onClick={() => changeQuantity(-1)}
                disabled={quantity <= 1}
                aria-label="Reducir cantidad"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-lg"
              >
                −
              </button>
              <span className="w-8 text-center font-black text-stone-900 tabular-nums" aria-live="polite">
                {quantity}
              </span>
              <button
                onClick={() => changeQuantity(1)}
                disabled={quantity >= Math.min(10, available)}
                aria-label="Aumentar cantidad"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>

      <OrderSummary quantity={quantity} unitPrice={unitPrice} subtotal={subtotal} total={total} />

      <button
        onClick={onNext}
        disabled={soldOut || availLoading}
        className="w-full mt-6 bg-stone-900 text-white py-4 rounded-2xl font-black text-base hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
      >
        {soldOut ? 'Sin cupos disponibles' : 'Continuar con mis datos →'}
      </button>

      <p className="text-center text-xs text-stone-400 mt-3">
        🔒 Tus datos están protegidos · Pago seguro SSL
      </p>
    </div>
  );
};