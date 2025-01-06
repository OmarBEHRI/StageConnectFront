import Layout from '@/components/Layout';

export default function StudentProfile() {



  return (
    <Layout
      role="student"
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Student Profile</h1>
        {/* Add profile content here */}
      </div>
    </Layout>
  );
}