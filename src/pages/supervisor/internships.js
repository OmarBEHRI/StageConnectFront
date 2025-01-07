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
        if (stage.statut !== "terminé") {
          const currentDate = new Date();
          const dateLimite = new Date(stage.dateLimite);
          if (dateLimite > currentDate) {
            stage.statut = "en cours";
            await axiosInstance.put(`/stages/${stage.idStage}/status`,  "en cours" );
          } else {
            stage.statut = "terminé";
            await axiosInstance.put(`/stages/${stage.idStage}/status`, "terminé" );
          }
        }
        return stage;
      }));

      setInternships(updatedStages);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch internships. Please try again later.");
    }
  };

  const handleSearch = (query) => {
    console.log('Searching for:', query);
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
      await axiosInstance.put(`/stages/${selectedInternshipId}/status`, { status: "évalué" });

      setIsEvaluationFormOpen(false);
      fetchInternships(); // Refresh the list
    } catch (error) {
      console.log(error);
      setError("Failed to submit evaluation. Please try again later.");
    }
  };

  const evaluationFormFields = [
    { name: "performance", type: "select", placeholder: "Performance Rating",
      options: ["Excellent", "Good", "Average", "Below Average"] },
    { name: "skills", placeholder: "Technical Skills Demonstrated" },
    { name: "strengths", placeholder: "Key Strengths" },
    { name: "improvements", placeholder: "Areas for Improvement" },
    { name: "comments", type: "textarea", placeholder: "Additional Comments" }
  ];

  return (
    <Layout role="supervisor">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Internships Management</h1>
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
                { label: "Start Date", value: new Date(internship.dateDebut).toLocaleDateString() },
                { label: "End Date", value: new Date(internship.dateFin).toLocaleDateString() },
                { label: "Status", value: internship.statut }
              ]}
              buttons={
                internship.statut === "terminé"
                  ? [{
                      label: "Evaluate",
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
          title="Internship Evaluation"
        />
      </div>
    </Layout>
  );
}