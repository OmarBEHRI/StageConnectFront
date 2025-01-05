import Layout from '@/components/Layout'
import Table from '@/components/Table'
import FormComponent from '@/components/FormComponent'
import SearchBar from '@/components/university/SearchBar'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function CompanyAccountsManagement() {
  const [companyAccounts, setCompanyAccounts] = useState([
    { id: 'com1', name: 'Company X', username: 'compX', password: '••••••••' },
    { id: 'com2', name: 'Company Y', username: 'compY', password: '••••••••' },
  ])
  const [showForm, setShowForm] = useState(false)
  const [filteredAccounts, setFilteredAccounts] = useState(companyAccounts)
  
  const router = useRouter()
  const handleLogout = () => {
    router.push('/')
  }

  const columns = ['ID', 'Name', 'Username', 'Password']
  const buttons = ['Edit', 'Delete']

  const handleSearch = (query) => {
    const filtered = companyAccounts.filter(account => 
      account.name.toLowerCase().includes(query.toLowerCase()) ||
      account.id.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredAccounts(filtered)
  }

  const handleCreate = (formData) => {
    const newAccount = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      password: '••••••••'
    }
    setCompanyAccounts([...companyAccounts, newAccount])
    setFilteredAccounts([...companyAccounts, newAccount])
    setShowForm(false)
  }

  const handleEdit = (id) => {
    console.log('Editing account', id)
  }

  const handleDelete = (id) => {
    const updated = companyAccounts.filter(account => account.id !== id)
    setCompanyAccounts(updated)
    setFilteredAccounts(updated)
  }

  const formFields = [
    { name: 'name', placeholder: 'Company Name' },
    { name: 'username', placeholder: 'Username' },
    { name: 'password', type: 'password', placeholder: 'Password' }
  ]

  return (
    <Layout role="admin" onLogout={handleLogout}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Company Accounts Management</h1>
        <div className="mb-4 flex justify-between items-center">
          <SearchBar onSearch={handleSearch} />
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => setShowForm(true)}
          >
            Create New Account
          </button>
        </div>
        
        <Table 
          columns={columns}
          items={filteredAccounts}
          buttons={buttons}
          actions={[handleEdit, handleDelete]}
        />

        <FormComponent 
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          fields={formFields}
          title="Create New Company Account"
        />
      </div>
    </Layout>
  )
}

