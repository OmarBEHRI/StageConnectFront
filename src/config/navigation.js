export const navConfigs = {
    admin: [
      { label: 'Dashboard', href: '/admin/' },
      { label: 'University Management', href: '/admin/uni-management' },
      { label: 'Company Management', href: '/admin/com-management' },
    ],
  
    university: [
      { label: 'Dashboard', href: '/university' },
      { label: 'CF', href: '/university/cf' },
      { label: 'Coordinators', href: '/university/coordinators' },
      { label: 'Students', href: '/university/students' },
      { label: 'Profile', href: '/university/profile' },
    ],
  
    cf: [
      { label: 'Dashboard', href: '/cf' },
      { label: 'Offers', href: '/cf/offers' },
      { label: 'Internships' , href: '/cf/internships'},
    ],
  
    coordinator: [
      { label: 'Dashboard', href: '/coordinator' },
      { label: 'Internships Management', href: '/coordinator/internships' },
    ],
  
    company: [
      { label: 'Dashboard', href: '/company' },
      { label: 'Supervisor Management', href: '/company/supervisor' },
      { label: 'HR Management', href: '/company/hr' },
      { label: 'Offers Management', href: '/company/offers' },
      { label: 'Profile', href: '/company/profile' },
    ],
  
    hr: [
      { label: 'Dashboard', href: '/hr' },
      { label: 'Offers Management', href: '/hr/offer-management' },
      { label: 'Interviews Management', href: '/hr/interviews' },
      { label: 'Internships Management', href: '/hr/internships' },
    ],
  
    supervisor: [
      { label: 'Dashboard', href: '/supervisor' },
      { label: 'Internships Management', href: '/supervisor/internships' },
    ],
  
    student: [
      { label: 'Dashboard', href: '/student' },
      { label: 'Offers', href: '/student/offers' },
      { label: 'Applications', href: '/student/applications' },
      { label: 'Interviews', href: '/student/interviews' },
      { label: 'Internships', href: '/student/internships' },
      { label: 'Profile', href: '/student/profile' },
    ],
  };
  
  // Helper function to get navigation links by role
export const getNavLinks = (role) => {
return navConfigs[role] || [];
};