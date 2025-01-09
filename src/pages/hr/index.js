import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function HRDashboard() {
  const router = useRouter();

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

  // Mock data - replace with actual data
  const stats = [
    { title: "Offres ouvertes", value: "12" },
    { title: "Total des candidats", value: "156" },
    { title: "Total des entretiens", value: "45" },
    { title: "Total des stages", value: "28" }
  ];

  return (
    <Layout role="hr">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord RH</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </div>
    </Layout>
  );
}