import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function CFDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState([
    { title: 'Students in Major', value: 'Loading...' },
    { title: 'Students with Internships', value: 'Loading...' },
    { title: 'Visible Offers', value: 'Loading...' },
    { title: 'Internships Found', value: 'Loading...' },
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
      const id = localStorage.getItem('id'); // Get the CF ID from localStorage

      // Fetch ChefDeFiliere details to get filiereId
      const chefDeFiliereResponse = await axiosInstance.get(`/chefs-de-filiere/${id}`);
      const filiereId = chefDeFiliereResponse.data.filiereId;

      // Fetch total students in the major
      const totalStudentsResponse = await axiosInstance.get(`/compte-ecoles/${filiereId}/total-students`);
      const totalStudents = totalStudentsResponse.data;

      // Fetch students with internships
      const studentsWithInternshipsResponse = await axiosInstance.get(`/compte-ecoles/students-with-internship/${filiereId}`);
      const studentsWithInternships = studentsWithInternshipsResponse.data;

      // Fetch internships found
      const internshipsFoundResponse = await axiosInstance.get(`/compte-ecoles/students-with-internship/${filiereId}`);
      const internshipsFound = internshipsFoundResponse.data;

      // Fetch visible offers
      const visibleOffersResponse = await axiosInstance.get(`/compte-ecoles/${filiereId}/visible-offers`);
      const visibleOffers = visibleOffersResponse.data;

      // Update stats state
      setStats([
        { title: 'Students in Major', value: totalStudents },
        { title: 'Students with Internships', value: studentsWithInternships },
        { title: 'Visible Offers', value: visibleOffers },
        { title: 'Internships Found', value: internshipsFound },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setLoading(false);
    }
  };

  return (
    <Layout role="cf">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-6">Career Fair Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} />
          ))}
        </div>
      </div>
    </Layout>
  );
}