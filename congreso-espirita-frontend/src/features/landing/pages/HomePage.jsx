import { HeroSection } from '../components/HeroSection';
import { SpeakersSection } from '../components/SpeakersSection';
import { ScheduleSection } from '../components/ScheduleSection';

/**
 * HU-00: Página principal del Módulo 0 — Landing Page informativa.
 * Orquesta las secciones visuales. Sin lógica de negocio.
 */
export const HomePage = () => (
  <div>
    <HeroSection />
    <SpeakersSection />
    <ScheduleSection />
  </div>
);