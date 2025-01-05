import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function ComProfile() {
  const router = useRouter();
  const { id } = router.query;

  const handleLogout = () => {
    router.push('/');
  };

  if (!id) return null;

  return (
    <Layout
      role="company"
      userId={id}
      onLogout={handleLogout}
    >
      <h1>Company Dashboard</h1>
    </Layout>
  );
}