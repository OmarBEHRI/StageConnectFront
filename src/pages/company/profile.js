import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';
import FormComponent from '@/components/FormComponent';

export default function CompteEntrepriseProfile() {
  const router = useRouter();
  const [compteEntreprise, setCompteEntreprise] = useState(null);
  const [entreprise, setEntreprise] = useState(null);
  const [isEditingCompteEntreprise, setIsEditingCompteEntreprise] = useState(false);
  const [isEditingEntreprise, setIsEditingEntreprise] = useState(false);

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
      const compteEntrepriseResponse = await axiosInstance.get(`/compte-entreprises/${id}`);
      setCompteEntreprise(compteEntrepriseResponse.data);

      const entrepriseResponse = await axiosInstance.get(`/api/entreprises/${compteEntrepriseResponse.data.entrepriseId}`);
      setEntreprise(entrepriseResponse.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleSaveCompteEntreprise = async (updatedData) => {
    try {
      const response = await axiosInstance.put(`/compte-entreprises/${compteEntreprise.idCompte}`, updatedData);
      setCompteEntreprise(response.data);
      setIsEditingCompteEntreprise(false);
    } catch (error) {
      console.error('Error updating CompteEntreprise:', error);
    }
  };

  const handleSaveEntreprise = async (updatedData) => {
    try {
      const response = await axiosInstance.put(`/api/entreprises/${entreprise.idEntreprise}`, updatedData);
      setEntreprise(response.data);
      setIsEditingEntreprise(false);
    } catch (error) {
      console.error('Error updating Entreprise:', error);
    }
  };

  return (
    <Layout role="companyManager">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Company Manager Profile</h1>

        {/* CompteEntreprise Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Compte Entreprise Information</h2>
          {compteEntreprise && (
            <div className="space-y-2">
              <p><strong>Name:</strong> {compteEntreprise.nom} {compteEntreprise.prenom}</p>
              <p><strong>Email:</strong> {compteEntreprise.email}</p>
              <p><strong>Phone:</strong> {compteEntreprise.telephone}</p>
              <button
                onClick={() => setIsEditingCompteEntreprise(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Entreprise Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Entreprise Information</h2>
          {entreprise && (
            <div className="space-y-2">
              <p><strong>Company Name:</strong> {entreprise.nomEntreprise}</p>
              <p><strong>City:</strong> {entreprise.villeEntreprise}</p>
              <p><strong>Address:</strong> {entreprise.adresseEntreprise}</p>
              <button
                onClick={() => setIsEditingEntreprise(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Modals for Editing */}
        {isEditingCompteEntreprise && (
          <FormComponent
            isOpen={isEditingCompteEntreprise}
            onClose={() => setIsEditingCompteEntreprise(false)}
            onSubmit={handleSaveCompteEntreprise}
            fields={[
              { name: 'nom', placeholder: 'Nom', type: 'text' },
              { name: 'prenom', placeholder: 'Prenom', type: 'text' },
              { name: 'email', placeholder: 'Email', type: 'email' },
              { name: 'telephone', placeholder: 'Phone', type: 'text' },
            ]}
            title="Edit Compte Entreprise"
            submitButtonText="Save"
            prefillData={compteEntreprise}
          />
        )}

        {isEditingEntreprise && (
          <FormComponent
            isOpen={isEditingEntreprise}
            onClose={() => setIsEditingEntreprise(false)}
            onSubmit={handleSaveEntreprise}
            fields={[
              { name: 'nomEntreprise', placeholder: 'Company Name', type: 'text' },
              { name: 'villeEntreprise', placeholder: 'City', type: 'text' },
              { name: 'adresseEntreprise', placeholder: 'Address', type: 'text' },
            ]}
            title="Edit Entreprise"
            submitButtonText="Save"
            prefillData={entreprise}
          />
        )}
      </div>
    </Layout>
  );
}