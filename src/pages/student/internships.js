import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Card from '@/components/Card';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function StudentInternships() {
  const router = useRouter();
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      if (token) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
        fetchInternships();
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const fetchInternships = async () => {
    try {
      const etudiantId = localStorage.getItem("id");
      const response = await axiosInstance.get(`/stages/by-etudiant/${etudiantId}`);
      const stages = response.data;

      const stagesWithEtudiant = await Promise.all(stages.map(async (stage) => {
        const etudiantResponse = await axiosInstance.get(`/api/etudiants/${stage.etudiantId}`);
        return { ...stage, etudiant: etudiantResponse.data };
      }));

      setInternships(stagesWithEtudiant);
    } catch (error) {
      console.error("Error fetching internships:", error);
    }
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const handleStatusUpdate = async (stageId) => {
    try {
      const etudiantId = localStorage.getItem("id");
      await axiosInstance.put(`/stages/set-status-delete-others/${etudiantId}/${stageId}`);
      fetchInternships(); // Refresh the list after updating status
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getButtonLabel = (status) => {
    const labels = {
      'nouveau': 'Valider',
      'a valider': 'Demande en attente',
      'valide': 'Validé',
      'refuser': 'Refusé'
    };
    return labels[status] || 'Postuler';
  };

  return (
    <Layout role="student" onLogout={() => {}}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Internships</h1>
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {internships.map((internship) => (
            <Card
              key={internship.idStage}
              title={internship.titre}
              specifications={[
                { label: "Description", value: internship.description },
                { label: "Start Date", value: internship.dateDebut },
                { label: "End Date", value: internship.dateFin },
                { label: "Duration", value: internship.duree },
                { label: "Location", value: internship.localisation },
                { label: "Amount", value: internship.montantRemuneration },
                { label: "Status", value: internship.statut },
                { label: "Type", value: internship.type },
                { label: "Student", value: `${internship.etudiant.nom} ${internship.etudiant.prenom}` }
              ]}
              buttons={[
                {
                  label: getButtonLabel(internship.statut),
                  onClick: () => handleStatusUpdate(internship.idStage),
                }
              ]}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}