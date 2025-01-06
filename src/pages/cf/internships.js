import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Card from '@/components/Card';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CFInternships() {
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
  const internships = [
    {
      id: 1,
      image: "/student-avatar.png",
      studentName: "John Doe",
      company: "Tech Corp",
      position: "Software Engineer Intern",
      period: "Jun 2024 - Dec 2024",
      domain: "Software Development",
    },
    {
      id: 2,
      image: "/student-avatar.png",
      studentName: "Jane Smith",
      company: "Data Systems",
      position: "Data Analyst Intern",
      period: "Jul 2024 - Oct 2024",
      domain: "Data Science",
    },
  ];

  const handleValidate = (internshipId) => {
    console.log('Validating internship:', internshipId);
  };

  const handleRefuse = (internshipId) => {
    console.log('Refusing internship:', internshipId);
  };

  return (
    <Layout role="cf">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Internship Validation Requests</h1>
        
        <div className="mb-6">
          <SearchBar onSearch={(query) => console.log('Search:', query)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {internships.map((internship) => (
            <Card
              key={internship.id}
              image={internship.image}
              title={internship.studentName}
              specifications={[
                { label: "Company", value: internship.company },
                { label: "Position", value: internship.position },
                { label: "Period", value: internship.period },
                { label: "Domain", value: internship.domain },
              ]}
              buttons={[
                { label: "Validate", onClick: () => handleValidate(internship.id) },
                { label: "Refuse", onClick: () => handleRefuse(internship.id) }
              ]}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}