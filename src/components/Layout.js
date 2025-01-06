import Navbar from '@/components/NavBar'
import { getNavLinks } from '@/config/navigation';
import { useRouter } from 'next/router';

export default function Layout({ children, role }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar 
              links={getNavLinks(role)} 
              onLogout={handleLogout}
            />
      <main className="p-8">{children}</main>
    </div>
  )
}

