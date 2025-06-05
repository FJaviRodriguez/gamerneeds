import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import AdminRegister from '../components/admin/adminRegister';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const AdminPage = () => {
  const { usuario } = useAuth();

  // Redirigir si no es admin
  if (!usuario || usuario.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#272727] flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AdminRegister />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;