import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Card from '@/components/Card';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance'; // Corrected import

export default function CFOffers() {
  const router = useRouter();
  const [offersList, setOffersList] = useState([]); // Holds all offers or filtered offers
  const [visibleOffers, setVisibleOffers] = useState([]); // Holds visible offers
  const [filiereId, setFiliereId] = useState(null); // Holds the filiereId from ChefDeFiliere
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [activeView, setActiveView] = useState('selectable'); // Tracks active view: 'selectable' or 'visible'
  const [searchQuery, setSearchQuery] = useState(''); // Search query state

  // Set authorization token and fetch ChefDeFiliere data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
        fetchChefDeFiliere();
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  // Fetch ChefDeFiliere data and set filiereId
  const fetchChefDeFiliere = async () => {
    try {
      const id = localStorage.getItem('id');
      if (!id) {
        throw new Error('No ID found in localStorage');
      }

      const response = await axiosInstance.get(`/chefs-de-filiere/${id}`);
      setFiliereId(response.data.filiereId); // Corrected: use response.data.filiereId
      fetchVisibleOffers(response.data.filiereId);
      fetchAllOffers();
    } catch (err) {
      setError(err.message || 'Failed to fetch ChefDeFiliere data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch visible offers by filiereId
  const fetchVisibleOffers = async (filiereId) => {
    try {
      const response = await axiosInstance.get(`/visible-offres/${filiereId}/visible-offres`);
      setVisibleOffers(response.data);
    } catch (err) {
      setError('Failed to fetch visible offers');
    }
  };

  // Fetch all offers
  const fetchAllOffers = async () => {
    try {
      const response = await axiosInstance.get('/api/offres');
      setOffersList(response.data);
    } catch (err) {
      setError('Failed to fetch all offers');
    }
  };

  // Handle deleting a visible offer
  const handleDeleteOffer = async (offreId) => {
    try {
      await axiosInstance.delete(`/visible-offres/${offreId}/${filiereId}`);
      setVisibleOffers((prev) => prev.filter((offer) => offer.idOffre !== offreId));
    } catch (err) {
      setError('Failed to delete offer');
    }
  };

  // Handle adding an offer to visible offers
  const handleAddOffer = async (offreId) => {
    try {
      await axiosInstance.post(`/visible-offres/filiere/${filiereId}/offre/${offreId}/visibility`, {
        visible: true,
      });
      fetchVisibleOffers(filiereId); // Refresh visible offers
    } catch (err) {
      setError('Failed to add offer');
    }
  };

  // Filter offers based on search query
  const filteredOffers = offersList.filter((offer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      offer.objetOffre.toLowerCase().includes(searchLower) ||
      offer.descriptionOffre.toLowerCase().includes(searchLower) ||
      offer.posteOffre.toLowerCase().includes(searchLower)
    );
  });

  // Toggle between selectable and visible offers
  const toggleView = (view) => {
    setActiveView(view);
  };

  // Render offers based on active view
  const renderOffers = () => {
    if (activeView === 'selectable') {
      return filteredOffers
        .filter((offer) => !visibleOffers.some((visibleOffer) => visibleOffer.idOffre === offer.idOffre))
        .map((offer) => (
          <Card
            key={offer.idOffre}
            title={offer.objetOffre}
            specifications={[
              { label: 'Description', value: offer.descriptionOffre },
              { label: 'Poste', value: offer.posteOffre },
              { label: 'Durée', value: offer.dureeStage },
              { label: 'Type', value: offer.typeStageOffre },
            ]}
            buttons={[
              {
                label: 'Valider',
                onClick: () => handleAddOffer(offer.idOffre),
              },
            ]}
          />
        ));
    } else {
      return visibleOffers.map((offer) => (
        <Card
          key={offer.idOffre}
          title={offer.objetOffre}
          specifications={[
            { label: 'Description', value: offer.descriptionOffre },
            { label: 'Poste', value: offer.posteOffre },
            { label: 'Durée', value: offer.dureeStage },
            { label: 'Type', value: offer.typeStageOffre },
          ]}
          buttons={[
            {
              label: 'Annuler',
              onClick: () => handleDeleteOffer(offer.idOffre),
            },
          ]}
        />
      ));
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout role="cf">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Available Offers</h1>

        <div className="flex items-center justify-between mb-6">
          <SearchBar onSearch={(query) => setSearchQuery(query)} />
          <div className="flex space-x-4">
            <button
              onClick={() => toggleView('selectable')}
              className={`${
                activeView === 'selectable' ? 'bg-green-500' : 'bg-gray-500'
              } text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300`}
              disabled={activeView === 'selectable'}
            >
              Select New Offers
            </button>
            <button
              onClick={() => toggleView('visible')}
              className={`${
                activeView === 'visible' ? 'bg-green-500' : 'bg-gray-500'
              } text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300`}
              disabled={activeView === 'visible'}
            >
              View Selected Offers
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {renderOffers()}
        </div>
      </div>
    </Layout>
  );
}