import { STEPS } from '../data/checkoutData';

/**
 * Barra de progreso visual para los 4 pasos del checkout.
 */
export const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-center gap-0 mb-10" role="list" aria-label="Pasos del proceso de compra">
    {STEPS.map((s, i) => {
      const done    = currentStep > s.id;
      const current = currentStep === s.id;
      return (
        <div key={s.id} className="flex items-center" role="listitem">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              done    ? 'bg-amber-500 text-white'
              : current ? 'bg-stone-900 text-white ring-4 ring-stone-900/20'
              : 'bg-stone-100 text-stone-400'
            }`}>
              {done ? '✓' : s.id}
            </div>
            <span className={`text-[10px] mt-1.5 font-medium uppercase tracking-wider transition-colors ${
              current ? 'text-stone-900' : done ? 'text-amber-600' : 'text-stone-400'
            }`}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-12 sm:w-20 h-px mx-1 mb-5 transition-colors duration-300 ${
              currentStep > s.id ? 'bg-amber-400' : 'bg-stone-200'
            }`} aria-hidden="true" />
          )}
        </div>
      );
    })}
  </div>
);