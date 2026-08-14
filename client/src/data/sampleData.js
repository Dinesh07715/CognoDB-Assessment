// Sample data that mirrors the backend CognoDB data model
// This is used for UI development without connecting to the backend

export const sampleRoles = [
  {
    id: 'role-1',
    name: 'Senior Full-Stack Engineer',
    description: 'Lead engineer responsible for building and maintaining full-stack applications',
    category: 'Engineering',
    requiredSkillCount: 12,
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    skillPreview: ['JavaScript', 'System Design', 'Database Architecture'],
  },
  {
    id: 'role-2',
    name: 'Product Manager',
    description: 'Drive product strategy and cross-functional collaboration',
    category: 'Product',
    requiredSkillCount: 8,
    technologies: ['Analytics', 'Figma', 'SQL'],
    skillPreview: ['Product Strategy', 'User Research', 'Data Analysis'],
  },
  {
    id: 'role-3',
    name: 'DevOps Engineer',
    description: 'Manage infrastructure, CI/CD pipelines, and cloud deployments',
    category: 'Infrastructure',
    requiredSkillCount: 10,
    technologies: ['Kubernetes', 'AWS', 'Terraform', 'Docker'],
    skillPreview: ['Cloud Architecture', 'Automation', 'Monitoring'],
  },
  {
    id: 'role-4',
    name: 'Frontend Engineer',
    description: 'Build intuitive and performant user interfaces',
    category: 'Engineering',
    requiredSkillCount: 9,
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    skillPreview: ['React', 'CSS', 'Accessibility'],
  },
  {
    id: 'role-5',
    name: 'Data Scientist',
    description: 'Extract insights from data and build predictive models',
    category: 'Data',
    requiredSkillCount: 11,
    technologies: ['Python', 'TensorFlow', 'SQL', 'Pandas'],
    skillPreview: ['Machine Learning', 'Statistical Analysis', 'Python'],
  },
  {
    id: 'role-6',
    name: 'Solutions Architect',
    description: 'Design scalable solutions matching business requirements',
    category: 'Architecture',
    requiredSkillCount: 13,
    technologies: ['AWS', 'Azure', 'Kubernetes', 'Microservices'],
    skillPreview: ['System Design', 'Cloud Architecture', 'Enterprise Patterns'],
  },
];

export const sampleSkills = [
  { id: 'skill-1', name: 'JavaScript', category: 'Programming', difficulty: 'Intermediate' },
  { id: 'skill-2', name: 'React', category: 'Frontend', difficulty: 'Intermediate' },
  { id: 'skill-3', name: 'Node.js', category: 'Backend', difficulty: 'Intermediate' },
  { id: 'skill-4', name: 'TypeScript', category: 'Programming', difficulty: 'Advanced' },
  { id: 'skill-5', name: 'System Design', category: 'Architecture', difficulty: 'Advanced' },
  { id: 'skill-6', name: 'Database Design', category: 'Data', difficulty: 'Advanced' },
  { id: 'skill-7', name: 'Python', category: 'Programming', difficulty: 'Intermediate' },
  { id: 'skill-8', name: 'Machine Learning', category: 'Data', difficulty: 'Advanced' },
  { id: 'skill-9', name: 'AWS', category: 'Cloud', difficulty: 'Intermediate' },
  { id: 'skill-10', name: 'Docker', category: 'DevOps', difficulty: 'Intermediate' },
  { id: 'skill-11', name: 'Kubernetes', category: 'DevOps', difficulty: 'Advanced' },
  { id: 'skill-12', name: 'SQL', category: 'Data', difficulty: 'Intermediate' },
  { id: 'skill-13', name: 'Product Strategy', category: 'Product', difficulty: 'Advanced' },
  { id: 'skill-14', name: 'User Research', category: 'Product', difficulty: 'Intermediate' },
  { id: 'skill-15', name: 'Accessibility', category: 'Frontend', difficulty: 'Intermediate' },
];

export const sampleProjects = [
  {
    id: 'proj-1',
    name: 'E-Commerce Platform Redesign',
    description: 'Modernized legacy e-commerce platform with microservices',
    difficulty: 'Advanced',
    technologies: ['React', 'Node.js', 'Kubernetes', 'PostgreSQL'],
    skills: ['System Design', 'React', 'Microservices', 'Database Design'],
    duration: '6 months',
  },
  {
    id: 'proj-2',
    name: 'Real-time Analytics Dashboard',
    description: 'Built real-time data visualization for business intelligence',
    difficulty: 'Intermediate',
    technologies: ['React', 'Python', 'WebSocket', 'InfluxDB'],
    skills: ['React', 'Data Analysis', 'Real-time Systems'],
    duration: '3 months',
  },
  {
    id: 'proj-3',
    name: 'Cloud Infrastructure Automation',
    description: 'Automated cloud infrastructure using Infrastructure as Code',
    difficulty: 'Advanced',
    technologies: ['Terraform', 'AWS', 'Docker', 'CI/CD'],
    skills: ['Cloud Architecture', 'Automation', 'DevOps'],
    duration: '4 months',
  },
  {
    id: 'proj-4',
    name: 'ML Recommendation Engine',
    description: 'Developed personalized recommendation system',
    difficulty: 'Advanced',
    technologies: ['Python', 'TensorFlow', 'PostgreSQL'],
    skills: ['Machine Learning', 'Python', 'System Design'],
    duration: '5 months',
  },
];

export const sampleResources = [
  {
    id: 'res-1',
    title: 'The System Design Interview',
    type: 'Book',
    url: '#',
    description: 'Master system design fundamentals',
  },
  {
    id: 'res-2',
    title: 'React Documentation',
    type: 'Official Docs',
    url: '#',
    description: 'Official React library documentation',
  },
  {
    id: 'res-3',
    title: 'Kubernetes in Action',
    type: 'Course',
    url: '#',
    description: 'Comprehensive Kubernetes training',
  },
  {
    id: 'res-4',
    title: 'AWS Architecture Best Practices',
    type: 'Whitepaper',
    url: '#',
    description: 'Official AWS architecture guidelines',
  },
];

export const sampleRoleDetails = {
  id: 'role-1',
  name: 'Senior Full-Stack Engineer',
  description: 'As a Senior Full-Stack Engineer, you will be responsible for architecting and implementing robust, scalable web applications. You\'ll collaborate with cross-functional teams to define technical requirements, mentor junior engineers, and establish best practices for code quality and system reliability.',
  category: 'Engineering',
  seniority: 'Senior',
  requiredSkills: [
    { id: 'skill-1', name: 'JavaScript', category: 'Programming', difficulty: 'Intermediate' },
    { id: 'skill-2', name: 'React', category: 'Frontend', difficulty: 'Intermediate' },
    { id: 'skill-3', name: 'Node.js', category: 'Backend', difficulty: 'Intermediate' },
    { id: 'skill-4', name: 'TypeScript', category: 'Programming', difficulty: 'Advanced' },
    { id: 'skill-5', name: 'System Design', category: 'Architecture', difficulty: 'Advanced' },
    { id: 'skill-6', name: 'Database Design', category: 'Data', difficulty: 'Advanced' },
  ],
  technologies: [
    { name: 'React', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'AWS', category: 'Cloud' },
    { name: 'TypeScript', category: 'Language' },
  ],
  recommendedProjects: [
    {
      id: 'proj-1',
      name: 'E-Commerce Platform Redesign',
      description: 'Modernized legacy e-commerce platform with microservices',
      difficulty: 'Advanced',
      technologies: ['React', 'Node.js', 'Kubernetes'],
    },
  ],
  relatedRoles: [
    {
      id: 'role-3',
      name: 'DevOps Engineer',
      category: 'Infrastructure',
      sharedSkills: 4,
    },
    {
      id: 'role-4',
      name: 'Frontend Engineer',
      category: 'Engineering',
      sharedSkills: 5,
    },
  ],
  learningResources: sampleResources,
};

export const getTechBadgeColor = (tech) => {
  const colors = {
    'React': 'border-sky-500/30 bg-sky-500/10 text-sky-200',
    'Node.js': 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    'TypeScript': 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200',
    'PostgreSQL': 'border-slate-500/30 bg-slate-500/10 text-slate-200',
    'Docker': 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200',
    'AWS': 'border-orange-500/30 bg-orange-500/10 text-orange-200',
    'Kubernetes': 'border-violet-500/30 bg-violet-500/10 text-violet-200',
    'Python': 'border-amber-500/30 bg-amber-500/10 text-amber-200',
    'TensorFlow': 'border-rose-500/30 bg-rose-500/10 text-rose-200',
    'Terraform': 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  };
  return colors[tech] || 'border-slate-600 bg-slate-700/80 text-slate-200';
};

export const getDifficultyColor = (difficulty) => {
  const colors = {
    'Beginner': 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    'Intermediate': 'border-sky-500/30 bg-sky-500/10 text-sky-200',
    'Advanced': 'border-rose-500/30 bg-rose-500/10 text-rose-200',
  };
  return colors[difficulty] || 'border-slate-600 bg-slate-700/80 text-slate-200';
};
