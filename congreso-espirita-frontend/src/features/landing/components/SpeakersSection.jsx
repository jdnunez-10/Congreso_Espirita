import { SpeakerCard } from './SpeakerCard';
import { SPEAKERS } from '../data/landingData';

/**
 * HU-00: Sección "Conferencistas" con foto, nombre y biografía corta.
 */
export const SpeakersSection = () => (
  <section id="conferencistas" className="py-24 px-6 bg-stone-50" aria-labelledby="speakers-heading">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Quiénes nos acompañan</span>
        <h2 id="speakers-heading" className="text-4xl font-black text-stone-900 mt-2 mb-4">
          Conferencistas Invitados
        </h2>
        <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full" />
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {SPEAKERS.map((speaker) => (
          <SpeakerCard key={speaker.id} {...speaker} />
        ))}
      </div>
    </div>
  </section>
);