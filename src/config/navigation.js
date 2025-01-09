export const navConfigs = {
    admin: [
      { label: 'Dashboard', href: '/admin/' },
      { label: 'GestionUniversités', href: '/admin/ecole-management' },
      { label: 'GestionEntreprises', href: '/admin/entreprise-management' },
    ],
  
    university: [
      { label: 'Dashboard', href: '/ecole' },
      { label: 'CF', href: '/ecole/cf' },
      { label: 'Coordinateurs', href: '/ecole/coordinateurs' },
      { label: 'Étudiants', href: '/ecole/etudiants' },
      { label: 'Profil', href: '/ecole/profile' },
    ],
  
    cf: [
      { label: 'Dashboard', href: '/cf' },
      { label: 'Offres', href: '/cf/offres' },
      { label: 'Stages', href: '/cf/stages' },
    ],
  
    coordinator: [
      { label: 'Dashboard', href: '/coordinateur' },
      { label: 'GestionStages', href: '/coordinateur/stages' },
      { label: 'Evaluations', href: '/coordinateur/evaluations' },
    ],
  
    company: [
      { label: 'Dashboard', href: '/entreprise' },
      { label: 'GestionEncadrants', href: '/entreprise/encadrant' },
      { label: 'GestionRH', href: '/entreprise/rh' },
      { label: 'GestionOffres', href: '/entreprise/offres' },
      { label: 'Profil', href: '/entreprise/profile' },
    ],
  
    hr: [
      { label: 'Dashboard', href: '/rh' },
      { label: 'GestionOffres', href: '/rh/management-offre' },
      { label: 'GestionEntretiens', href: '/rh/entretiens' },
      { label: 'GestionStages', href: '/rh/stages' },
    ],
  
    supervisor: [
      { label: 'Dashboard', href: '/encadrant' },
      { label: 'GestionStages', href: '/encadrant/stages' },
    ],
  
    student: [
      { label: 'Dashboard', href: '/etudiant' },
      { label: 'Offres', href: '/etudiant/offres' },
      { label: 'Postulations', href: '/etudiant/postulations' },
      { label: 'Entretiens', href: '/etudiant/entretiens' },
      { label: 'Stages', href: '/etudiant/stages' },
      { label: 'Profil', href: '/etudiant/profile' },
    ],
  };
  
  // Helper function to get navigation links by role
export const getNavLinks = (role) => {
return navConfigs[role] || [];
};