// ─── Datos centralizados del Módulo 0: Landing Page ───────────────────────
// Cuando el backend esté listo, estos datos vendrán de la API.
// Por ahora son estáticos para la propuesta.

export const EVENT_INFO = {
  name: 'Congreso Espírita Hondureño',
  year: 2026,
  location: 'Tegucigalpa, Honduras',
  venue: 'Auditorio Central UNAH',
  targetDate: '2026-08-15T08:00:00',
  email: 'info@congresoespirita.hn',
  phone: '+504 9999-9999',
};

export const SPEAKERS = [
  {
    id: 1,
    name: 'Dr. Roberto Paz',
    role: 'Medicina y Espiritualidad',
    bio: 'Médico y conferencista internacional con enfoque en la salud integral y espiritualidad.',
    image: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: 2,
    name: 'Dra. Elena Castro',
    role: 'Psicología Espírita',
    bio: 'Psicóloga especialista en el desarrollo del ser y la filosofía espírita contemporánea.',
    image: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: 3,
    name: 'Lic. Mario Duarte',
    role: 'Ética y Educación',
    bio: 'Investigador y educador dedicado a la difusión de valores éticos en la sociedad.',
    image: 'https://i.pravatar.cc/150?u=3',
  },
];

export const SCHEDULE = {
  1: {
    label: 'Viernes 14 de agosto',
    items: [
      { time: '08:00 AM', activity: 'Registro y Bienvenida', icon: '✦' },
      { time: '09:30 AM', activity: 'Conferencia: Ciencia y Espiritualidad', icon: '◈' },
      { time: '11:00 AM', activity: 'Panel de Discusión', icon: '◈' },
      { time: '12:30 PM', activity: 'Almuerzo libre', icon: '◇' },
      { time: '02:00 PM', activity: 'Taller: Mediunidad y Ética', icon: '◈' },
      { time: '05:00 PM', activity: 'Mesa redonda y cierre del día', icon: '◇' },
    ],
  },
  2: {
    label: 'Sábado 15 de agosto',
    items: [
      { time: '08:30 AM', activity: 'Meditación Grupal de Apertura', icon: '✦' },
      { time: '09:30 AM', activity: 'Conferencia: El Futuro del Movimiento', icon: '◈' },
      { time: '11:00 AM', activity: 'Conferencia: Sanación y Bien-Estar', icon: '◈' },
      { time: '01:00 PM', activity: 'Almuerzo y Networking', icon: '◇' },
      { time: '02:30 PM', activity: 'Sesión de preguntas abiertas', icon: '◇' },
      { time: '04:00 PM', activity: 'Clausura y Entrega de Diplomas', icon: '✦' },
    ],
  },
};