import { useState, useEffect } from 'react';

const UNITS = ['days', 'hours', 'mins', 'secs'];
const LABELS = { days: 'Días', hours: 'Horas', mins: 'Min', secs: 'Seg' };

const getTimeLeft = (targetDate) => {
  const distance = new Date(targetDate).getTime() - Date.now();
  if (distance <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  return {
    days:  Math.floor(distance / 86_400_000),
    hours: Math.floor((distance % 86_400_000) / 3_600_000),
    mins:  Math.floor((distance % 3_600_000)  / 60_000),
    secs:  Math.floor((distance % 60_000)     / 1_000),
  };
};

/**
 * HU-00: Contador regresivo hacia la fecha del evento.
 * @param {string} targetDate - ISO date string, ej: "2026-08-15T08:00:00"
 */
export const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1_000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-3 justify-center md:justify-start mt-6" aria-live="polite" aria-label="Cuenta regresiva al evento">
      {UNITS.map((unit) => (
        <div key={unit} className="text-center bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2 rounded-xl min-w-[56px]">
          <div className="text-2xl font-black tabular-nums">
            {String(timeLeft[unit]).padStart(2, '0')}
          </div>
          <div className="text-[10px] uppercase tracking-widest opacity-60 mt-0.5">
            {LABELS[unit]}
          </div>
        </div>
      ))}
    </div>
  );
};