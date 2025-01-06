import { useState, useEffect } from 'react'
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Card from '@/components/Card';
import { useRouter } from 'next/router';

export default function CFOffers() {
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
  const [selectedOffers, setSelectedOffers] = useState(new Set());

  // Mock data - replace with actual data
  const offers = [
    {
      id: 1,
      image: "/company-logo1.png",
      companyName: "Tech Corp",
      role: "Software Engineer",
      period: "6 months",
      domain: "Software Development",
      type: "Paid",
    },
    {
      id: 2,
      image: "/company-logo2.png",
      companyName: "Data Systems",
      role: "Data Analyst",
      period: "3 months",
      domain: "Data Science",
      type: "Unpaid",
    },
  ];

  const toggleSelectAll = () => {
    if (selectedOffers.size === offers.length) {
      setSelectedOffers(new Set());
    } else {
      setSelectedOffers(new Set(offers.map(offer => offer.id)));
    }
  };

  const toggleOffer = (offerId) => {
    const newSelected = new Set(selectedOffers);
    if (newSelected.has(offerId)) {
      newSelected.delete(offerId);
    } else {
      newSelected.add(offerId);
    }
    setSelectedOffers(newSelected);
  };

  return (
    <Layout role="cf">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Available Offers</h1>
        
        <div className="flex items-center justify-between mb-6">
          <SearchBar onSearch={(query) => console.log('Search:', query)} />
          <button
            onClick={toggleSelectAll}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {selectedOffers.size === offers.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {offers.map((offer) => (
            <Card
              key={offer.id}
              image={offer.image}
              title={offer.companyName}
              specifications={[
                { label: "Role", value: offer.role },
                { label: "Period", value: offer.period },
                { label: "Domain", value: offer.domain },
                { label: "Type", value: offer.type },
              ]}
              buttons={[{
                label: selectedOffers.has(offer.id) ? "Deselect" : "Select",
                onClick: () => toggleOffer(offer.id)
              }]}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}