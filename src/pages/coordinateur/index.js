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
    { title: 'Offres totales', value: 'Loading...' },
    { title: 'Étudiants sans stage', value: 'Loading...' },
    { title: 'Pourcentage de stages par filière', value: 'Loading...' },
    { title: 'Offres par filière', value: 'Loading...' },
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
      const universityName = universityResponse.data.nomEcole;

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
      const internshipPercentageByMajor = [];
      for (const filiere of filieres) {
        const percentageResponse = await axiosInstance.get(`/compte-ecoles/internship-percentage/${filiere.idFiliere}`);
        internshipPercentageByMajor.push({
          filiere: filiere.nomFiliere,
          percentage: percentageResponse.data,
        });
      }

      // Fetch offers by major
      const offersByMajor = [];
      for (const filiere of filieres) {
        const offersResponse = await axiosInstance.get(`/compte-ecoles/${filiere.idFiliere}/visible-offers`);
        offersByMajor.push({
          filiere: filiere.nomFiliere,
          offers: offersResponse.data.length,
        });
      }

      // Update stats state
      setStats([
        { title: 'Université', value: universityName },
        { title: 'Total des étudiants', value: totalStudents },
        { title: 'Offres totales', value: totalOffers },
        { title: 'Étudiants sans stage', value: studentsWithoutInternship },
        {
          title: 'Pourcentage de stages par filière',
          value: (
            <ul>
              {internshipPercentageByMajor.map((item, index) => (
                <li key={index}>
                  {item.filiere}: {item.percentage}%
                </li>
              ))}
            </ul>
          ),
        },
        {
          title: 'Offres par filière',
          value: (
            <ul>
              {offersByMajor.map((item, index) => (
                <li key={index}>
                  {item.filiere}: {item.offers} offres
                </li>
              ))}
            </ul>
          ),
        },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} title={stat.title} value={stat.value} />
          ))}
        </div>
      </div>
    </Layout>
  );
}