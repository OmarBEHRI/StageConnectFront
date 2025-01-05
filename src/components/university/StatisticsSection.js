export default function StatisticsSection({ stats }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Students" value={stats.students} />
        <StatCard title="Total Offers" value={stats.offers} />
        <StatCard title="Students Without Internship" value={stats.studentsWithoutInternship} />
        <div className="col-span-full">
          <h2 className="text-xl font-semibold mb-4">Internship Percentage by Major</h2>
          {Object.entries(stats.internshipPercentageByMajor).map(([major, percentage]) => (
            <div key={major} className="flex justify-between items-center mb-2">
              <span>{major}:</span>
              <span>{percentage}%</span>
            </div>
          ))}
        </div>
        <div className="col-span-full">
          <h2 className="text-xl font-semibold mb-4">Offers by Major</h2>
          {Object.entries(stats.offersByMajor).map(([major, count]) => (
            <div key={major} className="flex justify-between items-center mb-2">
              <span>{major}:</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  function StatCard({ title, value }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    );
  }
  
  