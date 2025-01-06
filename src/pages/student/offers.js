import { useState, useEffect } from 'react'
import Image from 'next/image';
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Card from '@/components/Card';
import { useRouter } from 'next/router';

export default function StudentOffers() {
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
  const [offers, setOffers] = useState([ // Sample data
    {
      id: 1,
      company: "Tech Corp",
      position: "Frontend Developer",
      duration: "6 months",
      type: "Paid",
      domain: "Web Development",
      companyLogo: "/images/sample-logo.jpg"
    },
    // Add more sample offers...
  ]);

  const handleSearch = (query) => {
    // Implement search logic
    console.log("Searching for:", query);
  };

  const handleFastApply = (offerId) => {
    // Implement apply logic
    console.log("Applied to offer:", offerId);
  };


  return (
    <Layout role="student">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Available Offers</h1>
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {offers.map((offer) => (
            <Card
              key={offer.id}
              image={offer.companyLogo}
              title={offer.position}
              specifications={[
                { label: 'Company', value: offer.company },
                { label: 'Duration', value: offer.duration },
                { label: 'Type', value: offer.type },
                { label: 'Domain', value: offer.domain }
              ]}
              buttons={[
                {
                  label: 'Apply',
                  onClick: () => handleFastApply(offer.id)
                }
              ]}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}