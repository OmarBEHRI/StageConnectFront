import { useState } from 'react';
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Table from '@/components/Table';
import FormComponent from '@/components/FormComponent';
import { useState, useEffect } from 'react'

export default function HRInterviews() {
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
  const [isInternshipFormOpen, setIsInternshipFormOpen] = useState(false);

  // Mock data - replace with actual data
  const interviews = [
    { id: 1, studentname: "John Doe", offerid: "OFF001", role: "Software Engineer", date: "2024-03-15" },
    // Add more interviews...
  ];

  const internshipFormFields = [
    { name: "startDate", type: "date", placeholder: "Start Date" },
    { name: "endDate", type: "date", placeholder: "End Date" },
    { name: "supervisor", placeholder: "Supervisor Name" },
    { name: "department", placeholder: "Department" }
  ];

  const handleAccept = (interviewId) => {
    setIsInternshipFormOpen(true);
  };

  const handleRefuse = (interviewId) => {
    console.log('Refuse interview:', interviewId);
  };

  const handleCreateInternship = (data) => {
    console.log('Create internship:', data);
    setIsInternshipFormOpen(false);
  };


  return (
    <Layout role="hr">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Interviews Management</h1>
        
        <SearchBar onSearch={(query) => console.log('Search:', query)} />

        <Table 
          columns={["Student Name", "Offer ID", "Role", "Date"]}
          items={interviews}
          buttons={["Accept", "Refuse"]}
          actions={[handleAccept, handleRefuse]}
        />

        <FormComponent 
          isOpen={isInternshipFormOpen}
          onClose={() => setIsInternshipFormOpen(false)}
          onSubmit={handleCreateInternship}
          fields={internshipFormFields}
          title="Create Internship"
        />
      </div>
    </Layout>
  );
}