import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      // Best-effort logout; navigate anyway
      navigate('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      title="Logout"
      className="fixed top-4 right-4 z-[60] flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 active:scale-95 transition-all"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
};

export default LogoutButton;
