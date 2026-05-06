import { ReservationTimer } from './ReservationTimer';
import { OrderSummary } from './OrderSummary';

const Field = ({ label, id, type = 'text', value, onChange, error, placeholder, required }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-1.5">
      {label} {required && <span className="text-amber-500">*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`w-full px-4 py-3 rounded-xl border text-sm text-stone-900 placeholder:text-stone-400 transition-all
        focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
        ${error ? 'border-red-300 bg-red-50' : 'border-stone-200 bg-white hover:border-stone-300'}`}
    />
    {error && (
      <p id={`${id}-error`} role="alert" className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
);

/**
 * HU-2.1 — Paso 2: Registro de datos del asistente.
 * La reserva en el backend ocurre al hacer submit (onSubmit).
 */
export const Step2Attendee = ({
  form, updateField, formErrors,
  secsLeft, reserving, reserveError,
  quantity, unitPrice, subtotal, total,
  onBack, onSubmit,
}) => (
  <div className="animate-fade-in">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-2xl font-black text-stone-900 mb-1">Datos del asistente</h2>
        <p className="text-stone-400 text-sm">
          El ticket será enviado a este correo electrónico.
        </p>
      </div>
      {/* El timer solo aparece si ya hay reserva activa — normalmente en paso 3.
          Aquí sirve de referencia visual si el usuario regresa al paso 2. */}
      {secsLeft < 840 && <ReservationTimer secsLeft={secsLeft} />}
    </div>

    <div className="bg-white border border-stone-100 rounded-2xl p-6 space-y-5 mb-6 shadow-sm">
      <Field
        id="name" label="Nombre completo" required
        value={form.name} onChange={(v) => updateField('name', v)}
        error={formErrors.name} placeholder="Tu nombre completo"
      />
      <Field
        id="email" label="Correo electrónico" type="email" required
        value={form.email} onChange={(v) => updateField('email', v)}
        error={formErrors.email} placeholder="correo@ejemplo.com"
      />
      <Field
        id="phone" label="Teléfono (opcional)"
        value={form.phone} onChange={(v) => updateField('phone', v)}
        error={formErrors.phone} placeholder="+504 XXXX-XXXX"
      />

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 text-xs text-amber-800 leading-relaxed">
        <span className="font-bold">Nota:</span> Al continuar, se reservará tu boleto por 14 minutos
        mientras completas el pago. Si el tiempo expira, el cupo quedará disponible para otros asistentes.
      </div>
    </div>

    <OrderSummary quantity={quantity} unitPrice={unitPrice} subtotal={subtotal} total={total} />

    {reserveError && (
      <div role="alert" className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
        <span>⚠</span> {reserveError}
      </div>
    )}

    <div className="flex gap-3 mt-6">
      <button
        onClick={onBack}
        disabled={reserving}
        className="flex-1 py-4 rounded-2xl border border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50 disabled:opacity-40 transition-all"
      >
        ← Atrás
      </button>
      <button
        onClick={onSubmit}
        disabled={reserving}
        className="flex-[2] py-4 rounded-2xl bg-stone-900 text-white font-black text-base hover:bg-stone-800 disabled:opacity-40 transition-all hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 flex items-center justify-center gap-2"
      >
        {reserving
          ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Reservando...</>
          : 'Reservar y pagar →'
        }
      </button>
    </div>
  </div>
);