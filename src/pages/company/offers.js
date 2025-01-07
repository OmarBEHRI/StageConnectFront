import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Table from '@/components/Table';
import FormComponent from '@/components/FormComponent';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function ComOffers() {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
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

  const fetchCompteEntreprise = async () => {
    try {
      const compteEntrepriseId = localStorage.getItem('id');
      const response = await axiosInstance.get(`/compte-entreprises/${compteEntrepriseId}`);
      setEntrepriseId(response.data.entrepriseId);
      fetchOffers(response.data.entrepriseId);
    } catch (error) {
      console.error('Error fetching CompteEntreprise:', error);
      alert('Failed to fetch CompteEntreprise data.');
    }
  };

  const fetchOffers = async (entrepriseId) => {
    try {
      const response = await axiosInstance.get(`/api/offres/entreprise/${entrepriseId}`);
      setOffers(response.data);
    } catch (error) {
      console.error('Error fetching offers:', error);
      alert('Failed to fetch offers.');
    }
  };



  return (
    <Layout role="company">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Company Offers</h1>

        <div className="flex justify-between items-center">
          <SearchBar onSearch={(query) => console.log('Search:', query)} />
        </div>

        <Table
          columns={["ID Offre", "Title", "Position", "Start Date", "Status"]}
          columnKeys={["idOffre","objetOffre", "posteOffre", "dateLancement", "status"]}
          items={offers}
          idParam="idOffre"
        />
      </div>
    </Layout>
  );
}