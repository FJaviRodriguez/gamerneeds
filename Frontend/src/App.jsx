import { Routes, Route, Navigate } from 'react-router-dom';
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
import RutasProtegidas from './components/common/rutasProtegidas';
import { Toaster } from 'react-hot-toast';
import { CarritoProvider } from './context/carritoContext';
import AdminRegisterPage from './pages/adminRegister'; 
import PanelAdmin from './pages/panelAdmin';
import CrearJuegoPage from './pages/crearJuegoPage';
import CrearDesarrolladorPage from './pages/crearDesarrolladorPage';
import CrearEditorPage from './pages/crearEditorPage';

function App() {
  return (
    <CarritoProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff'
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
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
        <Route 
          path="/admin" 
          element={
            <RutasProtegidas adminOnly>
              <AdminRegisterPage />
            </RutasProtegidas>
          } 
        />
        <Route 
          path="/panel-admin" 
          element={
            <RutasProtegidas adminOnly>
              <PanelAdmin />
            </RutasProtegidas>
          } 
        />
        <Route 
          path="/admin/juego/crear" 
          element={
            <RutasProtegidas adminOnly>
              <CrearJuegoPage />
            </RutasProtegidas>
          } 
        />
        <Route 
          path="/admin/desarrollador/crear" 
          element={
            <RutasProtegidas adminOnly>
              <CrearDesarrolladorPage />
            </RutasProtegidas>
          } 
        />
        <Route 
          path="/admin/editor/crear" 
          element={
            <RutasProtegidas adminOnly>
              <CrearEditorPage />
            </RutasProtegidas>
          } 
        />
      </Routes>
    </CarritoProvider>
  );
}

export default App;