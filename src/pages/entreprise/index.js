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
        const openOffersRes = await axiosInstance.get(`/compte-entreprises/${entrepriseId}/open-offers`);
        const totalOffersRes = await axiosInstance.get(`/compte-entreprises/${entrepriseId}/total-offers`);
        const totalInterviewsRes = await axiosInstance.get(`/compte-entreprises/${entrepriseId}/total-interviews`);
        const totalHRRes = await axiosInstance.get(`/compte-entreprises/${entrepriseId}/rh`);
        const totalSupervisorsRes = await axiosInstance.get(`/compte-entreprises/${entrepriseId}/supervisors`);
        const confirmedInternshipsRes = await axiosInstance.get(`/compte-entreprises/${entrepriseId}/total-internships-confirmed`);
        const totalInternshipsRes = await axiosInstance.get(`/compte-entreprises/${entrepriseId}/total-internships`);

        // Fetch company active internships
        const activeInternshipsRes = await axiosInstance.get(`/api/encadrants/company/${entrepriseId}/active-internships`);

        const statsData = [
          { title: "Offres ouvertes", value: openOffersRes.data },
          { title: "Total des offres", value: totalOffersRes.data },
          { title: "Total des entretiens", value: totalInterviewsRes.data },
          { title: "Total des RH", value: totalHRRes.data },
          { title: "Total des superviseurs", value: totalSupervisorsRes.data },
          { title: "Stages confirmés", value: confirmedInternshipsRes.data },
          { title: "Total des offres de stages", value: totalInternshipsRes.data },
          { title: "Stages actifs de l'entreprise", value: activeInternshipsRes.data }, // Added this line
        ];

        setStats(statsData);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        router.push('/');
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Layout role="company">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord de l'entreprise</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} />
          ))}
        </div>
      </div>
    </Layout>
  );
}