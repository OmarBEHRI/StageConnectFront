import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Table from '@/components/Table';
import FormComponent from '@/components/FormComponent';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function HROfferManagement() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [offers, setOffers] = useState([]);
  const [entrepriseId, setEntrepriseId] = useState(null);

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
      const rhId = localStorage.getItem('id');
      const response = await axiosInstance.get(`/api/rh/${rhId}`);
      setEntrepriseId(response.data.entrepriseId);
      fetchOffers(response.data.entrepriseId);
    } catch (error) {
      console.error('Error fetching CompteEntreprise:', error);
      alert('Failed to fetch CompteEntreprise data.');
    }
  };

  const fetchOffers = async (entrepriseId) => {
    try {
      const response = await axiosInstance.get(`/api/offres/entreprise/${entrepriseId}`);
      setOffers(response.data);
    } catch (error) {
      console.error('Error fetching offers:', error);
      alert('Failed to fetch offers.');
    }
  };

  const formFields = [
    { name: "objetOffre", placeholder: "Title" },
    { name: "posteOffre", placeholder: "Position" },
    { name: "dateLancement", placeholder: "Start Date", type: "date" },
    { name: "dateLimite", placeholder: "End Date", type: "date" },
    { name: "descriptionOffre", placeholder: "Description" },
    { name: "dureeStage", placeholder: "Duration" },
    { name: "modeOffre", placeholder: "Mode" },
    { name: "remuneration", placeholder: "Remuneration" },
    { name: "typeStageOffre", placeholder: "Type" },
    { name: "niveauRequisOffre", placeholder: "Required Level" },
  ];

  const handleCreateOffer = async (data) => {
    try {
      const offreDTO = {
        objetOffre: data.objetOffre,
        posteOffre: data.posteOffre,
        dateLancement: data.dateLancement,
        dateLimite: data.dateLimite,
        descriptionOffre: data.descriptionOffre,
        dureeStage: data.dureeStage,
        modeOffre: data.modeOffre,
        remuneration: data.remuneration,
        typeStageOffre: data.typeStageOffre,
        niveauRequisOffre: data.niveauRequisOffre,
        entrepriseId: entrepriseId,
        rhId: localStorage.getItem('id'),
      };
      await axiosInstance.post('/api/offres', offreDTO);
      fetchOffers(entrepriseId);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating offer:', error);
      alert('Failed to create offer.');
    }
  };

  const handleEdit = (offerId) => {
    const offer = offers.find(off => off.idOffre === offerId);
    setSelectedOffer(offer);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleEditOffer = async (data) => {
    try {
      const offreDTO = {
        idOffre: selectedOffer.idOffre,
        objetOffre: data.objetOffre,
        posteOffre: data.posteOffre,
        dateLancement: data.dateLancement,
        dateLimite: data.dateLimite,
        descriptionOffre: data.descriptionOffre,
        dureeStage: data.dureeStage,
        modeOffre: data.modeOffre,
        remuneration: data.remuneration,
        typeStageOffre: data.typeStageOffre,
        niveauRequisOffre: data.niveauRequisOffre,
        entrepriseId: entrepriseId,
        rhId: localStorage.getItem('id'),
      };
      await axiosInstance.put(`/api/offres/${selectedOffer.idOffre}`, offreDTO);
      fetchOffers(entrepriseId);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error updating offer:', error);
      alert('Failed to update offer.');
    }
  };

  const handleDelete = async (offerId) => {
    try {
      await axiosInstance.delete(`/api/offres/${offerId}`);
      fetchOffers(entrepriseId);
    } catch (error) {
      console.error('Error deleting offer:', error);
      alert('Failed to delete offer.');
    }
  };

  return (
    <Layout role="company">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Company Offers</h1>

        <div className="flex justify-between items-center">
          <SearchBar onSearch={(query) => console.log('Search:', query)} />
          <button
            onClick={() => {
              setIsEditMode(false);
              setSelectedOffer(null);
              setIsFormOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Offer
          </button>
        </div>

        <Table
          columns={[
            "Title", 
            "Position", 
            "Start Date", 
            "End Date", 
            "Description", 
            "Duration", 
            "Mode", 
            "Remuneration", 
            "Type", 
            "Required Level", 
          ]}
          columnKeys={[
            "objetOffre", 
            "posteOffre", 
            "dateLancement", 
            "dateLimite", 
            "descriptionOffre", 
            "dureeStage", 
            "modeOffre", 
            "remuneration", 
            "typeStageOffre", 
            "niveauRequisOffre", 
          ]}
          items={offers}
          buttons={["Edit", "Delete"]}
          actions={[handleEdit, handleDelete]}
          idParam="idOffre"
        />

        <FormComponent
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setIsEditMode(false);
            setSelectedOffer(null);
          }}
          onSubmit={isEditMode ? handleEditOffer : handleCreateOffer}
          fields={formFields}
          title={isEditMode ? "Edit Offer" : "Create New Offer"}
          submitButtonText={isEditMode ? "Enregistrer" : "Créer"}
          prefillData={selectedOffer}
        />
      </div>
    </Layout>
  );
}

