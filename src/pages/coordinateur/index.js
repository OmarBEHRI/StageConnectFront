import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function CoordinatorDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState([
    { title: 'Université', value: 'Loading...' },
    { title: 'Total des étudiants', value: 'Loading...' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
        fetchStatistics();
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const fetchStatistics = async () => {
    try {
      const id = localStorage.getItem('id'); // Get the coordinator ID from localStorage

      // Fetch coordinator details to get ecoleId
      const coordinatorResponse = await axiosInstance.get(`/api/coordinateurs/${id}`);
      const ecoleId = coordinatorResponse.data.ecoleId;

      // Fetch university name
      const universityResponse = await axiosInstance.get(`/api/ecoles/${ecoleId}`);
      const universityName = universityResponse.data.nom;

      // Fetch total students
      const totalStudentsResponse = await axiosInstance.get(`/compte-ecoles/${ecoleId}/students`);
      const totalStudents = totalStudentsResponse.data;

      // Update stats state
      setStats([
        { title: 'Université', value: universityName },
        { title: 'Total des étudiants', value: totalStudents },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setLoading(false);
    }
  };

  return (
    <Layout role="coordinator">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord du coordinateur</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} />
          ))}
        </div>
      </div>
    </Layout>
  );
}