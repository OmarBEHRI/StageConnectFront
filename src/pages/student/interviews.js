import { useState, useEffect } from 'react'
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Card from '@/components/Card';
import { useRouter } from 'next/router';

export default function StudentInterviews() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      if (token) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const [interviews] = useState([ // Sample data
    {
      id: 1,
      company: 'Tech Corp',
      companyLogo: '/images/sample-logo.jpg',
      position: 'Frontend Developer',
      domain: 'Web Development',
      date: '2024-04-15',
      time: '14:00',
      location: 'Online (Zoom)',
      meetingLink: 'https://zoom.us/j/123456789',
      status: 'scheduled'
    },
    // Add more interviews...
  ]);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const handleJoinMeeting = (meetingLink) => {
    window.open(meetingLink, '_blank');
  };


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
              key={interview.id}
              image={interview.companyLogo}
              title={interview.company}
              specifications={[
                { label: "Position", value: interview.position },
                { label: "Domain", value: interview.domain },
                { label: "Date", value: interview.date },
                { label: "Time", value: interview.time },
                { label: "Location", value: interview.location },
                { label: "Meeting Link", value: interview.meetingLink, isLink: true }
              ]}
              buttons={[
                {
                  label: "Join Meeting",
                  onClick: () => handleJoinMeeting(interview.meetingLink)
                }
              ]}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}