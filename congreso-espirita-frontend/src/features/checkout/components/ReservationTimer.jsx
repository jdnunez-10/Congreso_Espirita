/**
 * Timer visible en los pasos 2 y 3 mientras hay una reserva activa.
 * Cambia a rojo cuando quedan menos de 2 minutos.
 * @param {number} secsLeft - segundos restantes
 */
export const ReservationTimer = ({ secsLeft }) => {
  const mins = String(Math.floor(secsLeft / 60)).padStart(2, '0');
  const secs = String(secsLeft % 60).padStart(2, '0');
  const urgent = secsLeft < 120;

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label={`Tiempo restante para completar tu compra: ${mins} minutos ${secs} segundos`}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors duration-300 ${
        urgent
          ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
          : 'bg-amber-50 text-amber-700 border border-amber-200'
      }`}
    >
      <span aria-hidden="true">{urgent ? '⚠' : '⏱'}</span>
      {mins}:{secs}
      <span className="font-normal opacity-70">restantes</span>
    </div>
  );
};