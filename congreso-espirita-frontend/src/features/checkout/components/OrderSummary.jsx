import { EVENT_CONFIG } from '../data/checkoutData';

/**
 * Resumen del pedido. Reutilizado en pasos 1, 2 y 3.
 * @param {number} quantity
 * @param {number} unitPrice  - precio unitario (del backend o mock)
 * @param {number} subtotal
 * @param {number} total
 */
export const OrderSummary = ({ quantity, unitPrice, subtotal, total }) => (
  <div className="bg-stone-50 border border-stone-100 rounded-2xl p-5">
    <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Resumen del pedido</p>
    <div className="space-y-2.5 text-sm">
      <div className="flex justify-between text-stone-600">
        <span>Boleto General × {quantity}</span>
        <span className="font-medium text-stone-800">
          {EVENT_CONFIG.currency} {subtotal.toLocaleString('es-HN')}
        </span>
      </div>
      <div className="flex justify-between text-stone-500 text-xs">
        <span>Cargo por servicio</span>
        <span>{EVENT_CONFIG.currency} {EVENT_CONFIG.serviceFee.toLocaleString('es-HN')}</span>
      </div>
    </div>
    <div className="border-t border-stone-200 mt-4 pt-4 flex justify-between items-center">
      <span className="font-bold text-stone-800">Total</span>
      <span className="font-black text-xl text-amber-600">
        {EVENT_CONFIG.currency} {total.toLocaleString('es-HN')}
      </span>
    </div>
    <p className="text-[10px] text-stone-400 mt-2 text-right">
      Acceso completo Día 1 + Día 2 · Certificado digital incluido
    </p>
  </div>
);