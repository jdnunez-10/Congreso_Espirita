import { Routes, Route } from 'react-router-dom';
import { Navbar } from './features/landing/components/Navbar';
import { Footer } from './features/landing/components/Footer';
import { HomePage } from './features/landing/pages/HomePage';
import { CheckoutPage } from './features/checkout/pages/CheckoutPage';

function App() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-amber-100 selection:text-amber-900">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Módulo 2 — Reserva y Proceso de Compra */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;