import { useReservation } from '../hooks/useReservation';
import { StepIndicator } from '../components/StepIndicator';
import { Step1Tickets }  from '../components/Step1Tickets';
import { Step2Attendee } from '../components/Step2Attendee';
import { Step3Payment }  from '../components/Step3Payment';
import { Step4Success }  from '../components/Step4Success';

/**
 * HU-2.1 — Página de checkout.
 * Orquesta los 4 pasos usando useReservation.
 * No contiene lógica propia — todo viene del hook.
 */
export const CheckoutPage = () => {
  const r = useReservation();

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-20 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header de la página */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
            Proceso de compra
          </span>
          <h1 className="text-3xl font-black text-stone-900 mt-1">
            Congreso Espírita HN
          </h1>
        </div>

        {/* Barra de progreso */}
        {r.step < 4 && <StepIndicator currentStep={r.step} />}

        {/* Tarjeta contenedora */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-6 sm:p-8">
          {r.step === 1 && (
            <Step1Tickets
              quantity={r.quantity}
              changeQuantity={r.changeQuantity}
              availability={r.availability}
              availLoading={r.availLoading}
              availError={r.availError}
              unitPrice={r.unitPrice}
              subtotal={r.subtotal}
              total={r.total}
              onNext={r.goToAttendeeForm}
            />
          )}

          {r.step === 2 && (
            <Step2Attendee
              form={r.form}
              updateField={r.updateField}
              formErrors={r.formErrors}
              secsLeft={r.secsLeft}
              reserving={r.reserving}
              reserveError={r.reserveError}
              quantity={r.quantity}
              unitPrice={r.unitPrice}
              subtotal={r.subtotal}
              total={r.total}
              onBack={() => r.setStep(1)}
              onSubmit={r.submitAttendeeAndReserve}
            />
          )}

          {r.step === 3 && (
            <Step3Payment
              secsLeft={r.secsLeft}
              reservation={r.reservation}
              quantity={r.quantity}
              unitPrice={r.unitPrice}
              subtotal={r.subtotal}
              total={r.total}
              paying={r.paying}
              payError={r.payError}
              onBack={() => r.setStep(2)}
              onSubmitPayment={r.submitPayment}
            />
          )}

          {r.step === 4 && (
            <Step4Success
              reservation={r.reservation}
              form={r.form}
              quantity={r.quantity}
              total={r.total}
            />
          )}
        </div>
      </div>
    </div>
  );
};