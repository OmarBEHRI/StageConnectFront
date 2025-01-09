import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import StatisticsSection from '@/components/university/StatisticsSection';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function UniversityDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
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
      const idEcole = localStorage.getItem('id'); // Get the university ID from localStorage

      // Fetch university details to get ecoleId
      const universityResponse = await axiosInstance.get(`/compte-ecoles/${idEcole}`);
      const ecoleId = universityResponse.data.ecoleId;

      // Fetch total students
      const totalStudentsResponse = await axiosInstance.get(`/compte-ecoles/${ecoleId}/students`);
      const totalStudents = totalStudentsResponse.data;

      // Fetch total offers
      const totalOffersResponse = await axiosInstance.get('/api/admins/open-offers/count');
      const totalOffers = totalOffersResponse.data;

      // Fetch students without internships
      const studentsWithoutInternshipResponse = await axiosInstance.get(`/compte-ecoles/${ecoleId}/students-without-internship`);
      const studentsWithoutInternship = studentsWithoutInternshipResponse.data;

      // Fetch filieres by ecoleId
      const filieresResponse = await axiosInstance.get(`/api/filieres/ecole/${ecoleId}`);
      const filieres = filieresResponse.data;

      // Fetch internship percentage by major
      const internshipPercentageByMajor = {};
      for (const filiere of filieres) {
        const percentageResponse = await axiosInstance.get(`/compte-ecoles/internship-percentage/${filiere.idFiliere}`);
        internshipPercentageByMajor[filiere.nomFiliere] = percentageResponse.data;
      }

      // Fetch offers by major
      const offersByMajor = {};
      for (const filiere of filieres) {
        const offersResponse = await axiosInstance.get(`/compte-ecoles/${filiere.idFiliere}/visible-offers`);
        offersByMajor[filiere.nomFiliere] = offersResponse.data;
      }

      // Update stats state
      setStats({
        students: totalStudents,
        offers: totalOffers,
        studentsWithoutInternship: studentsWithoutInternship,
        internshipPercentageByMajor: internshipPercentageByMajor,
        offersByMajor: offersByMajor,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setLoading(false);
    }
  };

  return (
    <Layout role="coordinator">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord de l'université</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : stats ? (
        <StatisticsSection stats={stats} />
      ) : (
        <p>Aucune donnée disponible</p>
      )}
    </Layout>
  );
}