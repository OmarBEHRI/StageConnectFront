import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function CompanyDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check for token
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/');
          return;
        }

        // Set authorization header
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;

        // Fetch compte-entreprise data
        const id = localStorage.getItem("id");
        const compteResponse = await axiosInstance.get(`/compte-entreprises/${id}`);
        const entrepriseId = compteResponse.data.entrepriseId;

        // Fetch statistics
        const endpoints = [
          { title: "Open Offers", endpoint: `/compte-entreprises/${entrepriseId}/open-offers` },
          { title: "Total Offers", endpoint: `/compte-entreprises/${entrepriseId}/total-offers` },
          { title: "Total Interviews", endpoint: `/compte-entreprises/${entrepriseId}/total-interviews` },
          { title: "Total HR", endpoint: `/compte-entreprises/${entrepriseId}/rh` },
          { title: "Total Supervisors", endpoint: `/compte-entreprises/${entrepriseId}/supervisors` },
          { title: "Total Confirmed Internships", endpoint: `/compte-entreprises/${entrepriseId}/total-internships-confirmed` },
          { title: "Total Internships Offers", endpoint: `/compte-entreprises/${entrepriseId}/total-internships` },
        ];

        const statsData = await Promise.all(
          endpoints.map(async (stat) => {
            const response = await axiosInstance.get(stat.endpoint);
            return { title: stat.title, value: response.data };
          })
        );

        setStats(statsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push('/');
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout role="company">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-6">Company Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} />
          ))}
        </div>
      </div>
    </Layout>
  );
}