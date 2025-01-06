import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import FormComponent from '@/components/FormComponent';
import Table from '@/components/Table';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function UniversityCoordinatorsManagement() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [formData, setFormData] = useState({});
  const [editAccountId, setEditAccountId] = useState(null);
  const [ecoleId, setEcoleId] = useState(null);

  // Fetch the CompteEcole ID from local storage
  const compteEcoleId = localStorage.getItem('id');

  // Fetch the Ecole ID and CoordinateurDeStage accounts on component mount
  useEffect(() => {
    if (compteEcoleId) {
      fetchEcoleId();
    }
  }, [compteEcoleId]);

  const fetchEcoleId = async () => {
    try {
      const response = await axiosInstance.get(`/compte-ecoles/${compteEcoleId}`);
      const ecoleId = response.data.ecoleId;
      setEcoleId(ecoleId);
      fetchCoordinateurDeStageAccounts(ecoleId);
    } catch (error) {
      console.error('Error fetching Ecole ID:', error);
    }
  };

  const fetchCoordinateurDeStageAccounts = async (ecoleId) => {
    try {
      const response = await axiosInstance.get(`/api/coordinateurs/by-ecole/${ecoleId}`);
      setAccounts(response.data);
      setFilteredAccounts(response.data);
    } catch (error) {
      console.error('Error fetching CoordinateurDeStage accounts:', error);
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleSearch = (query) => {
    if (query.trim() === '') {
      setFilteredAccounts(accounts);
      return;
    }
    const filtered = accounts.filter(account =>
      account.nom.toLowerCase().includes(query.toLowerCase()) ||
      account.prenom.toLowerCase().includes(query.toLowerCase()) ||
      account.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAccounts(filtered);
  };

  const handleCreateAccount = async (formData) => {
    try {
      const response = await axiosInstance.post('/api/coordinateurs', {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        motDePasse: formData.motDePasse,
        telephone: formData.telephone,
        ecoleId: ecoleId,
      });
      setAccounts([...accounts, response.data]);
      setFilteredAccounts([...filteredAccounts, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating CoordinateurDeStage account:', error);
    }
  };

  const handleEdit = (id) => {
    const accountToEdit = accounts.find(account => account.idCs === id);
    setFormData(accountToEdit);
    setEditAccountId(id);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (formData) => {
    try {
      const response = await axiosInstance.put(`/api/coordinateurs/${editAccountId}`, formData);
      const updatedAccounts = accounts.map(account =>
        account.idCs === editAccountId ? response.data : account
      );
      setAccounts(updatedAccounts);
      setFilteredAccounts(updatedAccounts);
      setIsModalOpen(false);
      setEditAccountId(null);
    } catch (error) {
      console.error('Error updating CoordinateurDeStage account:', error);
    }
  };

  const formFields = [
    { name: 'nom', placeholder: 'Nom', type: 'text' },
    { name: 'prenom', placeholder: 'Prénom', type: 'text' },
    { name: 'email', placeholder: 'Email', type: 'email' },
    { name: 'telephone', placeholder: 'Téléphone', type: 'text' },
    { name: 'motDePasse', placeholder: 'Mot de passe', type: 'password' },
  ];

  return (
    <Layout role="university" onLogout={handleLogout}>
      <h1 className="text-3xl font-bold mb-6">Gestion des Coordinateurs de Stage</h1>
      <div className="flex justify-between items-center mb-6">
        <SearchBar onSearch={handleSearch} />
        <button
          onClick={() => {
            setFormData({});
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Créer un compte
        </button>
      </div>
      
      <Table 
        columns={['ID', 'Nom', 'Prénom', 'Email', 'Téléphone']}
        columnKeys={['idCs', 'nom', 'prenom', 'email', 'telephone']}
        items={filteredAccounts}
        buttons={['Modifier']}
        actions={[handleEdit]}
        idParam="idCs"
      />

      <FormComponent
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditAccountId(null);
        }}
        onSubmit={editAccountId ? handleSaveEdit : handleCreateAccount}
        fields={formFields}
        title={editAccountId ? "Modifier le compte" : "Créer un nouveau compte"}
        submitButtonText={editAccountId ? "Enregistrer" : "Créer"}
        prefillData={formData}
      />
    </Layout>
  );
}