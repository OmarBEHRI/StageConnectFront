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
  const [encadrants, setEncadrants] = useState([]); // State to store encadrants
  const [error, setError] = useState(null); // State to manage error messages

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

  // Function to set an error message and clear it after 5 seconds
  const setErrorMessage = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
  };

  const fetchCompteEntreprise = async () => {
    try {
      const rhId = localStorage.getItem('id');
      const response = await axiosInstance.get(`/api/rh/${rhId}`);
      setEntrepriseId(response.data.entrepriseId);
      fetchInterviews(response.data.entrepriseId);
      fetchEncadrants(response.data.entrepriseId); // Fetch encadrants after setting entrepriseId
    } catch (error) {
      console.error('Error fetching CompteEntreprise:', error);
      setErrorMessage('Failed to fetch CompteEntreprise data.');
    }
  };

  const fetchEncadrants = async (entrepriseId) => {
    try {
      const response = await axiosInstance.get(`/api/encadrants/by-entreprise/${entrepriseId}`);
      setEncadrants(response.data); // Store encadrants in state
    } catch (error) {
      console.error('Error fetching encadrants:', error);
      setErrorMessage('Failed to fetch encadrants.');
    }
  };

  const fetchInterviews = async (entrepriseId) => {
    try {
      console.log('Debugging: EntrepriseId', entrepriseId);
      const response = await axiosInstance.get(`/entretiens/by-entreprise/${entrepriseId}`);
      const filteredInterviews = response.data.filter(interview => interview.resultat === "nouveau");

      // Fetch Etudiant and Offre details for each interview
      const interviewsWithDetails = await Promise.all(
        filteredInterviews.map(async (interview) => {
          const etudiantResponse = await axiosInstance.get(`/api/etudiants/${interview.etudiantId}`);
          const offreResponse = await axiosInstance.get(`/api/offres/${interview.offreId}`);
          return {
            ...interview,
            etudiant: etudiantResponse.data, // Add Etudiant details to the interview object
            offre: offreResponse.data, // Add Offre details to the interview object
          };
        })
      );

      setInterviews(interviewsWithDetails);
    } catch (error) {
      console.error('Error fetching interviews, Etudiant, or Offre details:', error);
      setErrorMessage('Failed to fetch interviews, Etudiant, or Offre details.');
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A"; // Handle null or undefined dates
    const dateObj = new Date(date);
    return dateObj.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const internshipFormFields = [
    { name: "titre", placeholder: "Title", required: true },
    { name: "description", placeholder: "Description", required: true },
    { name: "dateDebut", placeholder: "Start Date", type: "date", required: true },
    { name: "dateFin", placeholder: "End Date", type: "date", required: true },
    { name: "duree", placeholder: "Duration", required: true },
    { name: "localisation", placeholder: "Location", required: true },
    { name: "montantRemuneration", placeholder: "Remuneration", type: "number", required: true },
    { name: "type", placeholder: "Type", required: true },
    {
      name: "encadrant",
      placeholder: "Supervisor",
      type: "select",
      options: encadrants.map(encadrant => ({
        label: `${encadrant.nom} ${encadrant.prenom}`,
        value: `${encadrant.nom} ${encadrant.prenom}`,
      })),
      required: true,
    },
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
      setErrorMessage('Failed to refuse interview.');
    }
  };

  const handleCreateInternship = async (data) => {
    try {
      // Find the selected encadrant by nom and prenom
      const selectedEncadrant = encadrants.find(
        (encadrant) => `${encadrant.nom} ${encadrant.prenom}` === data.encadrant
      );

      if (!selectedEncadrant) {
        throw new Error("Selected encadrant not found.");
      }

      // Remove encadrant from data
      const { encadrant, ...updatedData } = data;
      
      const stageDTO = {
        ...updatedData,
        statut: "nouveau", // Set statut to "nouveau" by default
        etudiantId: selectedInterview.etudiantId, // Take etudiantId from selectedInterview
        offreId: selectedInterview.offreId,
        encadrantId: selectedEncadrant.idEncadrant, // Use the idEncadrant from the selected encadrant
      };

      // Console log for debugging
      console.log('Debugging: selectedInterview object', selectedInterview);
      console.log('Debugging: stageDTO data', data);
      console.log('Debugging: etudiantId', selectedInterview.etudiantId);
      console.log('Debugging: offreId', selectedInterview.offreId);
      console.log('Debugging: encadrantId', selectedEncadrant.idEncadrant);
      console.log('Debugging: idEntretien', selectedInterview.idEntretien);

      await axiosInstance.post('/stages', stageDTO);
      const { etudiant, offre, ...updatedInterview } = selectedInterview; // Exclude etudiant and offre objects
      updatedInterview.resultat = "accepté"; // Create the internship
      await axiosInstance.put(`/entretiens/${selectedInterview.idEntretien}`, updatedInterview); // Update interview result
      fetchInterviews(entrepriseId); // Refresh the interviews list
      setIsInternshipFormOpen(false); // Close the form
    } catch (error) {
      console.error('Error creating internship:', error);
      setErrorMessage('Failed to create internship.');
    }
  };

  return (
    <Layout role="hr">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Interviews Management</h1>
        
        {/* Display error message if any */}
        {error && <p className="text-red-500">{error}</p>}

        <SearchBar onSearch={(query) => console.log('Search:', query)} />

        <Table 
          columns={["Student Name", "Email", "Phone", "Offer Object", "Date"]}
          columnKeys={[
            "etudiant.nom", 
            "etudiant.email", 
            "etudiant.tel", 
            "offre.objetOffre", // Display the offer object
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