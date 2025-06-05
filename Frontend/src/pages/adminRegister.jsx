import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import AdminRegister from '../components/admin/adminRegister';

const AdminPage = () => {
  const { usuario } = useAuth();
  
  if (!usuario || usuario.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#272727] flex flex-col overflow-hidden">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AdminRegister />
        </div>
      </main>
    </div>
  );
};

export default AdminPage;