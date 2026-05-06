import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Navbar fija con efecto glassmorphism al hacer scroll.
 * Links de ancla para navegación interna del landing.
 */
export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = `font-medium text-sm transition-colors duration-200 ${
    scrolled ? 'text-stone-600 hover:text-amber-700' : 'text-white/80 hover:text-white'
  }`;

  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-3 border-b border-stone-200/60'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" aria-label="Ir al inicio">
          <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center text-white font-black text-sm">
            ✦
          </div>
          <span className={`text-lg font-bold tracking-tight transition-colors duration-200 ${
            scrolled ? 'text-stone-900' : 'text-white'
          }`}>
            CongresoEspírita
          </span>
        </Link>

        {/* Links + CTA */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#conferencistas" className={linkClass}>Conferencistas</a>
          <a href="#agenda" className={linkClass}>Agenda</a>
          <Link
            to="/checkout"
            className="bg-amber-500 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-amber-600 transition-colors duration-200"
          >
            Comprar Ticket
          </Link>
        </div>

        {/* Menú móvil — TODO Módulo 0 v2 */}
        <button
          className={`md:hidden p-2 rounded-md transition-colors ${
            scrolled ? 'text-stone-600' : 'text-white'
          }`}
          aria-label="Abrir menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};