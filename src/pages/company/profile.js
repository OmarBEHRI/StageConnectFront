import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function ComProfile() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };


  return (
    <Layout
      role="company"
      onLogout={handleLogout}
    >
      <h1>Company Dashboard</h1>
    </Layout>
  );
}