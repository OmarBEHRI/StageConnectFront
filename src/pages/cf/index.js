import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';

export default function CFDashboard() {
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
  const stats = [
    { title: "Students in Major", value: "150" },
    { title: "Students with Internships", value: "45" },
    { title: "Visible Offers", value: "28" },
    { title: "Internships Found", value: "52" }
  ];


  return (
    <Layout
      role="cf"
    >
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-6">Career Fair Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} />
          ))}
        </div>
      </div>
    </Layout>
  );
}