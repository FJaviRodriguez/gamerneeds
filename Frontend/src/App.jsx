import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import HomePage from './pages/homePage';
import TerminosPage from './pages/terminosPage';
import PoliticaPage from './pages/politicaPage';
import JuegoDetalle from './components/juegos/juegoDetalle';
import CarritoPage from './pages/carritoPage';
import PerfilPage from './pages/perfilPage';
import CheckoutPage from './pages/checkoutPage';
import SuccessPage from './pages/successPage';
import { AuthProvider } from './context/authContext';
import { CarritoProvider } from './context/carritoContext';
import RutasProtegidas from './components/common/rutasProtegidas';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff'
          },
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <CarritoProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/terminos" element={<TerminosPage />} />
              <Route path="/politica" element={<PoliticaPage />} />
              <Route path="/juego/:id" element={<JuegoDetalle />} />
              <Route path="/carrito" element={
                <RutasProtegidas>
                  <CarritoPage />
                </RutasProtegidas>
              } />
              <Route path="/perfil" element={
                <RutasProtegidas>
                  <PerfilPage />
                </RutasProtegidas>
              } />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CarritoProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
