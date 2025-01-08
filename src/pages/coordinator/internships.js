import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Table from '@/components/Table';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function CoordinatorInternships() {
  const router = useRouter();
  const [internships, setInternships] = useState([]); // State for internships
  const [error, setError] = useState(null); // State for error messages
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
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
      // Get CoordinateurDeStage ID from localStorage
      const coordinateurId = localStorage.getItem('id');
      if (!coordinateurId) {
        router.push('/');
        return;
      }


      // Fetch CoordinateurDeStage by ID
      const coordinateurResponse = await axiosInstance.get(`/api/coordinateurs/${coordinateurId}`);
      console.log("Coordinateur Object: ");
      console.log(coordinateurResponse);
      const ecoleId = coordinateurResponse.data.ecoleId;

      // Fetch stages by ecoleId
      console.log(`Ecole ID: ${ecoleId}`);
      const stagesResponse = await axiosInstance.get(`/stages/by-ecole/${ecoleId}`);
      const filteredStages = stagesResponse.data.filter(
        (stage) => stage.statut !== "nouveau" && stage.statut !== "a valider"
      );

      // Fetch Etudiant data for each stage
      const internshipsWithEtudiant = await Promise.all(
        filteredStages.map(async (stage) => {
          const etudiantResponse = await axiosInstance.get(`/api/etudiants/${stage.etudiantId}`);
          return {
            ...stage,
            etudiant: etudiantResponse.data, // Add Etudiant details to the stage object
          };
        })
      );

      setInternships(internshipsWithEtudiant);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // Implement search logic here
  };

  const handleValidate = (internshipId) => {
    console.log('Validating internship:', internshipId);
    // Implement validation logic here
  };

  // Format date to human-readable format
  const formatDate = (date) => {
    if (!date) return "N/A"; // Handle null or undefined dates
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(); // Format as human-readable date
  };

  return (
    <Layout role="coordinator">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Internship Validations</h1>

        {/* Display error message if any */}
        {error && <p className="text-red-500">{error}</p>}

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table
            columns={["Student Email", "Stage Description", "Start Date", "End Date", "Status"]}
            columnKeys={[
              "etudiant.email", // Student email
              "description", // Stage description
              "dateDebut", // Start date
              "dateFin", // End date
              "statut", // Stage status
            ]}
            items={internships.map((internship) => ({
              ...internship,
              "etudiant.email": internship.etudiant.email,
              "description": internship.description,
              "dateDebut": formatDate(internship.dateDebut), // Format start date
              "dateFin": formatDate(internship.dateFin), // Format end date
              "statut": internship.statut,
            }))}
            buttons={["Validate"]}
            actions={[handleValidate]}
            idParam="idStage"
          />
        )}
      </div>
    </Layout>
  );
}