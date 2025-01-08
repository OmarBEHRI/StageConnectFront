import Layout from '@/components/Layout'
import StatCard from '@/components/StatCard'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axiosInstance from '@/axiosInstance/axiosInstance'

export default function Dashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    universityAccounts: 0,
    companyAccounts: 0,
    students: 0,
    openOffers: 0,
    totalOffers: 0,
    internships: 0,
    ongoingInternships: 0,
    interviews: 0,
    totalPlatformUsers: 0,
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`
        fetchStats()
      } else {
        router.push('/')
      }
    } else {
      router.push('/')
    }
  }, [router])

  const fetchStats = async () => {
    try {
      const universityAccountsRes = await axiosInstance.get('/api/admins/ecoles');
      const companyAccountsRes = await axiosInstance.get('/api/admins/entreprises');
      const studentsRes = await axiosInstance.get('/api/admins/etudiants');
      const openOffersRes = await axiosInstance.get('/api/admins/open-offers/count');
      const totalOffersRes = await axiosInstance.get('/api/admins/offers');
      const internshipsRes = await axiosInstance.get('/api/admins/stages-offres');
      const ongoingInternshipsRes = await axiosInstance.get('/api/admins/stages/ongoing');
      const interviewsRes = await axiosInstance.get('/api/admins/entretiens');
      const totalPlatformUsersRes = await axiosInstance.get('/api/admins/count-platform-users');

      setStats({
        universityAccounts: universityAccountsRes.data,
        companyAccounts: companyAccountsRes.data,
        students: studentsRes.data,
        openOffers: openOffersRes.data,
        totalOffers: totalOffersRes.data,
        internships: internshipsRes.data,
        ongoingInternships: ongoingInternshipsRes.data,
        interviews: interviewsRes.data,
        totalPlatformUsers: totalPlatformUsersRes.data,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <Layout role="admin">
      <div>
        <h1 className="text-3xl font-bold mb-12 mt-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <StatCard title="University Accounts" value={stats.universityAccounts} />
          <StatCard title="Company Accounts" value={stats.companyAccounts} />
          <StatCard title="Students" value={stats.students} />
          <StatCard title="Open Offers" value={stats.openOffers} />
          <StatCard title="Total Offers" value={stats.totalOffers} />
          <StatCard title="Internships Created" value={stats.internships} />
          <StatCard title="Ongoing Internships" value={stats.ongoingInternships} />
          <StatCard title="Interviews" value={stats.interviews} />
          <StatCard title="Total Platform Users" value={stats.totalPlatformUsers} />
        </div>
      </div>
    </Layout>
  )
}