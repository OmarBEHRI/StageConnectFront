import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function StudentProfile() {
  const router = useRouter();
  const handleLogout = () => {
    // Add logout logic here
    router.push('/');
  };


  return (
    <Layout
      role="student"
      onLogout={handleLogout}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Student Profile</h1>
        {/* Add profile content here */}
      </div>
    </Layout>
  );
}