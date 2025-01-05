import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';

export default function StudentDashboard() {
  const router = useRouter();
  const { id } = router.query;

  // Sample data - replace with actual API calls
  const stats = {
    visibleOffers: 150,
    applications: 12,
    interviews: 5,
    internships: 2,
    universityStudents: 1250
  };

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
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Available Offers" value={stats.visibleOffers} />
          <StatCard title="My Applications" value={stats.applications} />
          <StatCard title="Upcoming Interviews" value={stats.interviews} />
          <StatCard title="Active Internships" value={stats.internships} />
          <StatCard title="University Students" value={stats.universityStudents} />
        </div>
      </div>
    </Layout>
  );
}