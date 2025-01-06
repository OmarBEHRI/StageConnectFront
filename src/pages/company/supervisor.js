
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Table from '@/components/Table';
import FormComponent from '@/components/FormComponent';
import { useState, useEffect } from 'react'

export default function ComSupervisorManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
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
  const accounts = [
    { id: 1, username: "jsmith", firstname: "John", lastname: "Smith" },
    { id: 2, username: "mjohnson", firstname: "Mary", lastname: "Johnson"},
  ];

  const formFields = [
    { name: "firstname", placeholder: "First Name" },
    { name: "lastname", placeholder: "Last Name" },
    { name: "username", placeholder: "Username" },
    { name: "password", type: "password", placeholder: "Password" },
  ];

  const handleCreateAccount = (data) => {
    console.log('New account:', data);
    setIsFormOpen(false);
  };

  const handleEdit = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    setSelectedAccount(account);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleDelete = (accountId) => {
    console.log('Delete account:', accountId);
  };


  return (
    <Layout role="company">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Company Accounts Management</h1>
        
        <div className="flex justify-between items-center">
          <SearchBar onSearch={(query) => console.log('Search:', query)} />
          <button 
            onClick={() => {
              setIsEditMode(false);
              setSelectedAccount(null);
              setIsFormOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Account
          </button>
        </div>

        <Table 
          columns={["Username", "First Name", "Last Name", "Role"]}
          items={accounts}
          buttons={["Edit", "Delete"]}
          actions={[handleEdit, handleDelete]}
        />

        <FormComponent 
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setIsEditMode(false);
            setSelectedAccount(null);
          }}
          onSubmit={handleCreateAccount}
          fields={formFields}
          title={isEditMode ? "Edit Account" : "Create New Account"}
        />
      </div>
    </Layout>
  );
}