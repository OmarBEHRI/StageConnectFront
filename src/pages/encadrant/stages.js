import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Card from '@/components/Card';
import FormComponent from '@/components/FormComponent';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function SupervisorInternships() {
  const router = useRouter();
  const [internships, setInternships] = useState([]);
  const [isEvaluationFormOpen, setIsEvaluationFormOpen] = useState(false);
  const [selectedInternshipId, setSelectedInternshipId] = useState(null);
  const [error, setError] = useState(null);

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
      const idEncadrant = localStorage.getItem("id");
      const encadrantResponse = await axiosInstance.get(`/api/encadrants/${idEncadrant}`);
      const entrepriseId = encadrantResponse.data.entrepriseId;

      const stagesResponse = await axiosInstance.get(`/stages/by-entreprise/${entrepriseId}`);
      const filteredStages = stagesResponse.data.filter(stage => stage.encadrantId == idEncadrant);

      const updatedStages = await Promise.all(filteredStages.map(async (stage) => {
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

      const filteredUpdatedStages = updatedStages.filter(stage => stage.statut !== "nouveau" && stage.statut !== "a valider" && stage.statut !== "refusé");

      setInternships(filteredUpdatedStages);
    } catch (error) {
      console.log(error);
      setError("Échec de la récupération des stages. Veuillez réessayer plus tard.");
    }
  };

  const handleSearch = (query) => {
    console.log('Recherche pour :', query);
    // Implement search logic here
  };

  const handleEvaluate = (internshipId) => {
    setSelectedInternshipId(internshipId);
    setIsEvaluationFormOpen(true);
  };

  const handleSubmitEvaluation = async (data) => {
    try {
      const evaluationDTO = {
        note: data.performance === "Excellent" ? 5 : data.performance === "Good" ? 4 : data.performance === "Average" ? 3 : 2,
        competances: data.skills,
        commentaire: data.comments,
        encadrantId: localStorage.getItem("id"),
        stageId: selectedInternshipId
      };

      await axiosInstance.post('/evaluations', evaluationDTO);
      const newStatus = "évalué";
      await axiosInstance.put(`/stages/${selectedInternshipId}/status`, null, {
        params: { newStatus },
      });

      setIsEvaluationFormOpen(false);
      fetchInternships(); // Refresh the list
    } catch (error) {
      console.log(error);
      setError("Échec de la soumission de l'évaluation. Veuillez réessayer plus tard.");
    }
  };

  const evaluationFormFields = [
    {
      name: "performance",
      placeholder: "Évaluation de la performance",
      type: "select",
      options: [
        { label: "Excellent", value: "Excellent" },
        { label: "Bon", value: "Good" },
        { label: "Moyen", value: "Average" },
        { label: "En dessous de la moyenne", value: "Below Average" }
      ],
      required: true,
    },
    { name: "skills", placeholder: "Compétences techniques démontrées", required: true },
    { name: "comments", type: "textarea", placeholder: "Commentaires supplémentaires", required: true }
  ];

  return (
    <Layout role="supervisor">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Gestion des stages</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {internships.map((internship) => (
            <Card
              key={internship.idStage}
              image="/default-avatar.png"
              title={internship.titre}
              specifications={[
                { label: "Description", value: internship.description },
                { label: "Date de début", value: new Date(internship.dateDebut).toLocaleDateString() },
                { label: "Date de fin", value: new Date(internship.dateFin).toLocaleDateString() },
                { label: "Statut", value: internship.statut }
              ]}
              buttons={
                internship.statut === "terminé"
                  ? [{
                      label: "Évaluer",
                      onClick: () => handleEvaluate(internship.idStage)
                    }]
                  : []
              }
            />
          ))}
        </div>

        <FormComponent
          isOpen={isEvaluationFormOpen}
          onClose={() => setIsEvaluationFormOpen(false)}
          onSubmit={handleSubmitEvaluation}
          fields={evaluationFormFields}
          title="Évaluation du stage"
        />
      </div>
    </Layout>
  );
}