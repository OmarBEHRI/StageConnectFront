import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function StudentProfile() {
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


  return (
    <Layout
      role="student"
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Student Profile</h1>
        {/* Add profile content here */}
      </div>
    </Layout>
  );
}