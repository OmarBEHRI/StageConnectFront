import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function StudentDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    visibleOffers: 'Loading...',
    applications: 'Loading...',
    interviews: 'Loading...',
    internships: 'Loading...',
    universityStudents: 'Loading...',
  });
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
      const idEtu = localStorage.getItem('id'); // Get the student ID from localStorage

      // Fetch student details to get ecoleId
      const studentResponse = await axiosInstance.get(`/api/etudiants/${idEtu}`);
      const ecoleId = studentResponse.data.ecoleId;
      const filiereId = studentResponse.data.filiereId;

      // Fetch available offers (placeholder, replace with actual endpoint if available)
      // Fetch available offers for the student's filiere
      const visibleOffersResponse = await axiosInstance.get(`/api/etudiants/${filiereId}/visible/count`);
      const visibleOffers = visibleOffersResponse.data;

     // Replace with actual API call if needed

      // Fetch my applications
      const applicationsResponse = await axiosInstance.get(`/api/etudiants/${idEtu}/postulations/count`);
      const applications = applicationsResponse.data;

      // Fetch internships found
      const internshipsResponse = await axiosInstance.get(`/api/etudiants/${idEtu}/internships/count`);
      const internships = internshipsResponse.data;

      // Fetch upcoming interviews
      const interviewsResponse = await axiosInstance.get(`/api/etudiants/student/${idEtu}/count-interviews`);
      const interviews = interviewsResponse.data;

      // Fetch university students
      const universityStudentsResponse = await axiosInstance.get(`/compte-ecoles/${ecoleId}/students`);
      const universityStudents = universityStudentsResponse.data;

      // Update stats state
      setStats({
        visibleOffers: visibleOffers,
        applications: applications,
        interviews: interviews,
        internships: internships,
        universityStudents: universityStudents,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    router.push('/');
  };

  return (
    <Layout role="student">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Available Offers" value={stats.visibleOffers} />
          <StatCard title="My Applications" value={stats.applications} />
          <StatCard title="Upcoming Interviews" value={stats.interviews} />
          <StatCard title="Active Internships" value={stats.internships} />
          <StatCard title="University Students" value={stats.universityStudents} />
        </div>
      </div>
    </Layout>
  );
}