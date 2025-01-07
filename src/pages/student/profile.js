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
      console.error('Error fetching profile data:', error);
    }
  };

  const handleSave = async (updatedData) => {
    try {
      const response = await axiosInstance.put(`/api/etudiants/${etudiant.idEtu}`, updatedData);
      setEtudiant(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating Etudiant:', error);
    }
  };

  return (
    <Layout role="student">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Student Profile</h1>

        {/* Etudiant Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Student Information</h2>
          {etudiant && (
            <div className="space-y-2">
              <p><strong>Name:</strong> {etudiant.nom} {etudiant.prenom}</p>
              <p><strong>Email:</strong> {etudiant.email}</p>
              <p><strong>Phone:</strong> {etudiant.tel}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Edit
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
              { name: 'nom', placeholder: 'Nom', type: 'text' },
              { name: 'prenom', placeholder: 'Prenom', type: 'text' },
              { name: 'email', placeholder: 'Email', type: 'email' },
              { name: 'tel', placeholder: 'Phone', type: 'text' },
            ]}
            title="Edit Student Profile"
            submitButtonText="Save"
            prefillData={etudiant}
          />
        )}
      </div>
    </Layout>
  );
}