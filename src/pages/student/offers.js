import { useState, useEffect } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Card from '@/components/Card';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function StudentOffers() {
  const router = useRouter();
  const [offers, setOffers] = useState([]); // State for visible offers
  const [filteredOffers, setFilteredOffers] = useState([]); // State for filtered offers (after search)
  const [postulations, setPostulations] = useState([]); // State for postulations
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // Search query state

  // Fetch student data, visible offers, and postulations
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
        fetchData();
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const fetchData = async () => {
    try {
      // Get student ID from localStorage
      const studentId = localStorage.getItem('id');
      if (!studentId) {
        router.push('/');
        return;
      }

      // Fetch student data to get filiereId
      const studentResponse = await axiosInstance.get(`/api/etudiants/${studentId}`);
      const filiereId = studentResponse.data.filiereId;

      // Fetch visible offers by filiereId
      const offersResponse = await axiosInstance.get(`/visible-offres/${filiereId}/visible-offres`);
      const visibleOffers = offersResponse.data;
      console.log('Debugging: visibleOffers', visibleOffers);

      // Fetch postulations by studentId
      const postulationsResponse = await axiosInstance.get(`/api/postulations/etudiant/${studentId}`);
      const postulations = postulationsResponse.data;

      // Filter out offers that the student has already applied to
      const filteredVisibleOffers = visibleOffers.filter(
        (offer) => !postulations.some((postulation) => postulation.offreId === offer.idOffre)
      );

      // Update state
      setOffers(filteredVisibleOffers);
      setFilteredOffers(filteredVisibleOffers);
      setPostulations(postulations);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = offers.filter((offer) =>
      offer.objetOffre.toLowerCase().includes(query.toLowerCase()) ||
      offer.descriptionOffre.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOffers(filtered);
  };

  // Handle postulation
  const handlePostuler = async (offreId) => {
    try {
      const studentId = localStorage.getItem('id');
      const formData = new FormData();
      const cvFile = document.querySelector('#cvFile').files[0];
      const lettreMotivationFile = document.querySelector('#lettreMotivationFile').files[0];

      formData.append('offreId', offreId);
      formData.append('etudiantId', studentId);
      formData.append('etatPostulation', 'PENDING');
      formData.append('Cv', cvFile);
      formData.append('LettreMotivation', lettreMotivationFile);

      // Send POST request to create postulation
      const response = await axiosInstance.post('/api/postulations/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        // Update the list of visible offers
        const updatedOffers = offers.filter((offer) => offer.idOffre !== offreId);
        setOffers(updatedOffers);
        setFilteredOffers(updatedOffers);
        alert('Postulation réussie!');
      }
    } catch (error) {
      console.error('Error submitting postulation:', error);
      alert('Erreur lors de la postulation.');
    }
  };

  return (
    <Layout role="student">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Available Offers</h1>
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredOffers.map((offer) => (
              <Card
                key={offer.idOffre}
                title={offer.objetOffre}
                specifications={[
                  { label: 'Description', value: offer.descriptionOffre },
                  { label: 'Poste', value: offer.posteOffre },
                  { label: 'Durée', value: offer.dureeStage },
                  { label: 'Rémunération', value: offer.remuneration },
                ]}
                buttons={[
                  {
                    label: 'Postuler',
                    onClick: () => {
                      // Show form for CV and Lettre de Motivation
                      const cvFileInput = document.createElement('input');
                      cvFileInput.type = 'file';
                      cvFileInput.id = 'cvFile';
                      const lettreMotivationFileInput = document.createElement('input');
                      lettreMotivationFileInput.type = 'file';
                      lettreMotivationFileInput.id = 'lettreMotivationFile';
                      document.body.appendChild(cvFileInput);
                      document.body.appendChild(lettreMotivationFileInput);
                      cvFileInput.click();
                      lettreMotivationFileInput.click();
                      cvFileInput.onchange = () => handlePostuler(offer.idOffre);
                      lettreMotivationFileInput.onchange = () => handlePostuler(offer.idOffre);
                    },
                  },
                ]}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}