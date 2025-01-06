import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProfilePicture from '@/components/university/ProfilePicture';
import { useRouter } from 'next/router';
import DescriptionSection from '@/components/university/DescriptionSection';

export default function UniversityProfile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
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
  useEffect(() => {
    // Fetch profile data
    // This is a placeholder. In a real application, you'd fetch this data from your API
    setProfileData({
      name: 'Example University',
      logo: '/placeholder-logo.png',
      foundationYear: 1950,
      city: 'Example City',
      country: 'Example Country',
      majors: ['Computer Science', 'Engineering', 'Business'],
      description: 'A leading institution in higher education...',
    });
  }, []);


  const handleUpdateProfile = (updatedData) => {
    // Implement profile update logic here
    console.log('Updating profile:', updatedData);
  };

  const handleUpdateLogo = (newLogo) => {
    // Implement logo update logic here
    console.log('Updating logo:', newLogo);
  };

  return (
    <Layout role="university">
      <h1 className="text-3xl font-bold mb-6">University Profile</h1>
      {profileData && (
        <div className="space-y-6">
          <ProfilePicture logo={profileData.logo} onUpdate={handleUpdateLogo} />
          <DescriptionSection data={profileData} onUpdate={handleUpdateProfile} />
        </div>
      )}
    </Layout>
  );
}

