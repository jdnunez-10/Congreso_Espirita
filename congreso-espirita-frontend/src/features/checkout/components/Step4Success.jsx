import { Link } from 'react-router-dom';
import { EVENT_CONFIG } from '../data/checkoutData';

/**
 * HU-04 — Paso 4: Confirmación de compra exitosa.
 * Muestra el resumen y la instrucción del ticket/QR.
 * El PDF real se generará en el backend tras el webhook de pago.
 */
export const Step4Success = ({ reservation, form, quantity, total }) => (
  <div className="animate-fade-in text-center py-4">
    {/* Ícono de éxito */}
    <div className="w-20 h-20 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" strokeOpacity=".3"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12.5l3.5 3.5 6.5-7"/>
      </svg>
    </div>

    <h2 className="text-3xl font-black text-stone-900 mb-2">¡Pago confirmado!</h2>
    <p className="text-stone-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
      Tu boleto fue generado y enviado a <strong className="text-stone-700">{form.email}</strong>.
      Preséntalo en la entrada del evento.
    </p>

    {/* Ticket visual */}
    <div className="bg-stone-900 text-white rounded-2xl p-6 mb-6 max-w-sm mx-auto relative overflow-hidden">
      {/* Decoración */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-8 translate-x-8" aria-hidden="true" />

      <div className="relative">
        <div className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
          ✦ Ticket Digital · {EVENT_CONFIG.currency}
        </div>

        <div className="text-left mb-5">
          <p className="text-white/60 text-xs">Asistente</p>
          <p className="font-bold text-lg">{form.name}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left mb-6">
          <div>
            <p className="text-white/60 text-xs">Evento</p>
            <p className="font-semibold text-sm">Congreso Espírita HN</p>
          </div>
          <div>
            <p className="text-white/60 text-xs">Fecha</p>
            <p className="font-semibold text-sm">14–15 Ago 2026</p>
          </div>
          <div>
            <p className="text-white/60 text-xs">Boletos</p>
            <p className="font-semibold text-sm">{quantity} × General</p>
          </div>
          <div>
            <p className="text-white/60 text-xs">Total</p>
            <p className="font-semibold text-sm">{EVENT_CONFIG.currency} {total.toLocaleString('es-HN')}</p>
          </div>
        </div>

        {/* QR placeholder */}
        <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shrink-0">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-label="Código QR del ticket">
              <rect x="2" y="2" width="16" height="16" rx="2" fill="#1c1917"/>
              <rect x="26" y="2" width="16" height="16" rx="2" fill="#1c1917"/>
              <rect x="2" y="26" width="16" height="16" rx="2" fill="#1c1917"/>
              <rect x="5" y="5" width="10" height="10" fill="white"/>
              <rect x="29" y="5" width="10" height="10" fill="white"/>
              <rect x="5" y="29" width="10" height="10" fill="white"/>
              <rect x="24" y="24" width="4" height="4" fill="#1c1917"/>
              <rect x="30" y="24" width="4" height="4" fill="#1c1917"/>
              <rect x="36" y="24" width="4" height="4" fill="#1c1917"/>
              <rect x="24" y="30" width="4" height="4" fill="#1c1917"/>
              <rect x="36" y="36" width="4" height="4" fill="#1c1917"/>
            </svg>
          </div>
          <div className="text-left">
            <p className="text-white/60 text-[10px] mb-1">ID de reserva</p>
            <p className="font-mono text-xs font-bold text-amber-400">
              {reservation?.ticketId ?? 'CEH-2026-XXXXXX'}
            </p>
            <p className="text-white/40 text-[10px] mt-1.5">PDF enviado a tu correo</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8 text-sm text-amber-800 max-w-sm mx-auto">
      📧 Revisa tu bandeja de entrada. El PDF con tu QR puede tardar unos minutos en llegar.
    </div>

    <Link
      to="/"
      className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 text-sm font-medium transition-colors"
    >
      ← Volver al inicio
    </Link>
  </div>
);