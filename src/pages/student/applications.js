import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Table from '@/components/Table';

export default function StudentApplications() {
  const router = useRouter();

  // Sample data
  const [applications] = useState({
    columns: ['Company', 'Position', 'Type', 'Domain', 'Status'],
    items: [
      {
        id: 1,
        company: 'Tech Corp',
        position: 'Frontend Developer',
        type: 'Paid',
        domain: 'Web Development',
        status: 'pending'
      },
      {
        id: 2,
        company: 'DataMinds AI',
        position: 'ML Engineer Intern',
        type: 'Paid',
        domain: 'Machine Learning',
        status: 'accepted'
      },
      {
        id: 3,
        company: 'CloudScale Solutions',
        position: 'DevOps Intern',
        type: 'Paid',
        domain: 'Cloud Infrastructure',
        status: 'refused'
      },
      {
        id: 4,
        company: 'GreenTech Innovations',
        position: 'Backend Developer',
        type: 'Unpaid',
        domain: 'Software Development',
        status: 'pending'
      },
      {
        id: 5,
        company: 'FinTech Solutions',
        position: 'Full Stack Developer',
        type: 'Paid',
        domain: 'Financial Technology',
        status: 'pending'
      },
      {
        id: 6,
        company: 'Mobile Masters',
        position: 'Mobile App Developer',
        type: 'Paid',
        domain: 'Mobile Development',
        status: 'accepted'
      }
    ]
  });

  const getStatusColor = (status) => {
    const colors = {
      refused: 'text-red-600',
      pending: 'text-orange-600',
      accepted: 'text-green-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const handleSearch = (query) => {
    // Implement search logic
    console.log("Searching for:", query);
  };
  const handleLogout = () => {
    // Add logout logic here
    router.push('/');
  };


  return (
    <Layout role="student" onLogout={handleLogout}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Applications</h1>
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="overflow-x-auto">
          <Table 
            columns={applications.columns}
            items={applications.items.map(item => ({
              ...item,
              status: <span className={getStatusColor(item.status)}>{item.status}</span>
            }))}
          />
        </div>
      </div>
    </Layout>
  );
}