import { useAuth } from '../context/authContext';
import { Navigate, Link } from 'react-router-dom';
import AdminRegister from '../components/admin/adminRegister';
import logo from '../assets/logo.png';

const AdminPage = () => {
  const { usuario } = useAuth();
  
  if (!usuario || usuario.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#272727] flex flex-col w-screen overflow-hidden">
      <div className="p-1 relative w-32 h-32">
        <img src={logo} alt="Gamers Needs Logo" className="w-full h-full rounded-full"/>
        <Link to="/" className="absolute inset-0 rounded-full"/>
      </div>
      <div className="flex-1 flex justify-center items-center -mt-20">
        <div className="w-full max-w-2xl px-8">
          <AdminRegister />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;