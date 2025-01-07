import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Card from '@/components/Card';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function CFInternships() {
  const router = useRouter();
  const [stages, setStages] = useState([]); // Combined stage and student data
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // For search functionality

  // Fetch initial data
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

  // Fetch all stages and corresponding students
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch cf account to get ecoleId
      const cfId = localStorage.getItem('id');
      const cfResponse = await axiosInstance.get(`/chefs-de-filiere/${cfId}`);
      const ecoleId = cfResponse.data.ecoleId;

      // Fetch all stages for the ecoleId
      const stagesResponse = await axiosInstance.get(`/stages/AValider/ecole/${ecoleId}`);

      // Fetch students for each stage
      const stagesWithStudents = await Promise.all(
        stagesResponse.data.map(async (stage) => {
          const etudiantResponse = await axiosInstance.get(`/api/etudiants/${stage.etudiantId}`);
          return { ...stage, etudiant: etudiantResponse.data };
        })
      );

      setStages(stagesWithStudents); // Set all stages with student data
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search (client-side filtering)
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter stages based on search query
  const filteredStages = stages.filter((stage) => {
    const searchString = `${stage.titre} ${stage.description} ${stage.localisation} ${stage.etudiant?.nom} ${stage.etudiant?.prenom} ${stage.etudiant?.email}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  // Handle stage status update
  const updateStageStatus = async (idStage, newStatus) => {
    try {
      await axiosInstance.put(`/stages/${idStage}/status`, null, {
        params: { newStatus },
      });

      // Update the stage status in the local state
      setStages((prevStages) =>
        prevStages.map((stage) =>
          stage.idStage === idStage ? { ...stage, statut: newStatus } : stage
        )
      );
    } catch (error) {
      console.error('Error updating stage status:', error);
    }
  };

  return (
    <Layout role="cf">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Internship Validation Requests</h1>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStages.map((stage) => (
            <Card
              key={stage.idStage}
              title={stage.titre || 'No Title'}
              specifications={[
                { label: 'Description', value: stage.description || 'No Description' },
                { label: 'Start Date', value: stage.dateDebut || 'No Start Date' },
                { label: 'End Date', value: stage.dateFin || 'No End Date' },
                { label: 'Location', value: stage.localisation || 'No Location' },
                { label: 'Student', value: `${stage.etudiant?.prenom || 'No First Name'} ${stage.etudiant?.nom || 'No Last Name'}` },
                { label: 'Email', value: stage.etudiant?.email || 'No Email' },
                { label: 'Status', value: stage.statut || 'No Status' },
              ]}
              buttons={[
                { label: 'Accepter', onClick: () => updateStageStatus(stage.idStage, 'valide') },
                { label: 'Refuser', onClick: () => updateStageStatus(stage.idStage, 'refusé') },
              ]}
            />
          ))}
        </div>

        {loading && <p className="text-center">Loading...</p>}
        {!loading && filteredStages.length === 0 && <p className="text-center">No stages found.</p>}
      </div>
    </Layout>
  );
}