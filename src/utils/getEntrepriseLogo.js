import axiosInstance from '@/axiosInstance/axiosInstance';

async function getEntrepriseLogoUrl(entrepriseId) {
  try {
    const logoResponse = await axiosInstance.get(`/api/entreprises/download/${entrepriseId}/logo`, {
      responseType: 'blob',
    });
    if (logoResponse.data.size > 0) {
      const logoBlob = new Blob([logoResponse.data], { type: 'image/jpeg' });
      return URL.createObjectURL(logoBlob);
    }
  } catch (error) {
    console.error('Error fetching entreprise logo:', error);
  }
  return null;
}

export default getEntrepriseLogoUrl;
