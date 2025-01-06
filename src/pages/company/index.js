import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import { useState, useEffect } from 'react'

export default function CompanyDashboard() {
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
    { title: "Open Offers", value: "8" },
    { title: "Total Offers", value: "15" },
    { title: "Current Applicants", value: "45" },
    { title: "Total Applicants", value: "120" },
    { title: "Active Internships", value: "12" },
    { title: "Scheduled Interviews", value: "25" }
  ];


  return (
    <Layout
      role="company"
    >
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