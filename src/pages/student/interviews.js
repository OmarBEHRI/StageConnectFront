import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Card from '@/components/Card';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function StudentInterviews() {
  const router = useRouter();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      const etudiantId = localStorage.getItem("id");

      if (token && etudiantId) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
        fetchInterviews(etudiantId);
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const fetchInterviews = async (etudiantId) => {
    try {
      const response = await axiosInstance.get(`/api/entretiens/etudiant/${etudiantId}`);
      const interviewsWithDetails = await Promise.all(
        response.data.map(async (entretien) => {
          const [etudiantResponse, offreResponse] = await Promise.all([
            axiosInstance.get(`/api/etudiants/${entretien.etudiantId}`),
            axiosInstance.get(`/offres/${entretien.offreId}`),
          ]);

          return {
            ...entretien,
            etudiant: etudiantResponse.data,
            offre: offreResponse.data,
          };
        })
      );

      setInterviews(interviewsWithDetails);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const handleJoinMeeting = (meetingLink) => {
    window.open(meetingLink, '_blank');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout role="student">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Interviews</h1>
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {interviews.map((interview) => (
            <Card
              key={interview.idEntretien}
              title={interview.offre.objetOffre}
              specifications={[
                { label: "Date", value: formatDate(interview.dateEntretien) },
                { label: "Address", value: interview.adresse },
                { label: "Duration", value: interview.duree },
                { label: "Status", value: interview.etat },
                { label: "Result", value: interview.resultat },
                { label: "Meeting Link", value: interview.lien, isLink: true },
              ]}
              buttons={[
                {
                  label: "Rejoindre réunion",
                  onClick: () => handleJoinMeeting(interview.lien),
                },
              ]}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}