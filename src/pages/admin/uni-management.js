import Layout from '@/components/Layout'
import Table from '@/components/Table'
import FormComponent from '@/components/FormComponent'
import SearchBar from '@/components/university/SearchBar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axiosInstance from '@/axiosInstance/axiosInstance'

export default function UniversityAccountsManagement() {
  const [universityAccounts, setUniversityAccounts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [filteredAccounts, setFilteredAccounts] = useState([])
  const [formData, setFormData] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [editAccountId, setEditAccountId] = useState(null)

  const router = useRouter()
  const handleLogout = () => {
    router.push('/')
  }

  const columns = ['ID', 'Name', "Last Name", "Phone", 'Email']
  const buttons = ['Edit', 'Disable']

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axiosInstance.get('/compte-ecoles')
        const accounts = await Promise.all(response.data.map(async (compteEcole) => {
          const ecoleResponse = await axiosInstance.get(`/api/ecoles/${compteEcole.ecoleId}`)
          return {
            ...compteEcole,
            name: ecoleResponse.data.nomEcole
          }
        }))
        setUniversityAccounts(accounts)
        setFilteredAccounts(accounts)
      } catch (error) {
        console.error('Error fetching accounts:', error)
      }
    }
    fetchAccounts()
  }, [])

  const handleSearch = (query) => {
    const filtered = universityAccounts.filter(account => 
      account.name.toLowerCase().includes(query.toLowerCase()) ||
      account.idCompte.toString().includes(query.toLowerCase())||
      account.nom.toLowerCase().includes(query.toLowerCase()) ||
      account.prenom.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredAccounts(filtered)
  }

  const handleCreate = async (formData) => {
    try {
      const ecoleResponse = await axiosInstance.post('/api/ecoles', {
        nomEcole: formData.name,
        villeEcole: null,
        adresseEcole: null,
        description: null,
        telephoneFix: null,
        typeEcole: null,
        domaineEcole: null
      })
      const newEcoleId = ecoleResponse.data.idEcole

      await axiosInstance.post('/compte-ecoles', {
        ...formData,
        ecoleId: newEcoleId,
        role: 'ROLE_ECOLE'
      })

      setShowForm(false)
      setFormData({})
      fetchAccounts() // Refresh the list
    } catch (error) {
      console.error('Error creating account:', error)
    }
  }

  const handleEdit = (id) => {
    const accountToEdit = universityAccounts.find(account => account.idCompte === id)
    setFormData(accountToEdit)
    setIsEditMode(true)
    setEditAccountId(id)
    setShowForm(true)
  }

  const handleSaveEdit = async (formData) => {
    try {
      await axiosInstance.put(`/compte-ecoles/${editAccountId}`, formData)
      setShowForm(false)
      setFormData({})
      setIsEditMode(false)
      setEditAccountId(null)
      fetchAccounts() // Refresh the list
    } catch (error) {
      console.error('Error updating account:', error)
    }
  }

  const handleDisable = async (id) => {
    try {
      await axiosInstance.put(`/compte-ecoles/${id}/disable`, { id, newPassword: null })
      fetchAccounts() // Refresh the list
    } catch (error) {
      console.error('Error disabling account:', error)
    }
  }

  const formFields = [
    { name: 'name', placeholder: 'University Name' },
    { name: 'email', placeholder: 'Email' },
    { name: 'password', type: 'password', placeholder: 'Password' }
  ]

  return (
    <Layout role="admin" onLogout={handleLogout}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">University Accounts Management</h1>
        <div className="mb-4 flex justify-between items-center">
          <SearchBar onSearch={handleSearch} />
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => {
              setShowForm(true)
              setIsEditMode(false)
              setFormData({})
            }}
          >
            Create New Account
          </button>
        </div>
        
        <Table 
          columns={columns}
          items={filteredAccounts}
          buttons={buttons}
          actions={[handleEdit, handleDisable]}
        />

        <FormComponent 
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={isEditMode ? handleSaveEdit : handleCreate}
          fields={formFields}
          title={isEditMode ? "Edit University Account" : "Create New University Account"}
          initialData={formData}
        />
      </div>
    </Layout>
  )
}
