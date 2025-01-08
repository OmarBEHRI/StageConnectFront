import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Card from '@/components/Card';
import FormComponent from '@/components/FormComponent';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function HRApplicationManagement() {
  const router = useRouter();
  const { offerId } = router.query;

  const [isInterviewFormOpen, setIsInterviewFormOpen] = useState(false);
  const [selectedPostulationId, setSelectedPostulationId] = useState(null);
  const [postulations, setPostulations] = useState([]);
  const [filteredPostulations, setFilteredPostulations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      if (token) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
        if (offerId) fetchPostulations(offerId);
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router, offerId]);

  const fetchPostulations = async (offerId) => {
    try {
      const response = await axiosInstance.get(`/api/postulations/offre/${offerId}`);
      const pendingPostulations = response.data.filter(
        (postulation) => postulation.etatPostulation === "En attente"
      );
      setPostulations(pendingPostulations);
      setFilteredPostulations(pendingPostulations);
    } catch (error) {
      console.error('Error fetching postulations:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = postulations.filter(
      (postulation) =>
        postulation.etudiantId.toString().includes(query) ||
        postulation.offreId.toString().includes(query)
    );
    setFilteredPostulations(filtered);
  };

  const handleScheduleInterview = (postulationId) => {
    setSelectedPostulationId(postulationId);
    setIsInterviewFormOpen(true);
  };

  const handleRefuse = async (postulationId) => {
    try {
      await axiosInstance.patch(`/api/postulations/${postulationId}/etat`, null, {
        params: { etat: 'refusé' },
      });
      fetchPostulations(offerId); // Refresh the list
    } catch (error) {
      console.error('Error refusing postulation:', error);
    }
  };

  const handleCreateInterview = async (data) => {
    try {
      const postulation = postulations.find((p) => p.id === selectedPostulationId);
      const entretienDTO = {
        dateEntretien: new Date(`${data.date}T${data.time}`).toISOString(),
        adresse: data.location,
        duree: data.duration,
        etat: "Scheduled",
        resultat: "nouveau",
        lien: data.link,
        offreId: postulation.offreId,
        etudiantId: postulation.etudiantId,
      };

      await axiosInstance.post('/entretiens', entretienDTO);
      await axiosInstance.patch(`/api/postulations/${selectedPostulationId}/etat`, null, {
        params: { etat: 'accepté' },
      });

      setIsInterviewFormOpen(false);
      fetchPostulations(offerId); // Refresh the list
    } catch (error) {
      console.error('Error creating interview:', error);
    }
  };

  if (!offerId) return null;

  return (
    <Layout role="hr">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Applications Management</h1>
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPostulations.map((postulation) => (
            <PostulationCard
              key={postulation.id}
              postulation={postulation}
              handleScheduleInterview={handleScheduleInterview}
              handleRefuse={handleRefuse}
            />
          ))}
        </div>

        <FormComponent
          isOpen={isInterviewFormOpen}
          onClose={() => setIsInterviewFormOpen(false)}
          onSubmit={handleCreateInterview}
          fields={[
            { name: "date", type: "date", placeholder: "Interview Date", required: true },
            { name: "time", type: "time", placeholder: "Interview Time", required: true },
            { name: "location", placeholder: "Interview Location", required: true },
            { name: "duration", placeholder: "Duration", required: true },
            { name: "link", placeholder: "Meeting Link", required: true },
          ]}
          title="Schedule Interview"
          submitButtonText="Creer"
        />
      </div>
    </Layout>
  );
}

function PostulationCard({ postulation, handleScheduleInterview, handleRefuse }) {
  const [offer, setOffer] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/api/offres/${postulation.offreId}`)
      .then(response => setOffer(response.data))
      .catch(error => console.error('Error fetching offer:', error));

    axiosInstance.get(`/api/etudiants/${postulation.etudiantId}`)
      .then(response => setStudent(response.data))
      .catch(error => console.error('Error fetching student:', error));
  }, [postulation.offreId, postulation.etudiantId]);

  const handleViewPdf = (data, fileName = 'document.pdf') => {
      if (!data) return;
      
      // Create a Blob from the PDF data
      const blob = new Blob([data], { type: 'application/pdf' });
      
      // Create a link element
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName; // Set the file name for the download
      
      // Append the link to the body (required for Firefox)
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Remove the link from the document
      document.body.removeChild(link);
      
      // Revoke the Blob URL to free up memory
      URL.revokeObjectURL(link.href);
  };

  if (!offer || !student) return <div>Loading...</div>;

  return (
    <Card
      title={`Postulation #${postulation.id}`}
      specifications={[
        { label: "Etudiant", value: `${student.nom} ${student.prenom}` },
        { label: "Offre", value: offer.objetOffre },
        { label: "État", value: postulation.etatPostulation },
      ]}
      buttons={[
        {
          label: "Accepter",
          onClick: () => handleScheduleInterview(postulation.id),
        },
        {
          label: "Refuser",
          onClick: () => handleRefuse(postulation.id),
        },
      ]}
      extraContent={
        <div>
          <a
            href="#"
            onClick={() => handleViewPdf(postulation.Cv, 'Cv')}
            className="text-blue-600 hover:underline"
          >
            Voir CV
          </a>
          <br />
          <a
            href="#"
            onClick={() => handleViewPdf(postulation.LettreMotivation, 'Lettre de Motivation')}
            className="text-blue-600 hover:underline"
          >
            Voir Lettre de Motivation
          </a>
        </div>
      }
    />
  );
}