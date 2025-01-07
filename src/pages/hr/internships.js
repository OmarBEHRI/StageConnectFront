import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Table from '@/components/Table';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function HRInternships() {
  const router = useRouter();
  const [internships, setInternships] = useState([]);
  const [entrepriseId, setEntrepriseId] = useState(null);

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

  // Fetch RH by ID to get entrepriseId
  const fetchCompteEntreprise = async () => {
    try {
      const rhId = localStorage.getItem('id');
      const response = await axiosInstance.get(`/api/rh/${rhId}`);
      setEntrepriseId(response.data.entrepriseId);
      fetchInternships(response.data.entrepriseId); // Fetch internships for the company
    } catch (error) {
      console.error('Error fetching RH details:', error);
      alert('Failed to fetch RH details.');
    }
  };

  // Fetch internships by entrepriseId and enrich with Etudiant details
  const fetchInternships = async (entrepriseId) => {
    try {
      const response = await axiosInstance.get(`/stages/by-entreprise/${entrepriseId}`);
      
      // Fetch Etudiant details for each internship
      const internshipsWithEtudiant = await Promise.all(
        response.data.map(async (internship) => {
          const etudiantResponse = await axiosInstance.get(`/api/etudiants/${internship.etudiantId}`);
          return {
            ...internship,
            etudiant: etudiantResponse.data, // Add Etudiant details to the internship object
            dateDebut: formatDate(internship.dateDebut), // Format start date
            dateFin: formatDate(internship.dateFin), // Format end date
          };
        })
      );

      setInternships(internshipsWithEtudiant);
    } catch (error) {
      console.error('Error fetching internships or Etudiant details:', error);
      alert('Failed to fetch internships or Etudiant details.');
    }
  };

  // Format date to a human-readable format
  const formatDate = (date) => {
    if (!date) return "N/A"; // Handle null or undefined dates
    const dateObj = new Date(date);
    return dateObj.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Handle delete action for an internship
  const handleDelete = async (internshipId) => {
    try {
      await axiosInstance.delete(`/stages/${internshipId}`);
      fetchInternships(entrepriseId); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting internship:', error);
      alert('Failed to delete internship.');
    }
  };

  return (
    <Layout role="hr">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Internships Management</h1>
        
        <SearchBar onSearch={(query) => console.log('Search:', query)} />

        <Table 
          columns={["ID", "Title", "Student Name", "Email", "Phone", "Start Date", "End Date", "Status"]}
          columnKeys={[
            "idStage", 
            "titre", 
            "etudiant.nom", 
            "etudiant.email", 
            "etudiant.tel", 
            "dateDebut", 
            "dateFin", 
            "statut"
          ]}
          items={internships}
          buttons={["Delete"]}
          actions={[handleDelete]}
          idParam="idStage"
          formatData={(key, value) => {
            if (key === "dateDebut" || key === "dateFin") {
              return formatDate(value); // Format date fields
            }
            return value; // Return other values as-is
          }}
        />
      </div>
    </Layout>
  );
}