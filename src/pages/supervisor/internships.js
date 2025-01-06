import { useState } from 'react';
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Card from '@/components/Card';
import FormComponent from '@/components/FormComponent';

export default function SupervisorInternships() {
  const [isEvaluationFormOpen, setIsEvaluationFormOpen] = useState(false);
  const [selectedInternshipId, setSelectedInternshipId] = useState(null);

  // Mock data - replace with actual data
  const internships = [
    {
      id: 1,
      image: "/default-avatar.png",
      studentName: "John Doe",
      subject: "Web Development",
      startDate: "2024-01-15",
      endDate: "2024-07-15",
      status: "ongoing"
    },
    {
      id: 2,
      image: "/default-avatar.png",
      studentName: "Jane Smith",
      subject: "Mobile App Development",
      startDate: "2023-08-01",
      endDate: "2024-02-01",
      status: "completed"
    }
  ];

  const evaluationFormFields = [
    { name: "performance", type: "select", placeholder: "Performance Rating", 
      options: ["Excellent", "Good", "Average", "Below Average"] },
    { name: "skills", placeholder: "Technical Skills Demonstrated" },
    { name: "strengths", placeholder: "Key Strengths" },
    { name: "improvements", placeholder: "Areas for Improvement" },
    { name: "comments", type: "textarea", placeholder: "Additional Comments" }
  ];

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // Implement search logic here
  };

  const handleEvaluate = (internshipId) => {
    setSelectedInternshipId(internshipId);
    setIsEvaluationFormOpen(true);
  };

  const handleSubmitEvaluation = (data) => {
    console.log('Submitting evaluation for internship:', selectedInternshipId, data);
    setIsEvaluationFormOpen(false);
  };


  return (
    <Layout role="supervisor">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Internships Management</h1>
        
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {internships.map((internship) => (
            <Card
              key={internship.id}
              image={internship.image}
              title={internship.studentName}
              specifications={[
                { label: "Subject", value: internship.subject },
                { label: "Start Date", value: internship.startDate },
                { label: "End Date", value: internship.endDate },
                { label: "Status", value: internship.status }
              ]}
              buttons={
                internship.status === "completed" 
                  ? [{ 
                      label: "Evaluate",
                      onClick: () => handleEvaluate(internship.id)
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