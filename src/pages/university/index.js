import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import StatisticsSection from '@/components/university/StatisticsSection';
import axiosInstance from '@/axiosInstance/axiosInstance'

export default function UniversityDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      if (token) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);
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


  return (
    <Layout role="university">
      <h1 className="text-3xl font-bold mb-6">University Dashboard</h1>
      {stats && <StatisticsSection stats={stats} />}
    </Layout>
  );
}

