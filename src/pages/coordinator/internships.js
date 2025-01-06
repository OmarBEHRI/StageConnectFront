import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Table from '@/components/Table';
import { useState, useEffect } from 'react'

export default function CoordinatorInternships() {
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
      firstname: "John",
      lastname: "Doe",
      subject: "Web Development",
      company: "Tech Corp",
      major: "Computer Science"
    },
    {
      id: 2,
      firstname: "Jane",
      lastname: "Smith",
      subject: "Data Analysis",
      company: "Data Systems",
      major: "Data Science"
    }
  ];

  const handleValidate = (internshipId) => {
    console.log('Validating internship:', internshipId);
    // Implement validation logic here
  };

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // Implement search logic here
  };


  return (
    <Layout role="coordinator">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Internship Validations</h1>
        
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <Table 
          columns={["First Name", "Last Name", "Subject", "Company", "Major"]}
          items={internships.map(intern => ({
            ...intern,
            "First Name": intern.firstname,
            "Last Name": intern.lastname
          }))}
          buttons={["Validate"]}
          actions={[handleValidate]}
        />
      </div>
    </Layout>
  );
}