import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import FormComponent from '@/components/FormComponent';
import Table from '@/components/Table';

export default function UniversityCoordinatorsManagement() {
  const router = useRouter();
  const { id } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Sample data for the table
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'John', lastname: 'Doe' },
    { id: 2, name: 'Jane', lastname: 'Smith' },
    { id: 3, name: 'Alice', lastname: 'Johnson' },
    { id: 4, name: 'Bob', lastname: 'Brown' },
    { id: 5, name: 'Charlie', lastname: 'Davis' },
    { id: 6, name: 'David', lastname: 'Wilson' },
    { id: 7, name: 'Eve', lastname: 'Martinez' },
    { id: 8, name: 'Frank', lastname: 'Garcia' },
    { id: 9, name: 'Grace', lastname: 'Lee' },
    { id: 10, name: 'Hank', lastname: 'Walker' },
  ]);

  // Form fields configuration
  const formFields = [
    { name: 'name', placeholder: 'Name', type: 'text' },
    { name: 'lastname', placeholder: 'Last Name', type: 'text' },
    { name: 'username', placeholder: 'Username', type: 'text' },
    { name: 'password', placeholder: 'Password', type: 'password' },
  ];

  const handleLogout = () => {
    router.push('/');
  };

  const handleSearch = (query) => {
    // Implement search logic here
    console.log('Searching for:', query);
  };

  const handleCreateAccount = (accountData) => {
    // Add new account to the list with a generated ID
    const newAccount = {
      id: accounts.length + 1,
      name: accountData.name,
      lastname: accountData.lastname,
    };
    setAccounts([...accounts, newAccount]);
    setIsModalOpen(false);
  };

  return (
    <Layout role="university" userId={id} onLogout={handleLogout}>
      <h1 className="text-3xl font-bold mb-6">University Accounts Management</h1>
      <div className="flex justify-between items-center mb-6">
        <SearchBar onSearch={handleSearch} />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Account
        </button>
      </div>
      
      <Table 
        columns={['ID', 'Name', 'Last Name']}
        items={accounts}
        buttons={['Edit', 'Delete']}
        actions={[
          (id) => console.log('Edit', id),
          (id) => console.log('Delete', id)
        ]}
      />

      <FormComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAccount}
        fields={formFields}
        title="Create New Account"
      />
    </Layout>
  );
}

