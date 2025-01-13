import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Card from '@/components/Card';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';
import getFicheDescriptiveDeStage from '@/utils/downloadFicheDescriptive'

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

      const updatedStages = await Promise.all(stages.map(async (stage) => {
        if (stage.statut !== "terminé" && stage.statut !== "évalué" && stage.statut !== "nouveau") {
          const currentDate = new Date();
          const dateFin = new Date(stage.dateFin);
          const dateDebut = new Date(stage.dateDebut);
          if (dateFin > currentDate && dateDebut < currentDate && stage.statut !== "en cours") {
            stage.statut = "en cours";
            const newStatus = "en cours";
            await axiosInstance.put(`/stages/${stage.idStage}/status`, null, {
              params: { newStatus },
            });
          } else if (dateFin < currentDate && stage.statut !== "terminé") {
            stage.statut = "terminé";
            const newStatus = "terminé";
            await axiosInstance.put(`/stages/${stage.idStage}/status`, null, {
              params: { newStatus },
            });
          }
        }
        return stage;
      }));

      const stagesWithEtudiant = await Promise.all(updatedStages.map(async (stage) => {
        const etudiantResponse = await axiosInstance.get(`/api/etudiants/${stage.etudiantId}`);
        return { ...stage, etudiant: etudiantResponse.data };
      }));

      setInternships(stagesWithEtudiant);
    } catch (error) {
      console.error("Erreur lors de la récupération des stages :", error);
    }
  };

  const handleSearch = (query) => {
    console.log("Recherche pour :", query);
  };

  const handleStatusUpdate = async (stageId) => {
    try {
      const etudiantId = localStorage.getItem("id");
      await axiosInstance.put(`/stages/set-status-delete-others/${etudiantId}/${stageId}`);
      fetchInternships(); // Rafraîchir la liste après la mise à jour du statut
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
    }
  };

  const getButtonLabel = (status) => {
    const labels = {
      'nouveau': 'Valider',
      'a valider': 'Demande en attente',
      'valide': 'Validé',
      'refusé': 'Refusé',
      'en cours': 'En Cours',
      'terminé': "Terminé",
      'évalué': 'Évalué',
    };
    return labels[status] || 'Postuler';
  };

  return (
    <Layout role="student" onLogout={() => {}}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Mes stages</h1>
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
                { label: "Date de début", value: internship.dateDebut },
                { label: "Date de fin", value: internship.dateFin },
                { label: "Durée", value: internship.duree },
                { label: "Localisation", value: internship.localisation },
                { label: "Montant", value: internship.montantRemuneration },
                { label: "Statut", value: internship.statut },
                { label: "Type", value: internship.type },
                { label: "Étudiant", value: `${internship.etudiant.nom} ${internship.etudiant.prenom}` }
              ]}
              buttons={[
                {
                  label: getButtonLabel(internship.statut),
                  onClick: () => handleStatusUpdate(internship.idStage),
                },
                {
                  label: "Fiche Descriptive",
                  onClick: () => getFicheDescriptiveDeStage(internship),
                }
              ]}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}