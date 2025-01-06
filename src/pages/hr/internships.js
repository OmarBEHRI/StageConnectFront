import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import Table from '@/components/Table';

export default function HRInternships() {
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

  // Mock data - replace with actual data
  const internships = [
    { 
      id: 1, 
      studentname: "John Doe", 
      supervisor: "Jane Smith", 
      startdate: "2024-06-01",
      enddate: "2024-08-31",
      department: "Engineering"
    },
    // Add more internships...
  ];

  return (
    <Layout role="hr">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Internships Management</h1>
        
        <SearchBar onSearch={(query) => console.log('Search:', query)} />

        <Table 
          columns={["Student Name", "Supervisor", "Start Date", "End Date", "Department"]}
          items={internships}
        />
      </div>
    </Layout>
  );
}