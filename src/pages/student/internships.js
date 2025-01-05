import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Card from '@/components/Card';

export default function StudentInternships() {
  const router = useRouter();
  const { id } = router.query;

  const [internships, setInternships] = useState([ // Sample data
    {
      id: 1,
      company: "Tech Corp",
      companyLogo: "/images/sample-logo.jpg",
      subject: "Web Application Development",
      supervisor: "John Doe",
      supervisorEmail: "john.doe@techcorp.com",
      startDate: "2024-05-01",
      endDate: "2024-10-31",
      type: "Paid",
      status: "not_validated"
    },
    // Add more internships...
  ]);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const handleStatusUpdate = (internshipId) => {
    setInternships(internships.map(internship => {
      if (internship.id === internshipId) {
        const statusFlow = {
          'not_validated': 'pending',
          'pending': 'validated',
          'validated': 'confirmed'
        };
        return {
          ...internship,
          status: statusFlow[internship.status] || internship.status
        };
      }
      return internship;
    }));
  };

  const getButtonLabel = (status) => {
    const labels = {
      'not_validated': 'Validate',
      'pending': 'Pending',
      'validated': 'Confirm',
      'confirmed': 'Confirmed'
    };
    return labels[status] || 'Validate';
  };

  const handleLogout = () => {
    // Add logout logic here
    router.push('/');
  };

  if (!id) return null;

  return (
    <Layout role="student" userId={id} onLogout={handleLogout}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Internships</h1>
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {internships.map((internship) => (
            <Card
              key={internship.id}
              image={internship.companyLogo}
              title={internship.company}
              specifications={[
                { label: "Subject", value: internship.subject },
                { label: "Supervisor", value: internship.supervisor },
                { label: "Email", value: internship.supervisorEmail, isLink: true },
                { label: "Start Date", value: internship.startDate },
                { label: "End Date", value: internship.endDate },
                { label: "Type", value: internship.type }
              ]}
              buttons={[
                {
                  label: getButtonLabel(internship.status),
                  onClick: () => handleStatusUpdate(internship.id)
                }
              ]}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}