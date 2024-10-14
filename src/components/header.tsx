// src/components/Header.tsx
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext'; // Adjust the path if needed
import './header.css';


export default function Header() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/super-admin/login');
  };

  return (
    <header className="header">
      {/* Home Logo */}
      <div onClick={() => router.push('/super-admin/dashboard')} className="logo">
        Home
      </div>

      {/* Logout Button */}
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </header>
  );
}
