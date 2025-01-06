import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Table from '@/components/Table';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ComOffers() {
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
  const offers = [
    { 
      id: 1, 
      title: "Software Engineer Intern",
      position: "Engineering",
      startdate: "2024-06-01",
      status: "Open",
      applicants: "12"
    },
    // Add more offers...
  ];


  return (
    <Layout role="company">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Company Offers</h1>
        
        <SearchBar onSearch={(query) => console.log('Search:', query)} />

        <Table 
          columns={["Title", "Position", "Start Date", "Status", "Applicants"]}
          items={offers}
        />
      </div>
    </Layout>
  );
}