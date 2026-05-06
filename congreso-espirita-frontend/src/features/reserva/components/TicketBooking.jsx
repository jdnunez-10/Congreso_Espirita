import { useState, useEffect } from 'react';

export const TicketBooking = () => {
  const [ticketCount, setTicketCount] = useState(1);
  const [attendees, setAttendees] = useState([{ name: '', email: '' }]);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos en segundos
  const [isReserved, setIsReserved] = useState(false);

  // Lógica del temporizador de reserva
  useEffect(() => {
    let timer;
    if (isReserved && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      alert("La reserva ha expirado. Los boletos han sido liberados.");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsReserved(false);
      setTimeLeft(900);
    }
    return () => clearInterval(timer);
  }, [isReserved, timeLeft]);

  const handleTicketChange = (count) => {
    const newCount = Math.max(1, Math.min(count, 5)); // Límite de 5 por compra
    setTicketCount(newCount);
    
    // Ajustar el array de asistentes según la cantidad de boletos
    const newAttendees = [...attendees];
    if (newCount > attendees.length) {
      for (let i = attendees.length; i < newCount; i++) {
        newAttendees.push({ name: '', email: '' });
      }
    } else {
      newAttendees.splice(newCount);
    }
    setAttendees(newAttendees);
  };

  const updateAttendee = (index, field, value) => {
    const updated = [...attendees];
    updated[index][field] = value;
    setAttendees(updated);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header del Proceso */}
      <div className="bg-indigo-600 p-8 text-white text-center">
        <h2 className="text-2xl font-bold">Reserva de Boletos</h2>
        {isReserved && (
          <div className="mt-4 bg-white/20 inline-block px-4 py-2 rounded-full text-sm font-mono animate-pulse">
            ⏳ Tiempo restante para completar el pago: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="p-8">
        {!isReserved ? (
          /* PASO 1: SELECCIÓN */
          <div className="space-y-8">
            <div className="flex justify-between items-center p-6 bg-indigo-50 rounded-2xl">
              <div>
                <h3 className="font-bold text-lg text-indigo-900">Entrada General</h3>
                <p className="text-indigo-600 font-medium">L. 500.00 c/u</p>
                <p className="text-xs text-gray-500 mt-1 italic">Stock disponible: 150</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleTicketChange(ticketCount - 1)}
                  className="w-10 h-10 rounded-full border-2 border-indigo-200 flex items-center justify-center font-bold text-indigo-600 hover:bg-indigo-100 transition"
                >-</button>
                <span className="text-xl font-bold w-4 text-center">{ticketCount}</span>
                <button 
                  onClick={() => handleTicketChange(ticketCount + 1)}
                  className="w-10 h-10 rounded-full border-2 border-indigo-200 flex items-center justify-center font-bold text-indigo-600 hover:bg-indigo-100 transition"
                >+</button>
              </div>
            </div>

            <button 
              onClick={() => setIsReserved(true)}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
            >
              Reservar Boletos
            </button>
          </div>
        ) : (
          /* PASO 2: DATOS DE ASISTENTES */
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Información de los Asistentes</h3>
            
            {attendees.map((attendee, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-2xl space-y-4 border border-gray-200">
                <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Asistente #{index + 1}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1">Nombre Completo</label>
                    <input 
                      type="text"
                      placeholder="Ej. Juan Pérez"
                      className="p-3 rounded-lg border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      value={attendee.name}
                      onChange={(e) => updateAttendee(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1">Correo Electrónico</label>
                    <input 
                      type="email"
                      placeholder="juan@ejemplo.com"
                      className="p-3 rounded-lg border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      value={attendee.email}
                      onChange={(e) => updateAttendee(index, 'email', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 space-y-3">
              <div className="flex justify-between text-lg font-bold px-2">
                <span>Total a Pagar:</span>
                <span className="text-indigo-600">L. {ticketCount * 500}.00</span>
              </div>
              <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg shadow-green-100 flex items-center justify-center gap-2">
                💳 Ir al Pago Seguro
              </button>
              <button 
                onClick={() => {setIsReserved(false); setTimeLeft(900);}}
                className="w-full text-gray-400 text-sm font-medium hover:text-red-500 transition"
              >
                Cancelar reserva
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};