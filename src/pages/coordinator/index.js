import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CoordinatorDashboard() {
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
    { title: "Pending Validations", value: "12" },
    { title: "University", value: "INSAT" },
    { title: "Total Students", value: "450" }
  ];

  return (
    <Layout
      role="coordinator"
    >
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-6">Coordinator Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} />
          ))}
        </div>
      </div>
    </Layout>
  );
}