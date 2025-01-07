import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Table from '@/components/Table';
import FormComponent from '@/components/FormComponent';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function HRInterviews() {
  const router = useRouter();
  const [isInternshipFormOpen, setIsInternshipFormOpen] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [entrepriseId, setEntrepriseId] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);

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
      fetchInterviews(response.data.entrepriseId);
    } catch (error) {
      console.error('Error fetching CompteEntreprise:', error);
      alert('Failed to fetch CompteEntreprise data.');
    }
  };

  const fetchInterviews = async (entrepriseId) => {
    try {
      console.log('Debugging: EntrepriseId', entrepriseId);
      const response = await axiosInstance.get(`/entretiens/by-entreprise/${entrepriseId}`);
      const filteredInterviews = response.data.filter(interview => interview.resultat === "nouveau");

      // Fetch Etudiant details for each interview
      const interviewsWithEtudiant = await Promise.all(
        filteredInterviews.map(async (interview) => {
          const etudiantResponse = await axiosInstance.get(`/api/etudiants/${interview.etudiantId}`);
          return {
            ...interview,
            etudiant: etudiantResponse.data, // Add Etudiant details to the interview object
          };
        })
      );

      setInterviews(interviewsWithEtudiant);
    } catch (error) {
      console.error('Error fetching interviews or Etudiant details:', error);
      alert('Failed to fetch interviews or Etudiant details.');
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A"; // Handle null or undefined dates
    const dateObj = new Date(date);
    return dateObj.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const internshipFormFields = [
    { name: "titre", placeholder: "Title" },
    { name: "description", placeholder: "Description" },
    { name: "dateDebut", placeholder: "Start Date", type: "date" },
    { name: "dateFin", placeholder: "End Date", type: "date" },
    { name: "duree", placeholder: "Duration" },
    { name: "localisation", placeholder: "Location" },
    { name: "montantRemuneration", placeholder: "Remuneration", type: "number" },
    { name: "type", placeholder: "Type" },
    { name: "encadrantId", placeholder: "Supervisor ID", type: "number" },
  ];

  const handleAccept = (interviewId) => {
    const interview = interviews.find(int => int.idEntretien === interviewId);
    setSelectedInterview(interview);
    setIsInternshipFormOpen(true);
  };

  const handleRefuse = async (interviewId) => {
    try {
      await axiosInstance.put(`/entretiens/${interviewId}`, { resultat: "refusé" });
      fetchInterviews(entrepriseId);
    } catch (error) {
      console.error('Error refusing interview:', error);
      alert('Failed to refuse interview.');
    }
  };

  const handleCreateInternship = async (data) => {
    try {
      const stageDTO = {
        ...data,
        statut: "nouveau", // Set statut to "nouveau" by default
        etudiantId: selectedInterview.etudiantId, // Take etudiantId from selectedInterview
        offreId: selectedInterview.offreId,
        encadrantId: data.encadrantId, // Take offreId from selectedInterview
      };
      
      // Console log for debugging
      console.log('Debugging: selectedInterview object', selectedInterview);
      console.log('Debugging: stageDTO data', data);
      console.log('Debugging: etudiantId', selectedInterview.etudiantId);
      console.log('Debugging: offreId', selectedInterview.offreId);
      console.log('Debugging: encadrantId', data.encadrantId);
      console.log('Debugging: idEntretien', selectedInterview.idEntretien);

      

      await axiosInstance.post('/stages', stageDTO);
      const { etudiant, ...updatedInterview } = selectedInterview; // Exclude etudiant object
      updatedInterview.resultat = "accepté"; // Create the internship
      await axiosInstance.put(`/entretiens/${selectedInterview.idEntretien}`, updatedInterview); // Update interview result
      fetchInterviews(entrepriseId); // Refresh the interviews list
      setIsInternshipFormOpen(false); // Close the form
    } catch (error) {
      console.error('Error creating internship:', error);
      alert('Failed to create internship.');
    }
  };

  return (
    <Layout role="hr">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Interviews Management</h1>
        
        <SearchBar onSearch={(query) => console.log('Search:', query)} />

        <Table 
          columns={["Student Name", "Email", "Phone", "Offer ID", "Date"]}
          columnKeys={[
            "etudiant.nom", 
            "etudiant.email", 
            "etudiant.tel", 
            "offreId", 
            "dateEntretien"
          ]}
          items={interviews}
          buttons={["Accept", "Refuse"]}
          actions={[handleAccept, handleRefuse]}
          idParam="idEntretien"
          formatData={(key, value) => {
            if (key === "dateEntretien") {
              return formatDate(value); // Format dateEntretien
            }
            return value; // Return other values as-is
          }}
        />

        <FormComponent 
          isOpen={isInternshipFormOpen}
          onClose={() => setIsInternshipFormOpen(false)}
          onSubmit={handleCreateInternship}
          fields={internshipFormFields}
          title="Create Internship"
          submitButtonText="Create"
        />
      </div>
    </Layout>
  );
}