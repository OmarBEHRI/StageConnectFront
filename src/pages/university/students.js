import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import SearchBar from '@/components/university/SearchBar';
import FormComponent from '@/components/FormComponent';
import Table from '@/components/Table';
import axiosInstance from '@/axiosInstance/axiosInstance';

export default function StudentsManagement() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [formData, setFormData] = useState({});
  const [editStudentId, setEditStudentId] = useState(null);
  const [ecoleId, setEcoleId] = useState(null);

  // Fetch the CompteEcole ID from local storage
  const compteEcoleId = localStorage.getItem('id');

  // Fetch the Ecole ID and Etudiant accounts on component mount
  useEffect(() => {
    if (compteEcoleId) {
      fetchEcoleId();
    }
  }, [compteEcoleId]);

  const fetchEcoleId = async () => {
    try {
      const response = await axiosInstance.get(`/compte-ecoles/${compteEcoleId}`);
      const ecoleId = response.data.ecoleId;
      setEcoleId(ecoleId);
      fetchStudentsByEcoleId(ecoleId); // Fetch students for the ecole
    } catch (error) {
      console.error('Error fetching Ecole ID:', error);
    }
  };

  const fetchStudentsByEcoleId = async (ecoleId) => {
    try {
      const response = await axiosInstance.get(`/api/etudiants/ecole/${ecoleId}`);
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleSearch = (query) => {
    if (query.trim() === '') {
      setFilteredStudents(students);
      return;
    }
    const filtered = students.filter(student =>
      student.nom.toLowerCase().includes(query.toLowerCase()) ||
      student.prenom.toLowerCase().includes(query.toLowerCase()) ||
      student.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleCreateStudent = async (studentData) => {
    try {
      const response = await axiosInstance.post('/api/etudiants', {
        nom: studentData.nom,
        prenom: studentData.prenom,
        email: studentData.email,
        tel: studentData.telephone,
        motDePasse: studentData.motDePasse,
        codeEtu: studentData.codeEtu,
        statutEtudiant: studentData.statutEtudiant,
        ecoleId: ecoleId,
        filiereId: studentData.filiereId,
      });
      setStudents([...students, response.data]);
      setFilteredStudents([...filteredStudents, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating student:', error);
    }
  };

  const handleEditStudent = (id) => {
    const studentToEdit = students.find(student => student.idEtu === id);
    setFormData(studentToEdit);
    setEditStudentId(id);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (studentData) => {
    try {
      const response = await axiosInstance.put(`/api/etudiants/${editStudentId}`, studentData);
      const updatedStudents = students.map(student =>
        student.idEtu === editStudentId ? response.data : student
      );
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      setIsModalOpen(false);
      setEditStudentId(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const studentFields = [
    { name: 'nom', placeholder: 'Nom', type: 'text' },
    { name: 'prenom', placeholder: 'Prénom', type: 'text' },
    { name: 'email', placeholder: 'Email', type: 'email' },
    { name: 'telephone', placeholder: 'Téléphone', type: 'text' },
    { name: 'motDePasse', placeholder: 'Mot de passe', type: 'password' },
    { name: 'codeEtu', placeholder: 'Code Étudiant', type: 'text' },
    { name: 'statutEtudiant', placeholder: 'Statut Étudiant', type: 'text' },
    { name: 'filiereId', placeholder: 'Filière ID', type: 'text' },
  ];

  return (
    <Layout role="university" onLogout={handleLogout}>
      <h1 className="text-3xl font-bold mb-12 mt-12">Gestion des Étudiants</h1>
      <div className="flex justify-between items-center mb-6">
        <SearchBar onSearch={handleSearch} />
        <button
          onClick={() => {
            setFormData({});
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Créer un étudiant
        </button>
      </div>
      <Table
        columns={['ID', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Code Étudiant', 'Statut']}
        columnKeys={['idEtu', 'nom', 'prenom', 'email', 'tel', 'codeEtu', 'statutEtudiant']}
        items={filteredStudents}
        buttons={['Modifier']} // Only the "Modifier" button is included
        actions={[handleEditStudent]} // Only the edit action is passed
        idParam="idEtu"
      />
      <FormComponent
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditStudentId(null);
        }}
        onSubmit={editStudentId ? handleSaveEdit : handleCreateStudent}
        fields={studentFields}
        title={editStudentId ? "Modifier l'étudiant" : "Créer un nouvel étudiant"}
        submitButtonText={editStudentId ? "Enregistrer" : "Créer"}
        prefillData={formData}
      />
    </Layout>
  );
}