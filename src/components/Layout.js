import Navbar from '@/components/NavBar'
import { getNavLinks } from '@/config/navigation';

export default function Layout({ children, role, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar 
              links={getNavLinks(role)} 
              onLogout={onLogout}
            />
      <main className="p-8">{children}</main>
    </div>
  )
}

