import { useNavigate } from 'react-router-dom';
import { CountdownTimer } from './CountdownTimer';
import { EVENT_INFO } from '../data/landingData';
import heroImg from '../../../assets/logo eeoc.png';

/**
 * HU-00: Banner principal con fecha, lugar y contador regresivo.
 */
export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <header className="relative bg-stone-900 text-white pt-32 pb-24 px-6 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-175 bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-700/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Texto principal */}
        <div className="text-center md:text-left">
          <span className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/30 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            {EVENT_INFO.location} · {EVENT_INFO.year}
          </span>

          <h1 className="text-5xl md:text-6xl font-black leading-[1.1] mb-4 tracking-tight">
            Congreso <br />
            <span className="text-amber-400">Espírita</span>
            <br />Hondureño
          </h1>

          <p className="text-stone-300 text-lg max-w-md mb-2 leading-relaxed">
            Un encuentro para fortalecer el espíritu y la fraternidad. Únete a nosotros en {EVENT_INFO.venue}.
          </p>

          <p className="text-stone-400 text-sm mb-6 flex items-center gap-2 justify-center md:justify-start">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block" />
            {EVENT_INFO.venue} — 14 y 15 de agosto, 2026
          </p>

          {/* HU-00: Contador regresivo */}
          <CountdownTimer targetDate={EVENT_INFO.targetDate} />

          {/* HU-00: Botón destacado → checkout */}
          <button
            onClick={() => navigate('/checkout')}
            className="mt-10 bg-amber-500 text-stone-900 px-10 py-4 rounded-2xl font-black text-lg hover:bg-amber-400 transition-all duration-200 hover:scale-105 shadow-2xl shadow-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-900"
            aria-label="Comprar mi boleto para el Congreso Espírita"
          >
            ¡COMPRAR MI BOLETO!
          </button>
        </div>

        {/* Imagen / logo */}
        <div className="hidden md:flex justify-center relative" aria-hidden="true">
          <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-[80px] animate-pulse" />
          <img
            src={heroImg}
            alt="Logo del Congreso Espírita Hondureño"
            className="relative w-full max-w-sm drop-shadow-2xl"
          />
        </div>
      </div>
    </header>
  );
};