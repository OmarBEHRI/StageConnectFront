import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Table from '@/components/Table';
import FormComponent from '@/components/FormComponent';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function ComSupervisorManagement() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [entrepriseId, setEntrepriseId] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      if (token) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
        fetchCompteEntreprise();
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const fetchCompteEntreprise = async () => {
    try {
      const compteEntrepriseId = localStorage.getItem('id');
      console.log(`CompteEntrepriseId: ${compteEntrepriseId}`);
      const response = await axiosInstance.get(`/compte-entreprises/${compteEntrepriseId}`);
      const entreId = response.data.entrepriseId;
      setEntrepriseId(entreId);
      fetchEncadrantAccounts(entreId);
    } catch (error) {
      console.error('Error fetching CompteEntreprise:', error);
      alert('Failed to fetch CompteEntreprise data.');
    }
  };

  const fetchEncadrantAccounts = async (entrepriseId) => {
    try {
      console.log(`EntrepriseId: ${entrepriseId}`);
      const response = await axiosInstance.get(`/api/encadrants/by-entreprise/${entrepriseId}`);
      console.log('Encadrant Accounts:', response.data); // Debugging
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching Encadrant accounts:', error);
      alert('Failed to fetch Encadrant accounts.');
    }
  };

  const formFields = [
    { name: "nom", placeholder: "First Name", required: true },
    { name: "prenom", placeholder: "Last Name", required: true },
    { name: "email", placeholder: "Email", required: true },
    { name: "motDePasse", type: "password", placeholder: "Password", required: true },
  ];

  const handleCreateAccount = async (data) => {
    try {
      const encadrantDTO = {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        motDePasse: data.motDePasse,
        entrepriseId: entrepriseId,
      };
      await axiosInstance.post('/api/encadrants', encadrantDTO);
      fetchEncadrantAccounts(entrepriseId);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating Encadrant account:', error);
      alert('Failed to create Encadrant account.');
    }
  };

  const handleEdit = (accountId) => {
    const account = accounts.find(acc => acc.idEncadrant === accountId);
    setSelectedAccount(account);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleEditAccount = async (data) => {
    try {
      const encadrantDTO = {
        idEncadrant: selectedAccount.idEncadrant,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        motDePasse: data.motDePasse,
        entrepriseId: entrepriseId,
      };
      await axiosInstance.put(`/api/encadrants/${selectedAccount.idEncadrant}`, encadrantDTO);
      fetchEncadrantAccounts(entrepriseId);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error updating Encadrant account:', error);
      alert('Failed to update Encadrant account.');
    }
  };

  const handleDelete = async (accountId) => {
    try {
      await axiosInstance.delete(`/api/encadrants/${accountId}`);
      fetchEncadrantAccounts(entrepriseId);
    } catch (error) {
      console.error('Error deleting Encadrant account:', error);
      alert('Failed to delete Encadrant account.');
    }
  };

  return (
    <Layout role="company">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Company Supervisor Management</h1>

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
            Create New Supervisor
          </button>
        </div>

        <Table
          columns={["Email", "First Name", "Last Name"]}
          columnKeys={["email", "nom", "prenom"]}
          items={accounts}
          buttons={["Edit", "Delete"]}
          actions={[handleEdit, handleDelete]}
          idParam="idEncadrant"
        />

        <FormComponent
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setIsEditMode(false);
            setSelectedAccount(null);
          }}
          onSubmit={isEditMode ? handleEditAccount : handleCreateAccount}
          fields={formFields}
          title={isEditMode ? "Edit Supervisor" : "Create New Supervisor"}
          submitButtonText={isEditMode ? "Enregistrer" : "Créer"}
          prefillData={selectedAccount}
        />
      </div>
    </Layout>
  );
}