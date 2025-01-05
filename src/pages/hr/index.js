import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';

export default function HRDashboard() {
  const router = useRouter();
  const { id } = router.query;

  const handleLogout = () => {
    // Add logout logic here
    router.push('/');
  };

  // Mock data - replace with actual data
  const stats = [
    { title: "Open Offers", value: "12" },
    { title: "Total Applicants", value: "156" },
    { title: "Total Interviews", value: "45" },
    { title: "Total Internships", value: "28" }
  ];

  if (!id) return null;

  return (
    <Layout
      role="hr"
      userId={id}
      onLogout={handleLogout}
    >
      <h1 className="text-2xl font-bold mb-6">HR Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </div>
    </Layout>
  );
}