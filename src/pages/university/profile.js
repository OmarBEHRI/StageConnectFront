import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';
import FormComponent from '@/components/FormComponent';
import Table from '@/components/Table';

export default function CompteEcoleProfile() {
  const router = useRouter();
  const [compteEcole, setCompteEcole] = useState(null);
  const [ecole, setEcole] = useState(null);
  const [filieres, setFilieres] = useState([]);
  const [isEditingCompteEcole, setIsEditingCompteEcole] = useState(false);
  const [isEditingEcole, setIsEditingEcole] = useState(false);
  const [isAddingFiliere, setIsAddingFiliere] = useState(false);
  const [editingFiliere, setEditingFiliere] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) router.push('/');
      else fetchProfileData();
    }
  }, [router]);

  const fetchProfileData = async () => {
    try {
      const id = localStorage.getItem('id');
      const compteEcoleResponse = await axiosInstance.get(`/compte-ecoles/${id}`);
      setCompteEcole(compteEcoleResponse.data);

      const ecoleResponse = await axiosInstance.get(`/api/ecoles/${compteEcoleResponse.data.ecoleId}`);
      setEcole(ecoleResponse.data);

      const filieresResponse = await axiosInstance.get(`/api/filieres/ecole/${ecoleResponse.data.idEcole}`);
      setFilieres(filieresResponse.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleSaveCompteEcole = async (updatedData) => {
    try {
      const response = await axiosInstance.put(`/compte-ecoles/${compteEcole.idCompte}`, updatedData);
      setCompteEcole(response.data);
      setIsEditingCompteEcole(false);
    } catch (error) {
      console.error('Error updating CompteEcole:', error);
    }
  };

  const handleSaveEcole = async (updatedData) => {
    try {
      const response = await axiosInstance.put(`/api/ecoles/${ecole.idEcole}`, updatedData);
      setEcole(response.data);
      setIsEditingEcole(false);
    } catch (error) {
      console.error('Error updating Ecole:', error);
    }
  };

  const handleAddFiliere = async (newFiliere) => {
    try {
      const response = await axiosInstance.post('/api/filieres', { ...newFiliere, ecoleId: ecole.idEcole });
      setFilieres([...filieres, response.data]);
      setIsAddingFiliere(false);
    } catch (error) {
      console.error('Error adding filiere:', error);
    }
  };

  const handleEditFiliere = async (updatedFiliere) => {
    try {
      console.log('Starting handleEditFiliere with updatedFiliere:', updatedFiliere);
      console.log('Current editingFiliere:', editingFiliere);
      console.log('Current editingFiliere.idFiliere:', editingFiliere);
      const response = await axiosInstance.put(`/api/filieres/${editingFiliere}`, 
        {
          ...updatedFiliere,
          ecoleId: ecole.idEcole,
          idFiliere: editingFiliere,
        });
      console.log('Received response from server:', response.data);
      setFilieres(filieres.map(f => f.idFiliere === response.data.idFiliere ? response.data : f));
      console.log('Updated filieres state:', filieres);
      setEditingFiliere(null);
      console.log('Set editingFiliere to null');
    } catch (error) {
      console.error('Error updating filiere:', error);
    }
  };

  const handleDeleteFiliere = async (id) => {
    try {
      await axiosInstance.delete(`/api/filieres/${id}`);
      setFilieres(filieres.filter(f => f.idFiliere !== id));
    } catch (error) {
      console.error('Error deleting filiere:', error);
    }
  };

  return (
    <Layout role="university">
      <div className="p-6 font-roboto">
        <h1 className="text-2xl font-bold mb-6 text-black">Profil du gestionnaire de l'université</h1>

        {/* CompteEcole and Ecole Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* CompteEcole Information Card */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Informations du compte école</h2>
            {compteEcole && (
              <div className="space-y-2 text-black">
                <p><strong>Nom :</strong> {compteEcole.nom} {compteEcole.prenom}</p>
                <p><strong>Email :</strong> {compteEcole.email}</p>
                <p><strong>Téléphone :</strong> {compteEcole.telephone}</p>
                <button
                  onClick={() => setIsEditingCompteEcole(true)}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Modifier
                </button>
              </div>
            )}
          </div>

          {/* Ecole Information Card */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Informations de l'école</h2>
            {ecole && (
              <div className="space-y-2 text-black">
                <p><strong>Nom de l'école :</strong> {ecole.nomEcole}</p>
                <p><strong>Ville :</strong> {ecole.villeEcole}</p>
                <p><strong>Adresse :</strong> {ecole.adresseEcole}</p>
                <p><strong>Description :</strong> {ecole.description}</p>
                <p><strong>Téléphone fixe :</strong> {ecole.telephoneFix}</p>
                <p><strong>Type d'école :</strong> {ecole.typeEcole}</p>
                <p><strong>Domaine de l'école :</strong> {ecole.domaineEcole}</p>
                <button
                  onClick={() => setIsEditingEcole(true)}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Modifier
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filiere Management Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">Gestion des filières</h2>
            <button
              onClick={() => setIsAddingFiliere(true)}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Ajouter une filière
            </button>
          </div>
          <Table
            columns={['Nom', 'Abréviation']}
            columnKeys={['nomFiliere', 'abrvFiliere']}
            items={filieres}
            buttons={['Modifier', 'Supprimer']}
            actions={[setEditingFiliere, handleDeleteFiliere]}
            idParam="idFiliere"
          />
        </div>

        {/* Modals for Editing and Adding */}
        {isEditingCompteEcole && (
          <FormComponent
            isOpen={isEditingCompteEcole}
            onClose={() => setIsEditingCompteEcole(false)}
            onSubmit={handleSaveCompteEcole}
            fields={[
              { name: 'nom', placeholder: 'Nom', type: 'text' },
              { name: 'prenom', placeholder: 'Prénom', type: 'text' },
              { name: 'email', placeholder: 'Email', type: 'email' },
              { name: 'telephone', placeholder: 'Téléphone', type: 'text' },
            ]}
            title="Modifier le compte école"
            submitButtonText="Enregistrer"
            prefillData={compteEcole}
          />
        )}

        {isEditingEcole && (
          <FormComponent
            isOpen={isEditingEcole}
            onClose={() => setIsEditingEcole(false)}
            onSubmit={handleSaveEcole}
            fields={[
              { name: 'nomEcole', placeholder: 'Nom de l\'école', type: 'text' },
              { name: 'villeEcole', placeholder: 'Ville', type: 'text' },
              { name: 'adresseEcole', placeholder: 'Adresse', type: 'text' },
              { name: 'description', placeholder: 'Description', type: 'text' },
              { name: 'telephoneFix', placeholder: 'Téléphone fixe', type: 'text' },
              { name: 'typeEcole', placeholder: 'Type d\'école', type: 'text' },
              { name: 'domaineEcole', placeholder: 'Domaine de l\'école', type: 'text' },
            ]}
            title="Modifier l'école"
            submitButtonText="Enregistrer"
            prefillData={ecole}
          />
        )}

        {isAddingFiliere && (
          <FormComponent
            isOpen={isAddingFiliere}
            onClose={() => setIsAddingFiliere(false)}
            onSubmit={handleAddFiliere}
            fields={[
              { name: 'nomFiliere', placeholder: 'Nom de la filière', type: 'text', required: true },
              { name: 'abrvFiliere', placeholder: 'Abréviation', type: 'text', required: true },
            ]}
            title="Ajouter une filière"
            submitButtonText="Ajouter"
          />
        )}

        {editingFiliere && (
          <FormComponent
            isOpen={!!editingFiliere}
            onClose={() => setEditingFiliere(null)}
            onSubmit={handleEditFiliere}
            fields={[
              { name: 'nomFiliere', placeholder: 'Nom de la filière', type: 'text', required: true },
              { name: 'abrvFiliere', placeholder: 'Abréviation', type: 'text', required: true },
            ]}
            title="Modifier la filière"
            submitButtonText="Enregistrer"
            prefillData={filieres.find(filiere => filiere.idFiliere = editingFiliere)}
          />
        )}
      </div>
    </Layout>
  );
}