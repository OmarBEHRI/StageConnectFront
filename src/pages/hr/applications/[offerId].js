import { useState } from 'react';
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Card from '@/components/Card';
import FormComponent from '@/components/FormComponent';

export default function HRApplicationManagement() {
  const router = useRouter();
  const { offerId } = router.query;
  const [isInterviewFormOpen, setIsInterviewFormOpen] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);

  // Mock data - replace with actual data
  const applications = [
    {
      id: 1,
      image: "/default-avatar.png", // Add default avatar image
      name: "John Doe",
      university: "MIT",
      academicLevel: "Master's",
      major: "Computer Science",
      cvLink: "https://example.com/cv1.pdf",
      motivationLetter: "I am very interested in this position...",
    },
    {
      id: 2,
      image: "/default-avatar.png",
      name: "Jane Smith",
      university: "Stanford",
      academicLevel: "Bachelor's",
      major: "Software Engineering",
      cvLink: "https://example.com/cv2.pdf",
      motivationLetter: "I believe I would be a great fit...",
    },
  ];

  const interviewFormFields = [
    { name: "date", type: "date", placeholder: "Interview Date" },
    { name: "time", type: "time", placeholder: "Interview Time" },
    { name: "location", placeholder: "Interview Location" },
    { name: "interviewer", placeholder: "Interviewer Name" },
  ];

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // Implement search logic here
  };

  const handleScheduleInterview = (applicantId) => {
    setSelectedApplicantId(applicantId);
    setIsInterviewFormOpen(true);
  };

  const handleRefuse = (applicantId) => {
    console.log('Refusing application:', applicantId);
    // Implement refuse logic here
  };

  const handleCreateInterview = (data) => {
    console.log('Creating interview for applicant:', selectedApplicantId, data);
    setIsInterviewFormOpen(false);
    // Implement interview creation logic here
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
          {applications.map((application) => (
            <Card
              key={application.id}
              image={application.image}
              title={application.name}
              specifications={[
                { label: "University", value: application.university },
                { label: "Academic Level", value: application.academicLevel },
                { label: "Major", value: application.major },
                { label: "CV", value: application.cvLink, isLink: true },
                { label: "Motivation", value: application.motivationLetter },
              ]}
              buttons={[
                {
                  label: "Schedule Interview",
                  onClick: () => handleScheduleInterview(application.id),
                },
                {
                  label: "Refuse",
                  onClick: () => handleRefuse(application.id),
                },
              ]}
            />
          ))}
        </div>

        <FormComponent
          isOpen={isInterviewFormOpen}
          onClose={() => setIsInterviewFormOpen(false)}
          onSubmit={handleCreateInterview}
          fields={interviewFormFields}
          title="Schedule Interview"
        />
      </div>
    </Layout>
  );
}