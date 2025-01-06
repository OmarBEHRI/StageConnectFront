import Layout from '@/components/Layout';
import { useState, useEffect } from 'react'

export default function ComProfile() {
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
      role="company"
    >
      <h1>Company Dashboard</h1>
    </Layout>
  );
}