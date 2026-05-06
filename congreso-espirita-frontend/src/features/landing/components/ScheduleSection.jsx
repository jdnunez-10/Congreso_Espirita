import { useState } from 'react';
import { SCHEDULE } from '../data/landingData';

/**
 * HU-00: Sección de Agenda con actividades del Día 1 y Día 2.
 */
export const ScheduleSection = () => {
  const [activeDay, setActiveDay] = useState(1);
  const days = Object.keys(SCHEDULE).map(Number);
  const { label, items } = SCHEDULE[activeDay];

  return (
    <section id="agenda" className="py-24 px-6 bg-white" aria-labelledby="schedule-heading">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Programa del evento</span>
          <h2 id="schedule-heading" className="text-4xl font-black text-stone-900 mt-2 mb-4">
            Agenda del Congreso
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full" />
        </div>

        {/* Selector de día */}
        <div className="flex justify-center gap-3 mb-10" role="tablist" aria-label="Seleccionar día del congreso">
          {days.map((day) => (
            <button
              key={day}
              role="tab"
              aria-selected={activeDay === day}
              onClick={() => setActiveDay(day)}
              className={`px-7 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                activeDay === day
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              Día {day}
            </button>
          ))}
        </div>

        {/* Etiqueta del día activo */}
        <p className="text-center text-stone-400 text-sm mb-6 font-medium">{label}</p>

        {/* Lista de actividades */}
        <div
          role="tabpanel"
          aria-label={`Agenda Día ${activeDay}`}
          className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm"
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-5 px-6 py-5 border-b border-stone-50 last:border-0 hover:bg-stone-50/70 transition-colors"
            >
              <span className="text-amber-400 text-lg w-4 shrink-0" aria-hidden="true">
                {item.icon}
              </span>
              <span className="text-amber-700 font-mono font-bold text-sm w-24 shrink-0">
                {item.time}
              </span>
              <span className="text-stone-700 font-medium text-sm">{item.activity}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};