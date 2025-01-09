import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';
import FormComponent from '@/components/FormComponent';

export default function EtudiantProfile() {
  const router = useRouter();
  const [etudiant, setEtudiant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
      const response = await axiosInstance.get(`/api/etudiants/${id}`);
      setEtudiant(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données du profil :', error);
    }
  };

  const handleSave = async (updatedData) => {
    try {
      console.log(updatedData);
      console.log(`ID Etudiant :${etudiant.idEtu}`);
      const response = await axiosInstance.put(`/api/etudiants/${etudiant.idEtu}`, {
        ...updatedData,
        filiereId: etudiant.filiereId,
        userId: etudiant.userId,
        codeEtu: etudiant.codeEtu,
      });
      setEtudiant(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'étudiant :', error);
    }
  };

  return (
    <Layout role="student">
      <div className="p-6 font-roboto">
        <h1 className="text-2xl font-bold mb-6 text-black">Profil de l'étudiant</h1>

        {/* Etudiant Information Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Informations de l'étudiant</h2>
          {etudiant && (
            <div className="space-y-2 text-black">
              <p><strong>Nom :</strong> {etudiant.nom} {etudiant.prenom}</p>
              <p><strong>Email :</strong> {etudiant.email}</p>
              <p><strong>Téléphone :</strong> {etudiant.tel}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Modifier
              </button>
            </div>
          )}
        </div>

        {/* Modal for Editing */}
        {isEditing && (
          <FormComponent
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            onSubmit={handleSave}
            fields={[
              { name: 'nom', placeholder: 'Nom', type: 'text', required: true },
              { name: 'prenom', placeholder: 'Prénom', type: 'text', required: true },
              { name: 'email', placeholder: 'Email', type: 'email', required: true },
              { name: 'tel', placeholder: 'Téléphone', type: 'text' },
              { name: 'motDePasse', placeholder: 'Mot de passe', type: 'password', required: true },
            ]}
            title="Modifier le profil de l'étudiant"
            submitButtonText="Enregistrer"
            prefillData={etudiant}
          />
        )}
      </div>
    </Layout>
  );
}