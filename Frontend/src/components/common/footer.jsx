import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center space-x-12 mb-4 text-base font-medium text-white">
          <Link to="/terminos" className="hover:text-[#FF4C1A] transition-colors duration-200 uppercase">Términos y Condiciones</Link>
          <Link to="/politica" className="hover:text-[#FF4C1A] transition-colors duration-200 uppercase">Política de Privacidad</Link>
          <Link to="/contacto" className="hover:text-[#FF4C1A] transition-colors duration-200 uppercase">Contacto</Link>
        </div>
        <div className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} GAMERS NEEDS. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;