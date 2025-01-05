import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';

export default function SupervisorDashboard() {
  const router = useRouter();

  // Mock data - replace with actual data
  const stats = [
    // Supervisor stats
    { title: "Ongoing Internships", value: "5" },
    { title: "Total Internships Supervised", value: "15" },
    // Company stats
    { title: "Company Total Interns", value: "25" },
    { title: "Company Active Internships", value: "12" }
  ];

  return (
    <Layout
      role="supervisor"
      onLogout={() => router.push('/')}
    >
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-6">Supervisor Dashboard</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">My Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.slice(0, 2).map((stat) => (
              <StatCard key={stat.title} title={stat.title} value={stat.value} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Company Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.slice(2).map((stat) => (
              <StatCard key={stat.title} title={stat.title} value={stat.value} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}