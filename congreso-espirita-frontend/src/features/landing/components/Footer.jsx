import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EVENT_INFO } from '../data/landingData';

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Conferencistas', href: '#conferencistas' },
  { label: 'Agenda 2026', href: '#agenda' },
  { label: 'Preguntas Frecuentes', href: '#faq' },
];

/**
 * Footer global con info del evento, navegación, contacto y boletín.
 */
export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: conectar al endpoint POST /api/newsletter cuando el backend esté listo
    setEmail('');
    alert('¡Gracias! Te notificaremos con novedades del evento.');
  };

  return (
    <footer className="bg-stone-900 text-stone-400" aria-label="Pie de página">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Info del evento */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white text-sm font-black">✦</div>
            <span className="text-white font-bold text-sm">CongresoEspírita</span>
          </div>
          <p className="text-sm leading-relaxed opacity-60">
            Un evento dedicado al estudio, la fraternidad y el crecimiento espiritual en nuestra región.
          </p>
        </div>

        {/* Navegación rápida */}
        <nav aria-label="Navegación del footer">
          <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Navegación</h4>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                {href.startsWith('#') || href.startsWith('http')
                  ? <a href={href} className="hover:text-amber-400 transition-colors">{label}</a>
                  : <Link to={href} className="hover:text-amber-400 transition-colors">{label}</Link>
                }
              </li>
            ))}
          </ul>
        </nav>

        {/* Contacto */}
        <div>
          <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Contacto</h4>
          <address className="not-italic space-y-2.5 text-sm">
            <p className="flex items-center gap-2">
              <span aria-hidden="true">📍</span> {EVENT_INFO.location}
            </p>
            <p className="flex items-center gap-2">
              <span aria-hidden="true">✉️</span>
              <a href={`mailto:${EVENT_INFO.email}`} className="hover:text-amber-400 transition-colors">
                {EVENT_INFO.email}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span aria-hidden="true">📞</span>
              <a href={`tel:${EVENT_INFO.phone}`} className="hover:text-amber-400 transition-colors">
                {EVENT_INFO.phone}
              </a>
            </p>
          </address>
        </div>

        {/* Boletín */}
        <div>
          <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Boletín</h4>
          <p className="text-xs mb-4 leading-relaxed">Recibe actualizaciones y novedades del evento.</p>
          <form onSubmit={handleSubscribe} className="flex" aria-label="Suscribirse al boletín">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo"
              required
              className="bg-stone-800 border border-stone-700 rounded-l-lg px-4 py-2 w-full text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              aria-label="Correo electrónico para el boletín"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-stone-900 px-4 py-2 rounded-r-lg font-bold transition-colors"
              aria-label="Suscribirse"
            >
              →
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-stone-800 text-center text-xs opacity-40">
        <p>© {new Date().getFullYear()} {EVENT_INFO.name}. Todos los derechos reservados.</p>
        <p className="mt-1">Plataforma digital de gestión de eventos.</p>
      </div>
    </footer>
  );
};