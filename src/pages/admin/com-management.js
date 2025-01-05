import Layout from '@/components/Layout'
import Table from '@/components/Table'
import FormComponent from '@/components/FormComponent'
import SearchBar from '@/components/university/SearchBar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axiosInstance from '@/axiosInstance/axiosInstance'

export default function CompanyAccountsManagement() {
  const [companyAccounts, setCompanyAccounts] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [filteredAccounts, setFilteredAccounts] = useState([])
  const [formData, setFormData] = useState({})
  const [editAccountId, setEditAccountId] = useState(0)

  const router = useRouter()
  const handleLogout = () => {
    router.push('/')
  }

  const columns = ['idCompte','name', 'nom', 'prenom', 'telephone', 'email']
  const buttons = ['Edit', 'Disable']

  const fetchAccounts = async () => {
    try {
      const response = await axiosInstance.get('/compte-entreprises')
      console.log("Reponse")
      console.log(response)
      const accounts = await Promise.all(response.data.map(async (compteEntreprise) => {
        const entrepriseResponse = await axiosInstance.get(`/api/entreprises/${compteEntreprise.entrepriseId}`)
        return {
          ...compteEntreprise,
          name: entrepriseResponse.data.nomEntreprise
        }
      }))
      setCompanyAccounts(accounts)
      setFilteredAccounts(accounts)
    } catch (error) {
      console.error('Error fetching accounts:', error)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const handleSearch = (query) => {
    if (query.trim() === '') {
      setFilteredAccounts(companyAccounts);
      return;
    }
    const filtered = companyAccounts.filter(account => 
      account &&
      (
        (account.name && account.name.toLowerCase().includes(query.toLowerCase())) ||
        (account.idCompte && account.idCompte.toString().includes(query.toLowerCase())) ||
        (account.nom && account.nom.toLowerCase().includes(query.toLowerCase())) ||
        (account.prenom && account.prenom.toLowerCase().includes(query.toLowerCase()))
      )
    );
    setFilteredAccounts(filtered);
  }

  const handleCreate = async (formData) => {
    try {
      const entrepriseResponse = await axiosInstance.post('/api/entreprises', {
        nomEntreprise: formData.name,
        description: null,
        villeEntreprise: null,
        adresseEntreprise: null,
        telephoneFix: null,
        domaineEntreprise: null
      })
      const newEntrepriseId = entrepriseResponse.data.idEntreprise

      await axiosInstance.post('/compte-entreprises', {
        email: formData.email,
        motDePasse: formData.password,
        entrepriseId: newEntrepriseId,
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
      })

      setShowCreateForm(false)
      setFormData({})
      fetchAccounts() // Refresh the list
    } catch (error) {
      console.error('Error creating account:', error)
    }
  }

  const handleEdit = (id) => {
    const accountToEdit = companyAccounts.find(account => account.id === id)
    setFormData(accountToEdit)
    setEditAccountId(id)
    setShowEditForm(true)
  }

  const handleSaveEdit = async (formData) => {
    try {
      await axiosInstance.put(`/compte-entreprises/${editAccountId}`, formData)
      setShowEditForm(false)
      setFormData({})
      setEditAccountId(null)
      fetchAccounts() // Refresh the list
    } catch (error) {
      console.error('Error updating account:', error)
    }
  }

  const handleDisable = async (id) => {
    try {
      await axiosInstance.put(`/compte-entreprises/${id}/disable`, "AMAMAMA" )
      fetchAccounts() // Refresh the list
      console.log("Account Disabled")
    } catch (error) {
      console.error('Error disabling account:', error)
    }
  }

  const formFields = [
    { name: 'name', placeholder: 'Company Name' },
    { name: 'nom', placeholder: 'Nom' },
    { name: 'prenom', placeholder: 'Prenom' },
    { name: 'telephone', placeholder: 'Telephone' },
    { name: 'email', placeholder: 'Email' },
    { name: 'motDePasse', type: 'password', placeholder: 'Password' }
  ]

  return (
    <Layout role="admin" onLogout={handleLogout}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Company Accounts Management</h1>
        <div className="mb-4 flex justify-between items-center">
          <SearchBar onSearch={handleSearch} />
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => {
              setShowCreateForm(true)
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
          idParam={"idCompte"}
        />

        <FormComponent 
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreate}
          fields={formFields}
          title="Create New Company Account"
          submitButtonText="Create"
        />

        <FormComponent 
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          onSubmit={handleSaveEdit}
          fields={formFields}
          title="Edit Company Account"
          submitButtonText="Save"
          prefillData={companyAccounts.filter(account => account.idCompte = editAccountId)}
        />
      </div>
    </Layout>
  )
}
