import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Table from '@/components/Table';
import FormComponent from '@/components/FormComponent';

export default function HROfferManagement() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Mock data - replace with actual data
  const offers = [
    { id: 1, title: "Software Engineer Intern", department: "Engineering", startdate: "2024-06-01", status: "Open" },
    // Add more offers...
  ];

  const formFields = [
    { name: "title", placeholder: "Offer Title" },
    { name: "department", placeholder: "Department" },
    { name: "startdate", type: "date", placeholder: "Start Date" },
    { name: "description", placeholder: "Job Description" }
  ];

  const handleCreateOffer = (data) => {
    console.log('New offer:', data);
    setIsFormOpen(false);
  };

  const handleDelete = (offerId) => {
    console.log('Delete offer:', offerId);
  };

  const handleViewApplicants = (offerId) => {
    router.push(`/hr/applications/${offerId}`);
  };


  return (
    <Layout role="hr" onLogout={() => router.push('/')}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Offers Management</h1>
        
        <div className="flex justify-between items-center">
          <SearchBar onSearch={(query) => console.log('Search:', query)} />
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Offer
          </button>
        </div>

        <Table 
          columns={["Title", "Department", "Start Date", "Status"]}
          items={offers}
          buttons={["View Applicants", "Delete"]}
          actions={[handleViewApplicants, handleDelete]}
        />

        <FormComponent 
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateOffer}
          fields={formFields}
          title="Create New Offer"
        />
      </div>
    </Layout>
  );
}