import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import FormComponent from '@/components/FormComponent';
import Table from '@/components/Table';

export default function StudentsManagement() {
  const router = useRouter();
  const { id } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Sample data for testing
  const [students, setStudents] = useState([
    {
      id: 1,
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      major: "Computer Science",
      year: "2024"
    },
    {
      id: 2,
      firstname: "Jane",
      lastname: "Smith",
      email: "jane.smith@example.com",
      major: "Engineering",
      year: "2025"
    }
  ]);

  const handleLogout = () => {
    router.push('/');
  };

  const handleSearch = (query) => {
    // Implement search logic here
    console.log('Searching for:', query);
  };

  const handleCreateStudent = (studentData) => {
    // Implement student creation logic here
    console.log('Creating student:', studentData);
    setIsModalOpen(false);
  };

  const handleEditStudent = (studentId, updatedData) => {
    // Implement edit logic here
    console.log('Editing student:', studentId, updatedData);
  };

  const handleDeleteStudent = (studentId) => {
    // Implement delete logic here
    console.log('Deleting student:', studentId);
  };

  const studentFields = [
    { name: 'firstname', placeholder: 'First Name', type: 'text' },
    { name: 'lastname', placeholder: 'Last Name', type: 'text' },
    { name: 'email', placeholder: 'Email', type: 'email' },
    { name: 'major', placeholder: 'Major', type: 'text' },
    { name: 'year', placeholder: 'Graduation Year', type: 'text' }
  ];

  return (
    <Layout role="university" userId={id} onLogout={handleLogout}>
      <h1 className="text-3xl font-bold mb-12 mt-12">Students Management</h1>
      <div className="flex justify-between items-center mb-6">
        <SearchBar onSearch={handleSearch} />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Student
        </button>
      </div>
      <Table
        columns={["First Name", "Last Name", "Email", "Major", "Year"]}
        items={students}
        buttons={["Edit", "Delete"]}
        actions={[handleEditStudent, handleDeleteStudent]}
      />
      <FormComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateStudent}
        fields={studentFields}
        title="Create New Student"
      />
    </Layout>
  );
}

