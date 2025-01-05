import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function StudentProfile() {
  const router = useRouter();
  const { id } = router.query;

  const handleLogout = () => {
    // Add logout logic here
    router.push('/');
  };

  if (!id) return null;

  return (
    <Layout
      role="student"
      userId={id}
      onLogout={handleLogout}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Student Profile</h1>
        {/* Add profile content here */}
      </div>
    </Layout>
  );
}