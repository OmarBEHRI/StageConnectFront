import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import StatisticsSection from '@/components/university/StatisticsSection';

export default function UniversityDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch statistics data
    // This is a placeholder. In a real application, you'd fetch this data from your API
    setStats({
      students: 1000,
      offers: 50,
      studentsWithoutInternship: 200,
      internshipPercentageByMajor: {
        'Computer Science': 75,
        'Engineering': 80,
        'Business': 60
      },
      offersByMajor: {
        'Computer Science': 20,
        'Engineering': 15,
        'Business': 15
      }
    });
  }, []);

  const handleLogout = () => {
    // Implement logout logic here
    router.push('/');
  };

  return (
    <Layout role="university" onLogout={handleLogout}>
      <h1 className="text-3xl font-bold mb-6">University Dashboard</h1>
      {stats && <StatisticsSection stats={stats} />}
    </Layout>
  );
}

