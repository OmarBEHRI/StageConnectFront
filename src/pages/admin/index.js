import Layout from '@/components/Layout'
import StatCard from '@/components/StatCard'
import { useRouter } from 'next/router';

export default function Dashboard() {
   const router = useRouter();
    const handleLogout = () => {
      localStorage.clear();
      router.push('/');
    };
    
  // In a real application, you'd fetch this data from an API
  const stats = {
    universityAccounts: 50,
    companyAccounts: 100,
    students: 1000,
    openOffers: 75,
    totalOffers: 200,
    internships: 150,
    interviews: 300,
  }

  return (
    <Layout
        role="admin"
        onLogout={handleLogout}
    >
      <div>
        <h1 className="text-3xl font-bold mb-12 mt-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <StatCard title="University Accounts" value={stats.universityAccounts} />
          <StatCard title="Company Accounts" value={stats.companyAccounts} />
          <StatCard title="Students" value={stats.students} />
          <StatCard title="Open Offers" value={stats.openOffers} />
          <StatCard title="Total Offers" value={stats.totalOffers} />
          <StatCard title="Internships Created" value={stats.internships} />
          <StatCard title="Interviews" value={stats.interviews} />
        </div>
      </div>
    </Layout>
  )
}

