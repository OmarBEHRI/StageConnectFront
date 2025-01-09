import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function SupervisorDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState([
    { title: 'Stages en cours', value: 'Loading...' },
    { title: 'Total des stages supervisés', value: 'Loading...' },
    { title: 'Total des stagiaires de l\'entreprise', value: 'Loading...' },
    { title: 'Stages actifs de l\'entreprise', value: 'Loading...' },
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
      const supervisorId = localStorage.getItem('id'); // Get the supervisor ID from localStorage

      // Fetch supervisor details to get entrepriseId
      const supervisorResponse = await axiosInstance.get(`/api/encadrants/${supervisorId}`);
      const entrepriseId = supervisorResponse.data.entrepriseId;

      // Fetch ongoing internships
      const ongoingInternshipsResponse = await axiosInstance.get(`/api/encadrants/${supervisorId}/ongoing-internships`);
      const ongoingInternships = ongoingInternshipsResponse.data;

      // Fetch total internships supervised
      const totalInternshipsResponse = await axiosInstance.get(`/api/encadrants/${supervisorId}/total-internships`);
      const totalInternships = totalInternshipsResponse.data;

      // Fetch company total interns
      const companyTotalInternsResponse = await axiosInstance.get(`/compte-entreprises/${entrepriseId}/total-internships-confirmed`);
      const companyTotalInterns = companyTotalInternsResponse.data;

      // Fetch company active internships
      const companyActiveInternshipsResponse = await axiosInstance.get(`/api/encadrants/company/${entrepriseId}/active-internships`);
      const companyActiveInternships = companyActiveInternshipsResponse.data;

      // Update stats state
      setStats([
        { title: 'Stages en cours', value: ongoingInternships },
        { title: 'Total des stages supervisés', value: totalInternships },
        { title: 'Total des stagiaires de l\'entreprise', value: companyTotalInterns },
        { title: 'Stages actifs de l\'entreprise', value: companyActiveInternships },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setLoading(false);
    }
  };

  return (
    <Layout role="supervisor">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord du superviseur</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Mes statistiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.slice(0, 2).map((stat, index) => (
              <StatCard key={index} title={stat.title} value={stat.value} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Statistiques de l'entreprise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.slice(2).map((stat, index) => (
              <StatCard key={index} title={stat.title} value={stat.value} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}