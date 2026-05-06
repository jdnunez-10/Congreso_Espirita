/**
 * HU-00: Tarjeta individual de conferencista.
 * Recibe los datos como props; la lista viene de SpeakersSection.
 */
export const SpeakerCard = ({ name, role, bio, image }) => (
  <article className="flex flex-col items-center p-7 bg-white rounded-2xl border border-stone-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 transition-all duration-300 group">
    <div className="relative mb-5">
      <img
        src={image}
        alt={`Foto de ${name}`}
        className="w-28 h-28 rounded-full object-cover border-4 border-stone-100 group-hover:border-amber-200 transition-colors duration-300"
      />
      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-white text-xs" aria-hidden="true">
        ✦
      </div>
    </div>

    <h3 className="text-lg font-bold text-stone-800 text-center">{name}</h3>
    <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-3 text-center">{role}</p>
    <p className="text-stone-500 text-sm text-center leading-relaxed">{bio}</p>
  </article>
);