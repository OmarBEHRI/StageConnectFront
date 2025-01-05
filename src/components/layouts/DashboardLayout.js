import Navbar from '@/components/NavBar';
import { getNavLinks } from '@/config/navigation';

export default function DashboardLayout({ children, role, userId, onLogout }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar 
        links={getNavLinks(role)} 
        userId={userId} 
        onLogout={onLogout}
      />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}