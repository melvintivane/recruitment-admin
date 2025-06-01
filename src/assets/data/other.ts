import type { Employee, PricingType, ProjectType, TimelineType, TransactionType, VacancyType } from '@/types/data'

import type { Author, BlogCategory, BlogPost, BlogComment, BlogTag, FeaturedPost } from '@/types/data'


import post1 from '@/assets/images/users/avatar-1.jpg'

import avatar1 from '@/assets/images/users/avatar-1.jpg'
import avatar2 from '@/assets/images/users/avatar-2.jpg'
import avatar3 from '@/assets/images/users/avatar-3.jpg'
import avatar4 from '@/assets/images/users/avatar-4.jpg'
import avatar5 from '@/assets/images/users/avatar-5.jpg'
import avatar6 from '@/assets/images/users/avatar-6.jpg'
import avatar7 from '@/assets/images/users/avatar-7.jpg'

export const vacanciesData: VacancyType[] = [
  {
    id: "VAC-1001",
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    postedDate: "2023-06-15",
    status: "Open",
    applicationCount: 24,
    salaryRange: "$85,000 - $110,000",
    description: "We're looking for an experienced React developer to join our team."
  },
  {
    id: "VAC-1002",
    title: "UX Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    postedDate: "2023-06-20",
    status: "Open",
    applicationCount: 18,
    salaryRange: "$75,000 - $95,000",
    description: "Join our design team to create beautiful user experiences."
  },
  {
    id: "VAC-1003",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    postedDate: "2023-06-10",
    status: "Open",
    applicationCount: 12,
    salaryRange: "$120,000 - $150,000",
    description: "Help us build and maintain our cloud infrastructure."
  },
  {
    id: "VAC-1004",
    title: "Marketing Intern",
    department: "Marketing",
    location: "Chicago, IL",
    type: "Part-time",
    postedDate: "2023-06-25",
    status: "Open",
    applicationCount: 32,
    salaryRange: "$20 - $25/hr",
    description: "Great opportunity for marketing students to gain real-world experience."
  },
  {
    id: "VAC-1005",
    title: "Senior Backend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    postedDate: "2023-05-30",
    status: "Closed",
    applicationCount: 45,
    salaryRange: "$130,000 - $160,000",
    description: "Lead our backend development with Node.js and microservices."
  },
  {
    id: "VAC-1006",
    title: "Customer Support Specialist",
    department: "Support",
    location: "Austin, TX",
    type: "Full-time",
    postedDate: "2023-06-18",
    status: "Open",
    applicationCount: 15,
    salaryRange: "$45,000 - $55,000",
    description: "Provide exceptional support to our growing customer base."
  },
  {
    id: "VAC-1007",
    title: "Product Manager",
    department: "Product",
    location: "Boston, MA",
    type: "Full-time",
    postedDate: "2023-06-05",
    status: "Draft",
    applicationCount: 0,
    salaryRange: "$90,000 - $120,000",
    description: "Lead product development from conception to launch."
  },
  {
    id: "VAC-1008",
    title: "Data Scientist",
    department: "Data",
    location: "Remote",
    type: "Contract",
    postedDate: "2023-06-22",
    status: "Open",
    applicationCount: 8,
    salaryRange: "$60 - $80/hr",
    description: "Help us extract insights from our growing datasets."
  },
  {
    id: "VAC-1009",
    title: "HR Coordinator",
    department: "Human Resources",
    location: "Seattle, WA",
    type: "Full-time",
    postedDate: "2023-06-12",
    status: "Open",
    applicationCount: 21,
    salaryRange: "$50,000 - $65,000",
    description: "Support our HR operations and employee experience programs."
  },
  {
    id: "VAC-1010",
    title: "Quality Assurance Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    postedDate: "2023-06-28",
    status: "Open",
    applicationCount: 5,
    salaryRange: "$70,000 - $90,000",
    description: "Ensure the quality of our software through rigorous testing."
  }
];

export const timelineData: TimelineType = {
  Today: [
    {
      title: 'Completed UX design project for our client',
      description: 'Dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde?',
      important: true,
    },
    {
      title: 'Yes! We are celebrating our first admin release.',
      description: 'Consectetur adipisicing elit. Iusto, optio, dolorum John deon provident.',
    },
    {
      title: 'We released new version of our theme EP.',
      description: '3 new photo Uploaded on facebook fan page',
    },
  ],
  Yesterday: [
    {
      title: 'We have archieved 25k sales in our themes',
      description: 'Dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde?',
    },
    {
      title: 'Yes! We are celebrating our first admin release.',
      description: 'Outdoor visit at California State Route 85 with John Boltana & Harry Piterson.',
    },
  ],
}

export const pricingData: PricingType[] = [
  {
    id: '1',
    name: 'Free Pack',
    price: 0,
    features: ['5 GB Storage', '100 GB Bandwidth', '1 Domain', 'No Support', '24x7 Support', '1 User'],
  },
  {
    id: '2',
    name: 'Professional Pack',
    price: 19,
    features: ['50 GB Storage', '900 GB Bandwidth', '1 Domain', 'Email Support', '24x7 Support', '5 User'],
    isPopular: true,
    subscribed: true,
  },
  {
    id: '3',
    name: 'Business Pack',
    price: 29,
    features: ['500 GB Storage', '2.5 TB Bandwidth', '5 Domain', 'Email Support', '24x7 Support', '10 User'],
  },
  {
    id: '4',
    name: 'EnterPrice Pack',
    price: 29,
    features: ['2 TB Storage', 'Unlimited Bandwidth', '50 Domain', 'Email Support', '24x7 Support', 'Unlimited User'],
  },
]

export const projectsData: ProjectType[] = [
  {
    id: '1',
    projectName: 'Zelogy',
    client: 'Daniel Olsen',
    teamMembers: [avatar2, avatar3, avatar4],
    deadlineDate: new Date('12/4/2024'),
    progressValue: 33,
    variant: 'primary',
  },
  {
    id: '2',
    projectName: 'Shiaz',
    client: 'Jack Roldan',
    teamMembers: [avatar1, avatar5],
    deadlineDate: new Date('10/4/2024'),
    progressValue: 74,
    variant: 'success',
  },
  {
    id: '3',
    projectName: 'Holderick',
    client: 'Betty Cox',
    teamMembers: [avatar5, avatar2, avatar3],
    deadlineDate: new Date('31/3/2024'),
    progressValue: 50,
    variant: 'warning',
  },
  {
    id: '4',
    projectName: 'Feyvux',
    client: 'Carlos Johnson',
    teamMembers: [avatar3, avatar7, avatar6],
    deadlineDate: new Date('25/3/2024'),
    progressValue: 92,
    variant: 'primary',
  },
  {
    id: '5',
    projectName: 'Xavlox',
    client: 'Lorraine Cox',
    teamMembers: [avatar7],
    deadlineDate: new Date('22/3/2024'),
    progressValue: 48,
    variant: 'danger',
  },
  {
    id: '6',
    projectName: 'Mozacav',
    client: 'Delores Young',
    teamMembers: [avatar3, avatar4, avatar2],
    deadlineDate: new Date('15/3/2024'),
    progressValue: 21,
    variant: 'primary',
  },
]

export const transactionsData: TransactionType[] = [
  {
    id: '10101',
    customerId: '2001',
    date: new Date('04/24/2024'),
    amount: 120.55,
    description: 'Commissions',
    status: 'Cr.',
  },
  {
    id: '10102',
    customerId: '2002',
    date: new Date('12/6/2018'),
    amount: 9.68,
    description: 'Affiliates',
    status: 'Cr.',
  },
  {
    id: '10103',
    customerId: '2003',
    date: new Date('04/20/2024'),
    amount: 105.22,
    description: 'Grocery',
    status: 'Dr.',
  },
  {
    id: '10104',
    customerId: '2004',
    date: new Date('04/18/2024'),
    amount: 80.59,
    description: 'Refunds',
    status: 'Cr.',
  },
  {
    id: '10105',
    customerId: '2005',
    date: new Date('04/18/2024'),
    amount: 750.95,
    description: 'Bill Payments',
    status: 'Dr.',
  },
  {
    id: '10106',
    customerId: '2006',
    date: new Date('04/17/2024'),
    amount: 455.62,
    description: 'Electricity',
    status: 'Dr.',
  },
  {
    id: '10107',
    customerId: '2007',
    date: new Date('04/17/2024'),
    amount: 102.77,
    description: 'Interest',
    status: 'Cr.',
  },
  {
    id: '10108',
    customerId: '2008',
    date: new Date('04/16/2024'),
    amount: 79.49,
    description: 'Refunds',
    status: 'Cr.',
  },
  {
    id: '10109',
    customerId: '2009',
    date: new Date('04/05/2024'),
    amount: 980.0,
    description: 'Shopping',
    status: 'Dr.',
  },
]

export const dataTableRecords: Employee[] = [
  {
    id: '11',
    name: 'Jonathan',
    email: 'jonathan@example.com',
    position: 'Senior Implementation Architect',
    company: 'Hauck Inc',
    country: 'Holy See',
  },
  {
    id: '12',
    name: 'Harold',
    email: 'harold@example.com',
    position: 'Forward Creative Coordinator',
    company: 'Metz Inc',
    country: 'Iran',
  },
  {
    id: '13',
    name: 'Shannon',
    email: 'shannon@example.com',
    position: 'Legacy Functionality Associate',
    company: 'Zemlak Group',
    country: 'South Georgia',
  },
  {
    id: '14',
    name: 'Robert',
    email: 'robert@example.com',
    position: 'Product Accounts Technician',
    company: 'Hoeger',
    country: 'San Marino',
  },
  {
    id: '15',
    name: 'Noel',
    email: 'noel@example.com',
    position: 'Customer Data Director',
    company: 'Howell - Rippin',
    country: 'Germany',
  },
  {
    id: '16',
    name: 'Traci',
    email: 'traci@example.com',
    position: 'Corporate Identity Director',
    company: 'Koelpin - Goldner',
    country: 'Vanuatu',
  },
  {
    id: '17',
    name: 'Kerry',
    email: 'kerry@example.com',
    position: 'Lead Applications Associate',
    company: 'Feeney, Langworth and Tremblay',
    country: 'Niger',
  },
  {
    id: '18',
    name: 'Patsy',
    email: 'patsy@example.com',
    position: 'Dynamic Assurance Director',
    company: 'Streich Group',
    country: 'Niue',
  },
  {
    id: '19',
    name: 'Cathy',
    email: 'cathy@example.com',
    position: 'Customer Data Director',
    company: 'Ebert, Schamberger and Johnston',
    country: 'Mexico',
  },
  {
    id: '20',
    name: 'Tyrone',
    email: 'tyrone@example.com',
    position: 'Senior Response Liaison',
    company: 'Raynor, Rolfson and Daugherty',
    country: 'Qatar',
  },
]



export const blogPostsData: BlogPost[] = [
  {
    id: '1',
    title: 'Introdução ao Desenvolvimento Web Moderno',
    excerpt: 'Aprenda os fundamentos do desenvolvimento web com as últimas tecnologias...',
    author: 'Carlos Silva',
    avatar: "https://via.placeholder.com/150",
    publishDate: new Date('2024-05-25'),
    category: 'Tecnologia',
    status: 'Publicado',
    tags: ['Web Development', 'Frontend'],
    featuredImage: post1,
    views: 2543,
    commentsCount: 12,
    content: '...',
    isFeatured: true,
    createdAt: new Date('2024-05-25'),
    updatedAt: new Date('2024-05-26')
  },
  {
    id: '2',
    title: 'Melhores Práticas de UI/UX Design',
    excerpt: 'Descubra as técnicas essenciais para criar interfaces incríveis...',
    author: 'Ana Pereira',
    avatar: "https://via.placeholder.com/150",
    publishDate: new Date('2024-05-20'),
    category: 'Design',
    status: 'Publicado',
    tags: ['UI/UX', 'Design'],
    featuredImage: post1,
    views: 1845,
    commentsCount: 8,
    content: '...',
    createdAt: new Date('2024-05-25'),
    updatedAt: new Date('2024-05-26')
  },
  {
    id: '3',
    title: 'Guia Completo de SEO para 2024',
    excerpt: 'Atualizações e estratégias essenciais para otimização de sites...',
    author: 'Pedro Almeida',
    avatar: "https://via.placeholder.com/150",
    publishDate: new Date('2024-05-18'),
    category: 'Marketing',
    status: 'Rascunho',
    tags: ['SEO', 'Marketing Digital'],
    featuredImage: post1,
    views: 932,
    commentsCount: 5,
    content: '...',
    createdAt: new Date('2024-05-25'),
    updatedAt: new Date('2024-05-26')
  }
]

export const blogCategoriesData: BlogCategory[] = [
  { id: '1', name: 'Tecnologia', postCount: 15, lastUpdate: new Date('2024-05-25') },
  { id: '2', name: 'Design', postCount: 8, lastUpdate: new Date('2024-05-20') },
  { id: '3', name: 'Marketing', postCount: 12, lastUpdate: new Date('2024-05-18') }
]

export const blogAuthorsData: Author[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    avatar: avatar1,
    bio: 'Desenvolvedor Full-Stack com 10+ anos de experiência',
    postCount: 23,
    social: {
      twitter: '@carlossilva',
      linkedin: 'linkedin.com/in/carlossilva'
    }
  },
  {
    id: '2',
    name: 'Ana Pereira',
    avatar: avatar2,
    bio: 'Especialista em UI/UX e Design Thinking',
    postCount: 15,
    social: {
      behance: 'behance.net/anapereira'
    }
  }
]

export const blogCommentsData: BlogComment[] = [
  {
    id: '1',
    postId: '1',
    author: 'João Mendes',
    content: 'Excelente artigo! Muito útil para iniciantes.',
    date: new Date('2024-05-25'),
    approved: true
  },
  {
    id: '2',
    postId: '1',
    author: 'Maria Souza',
    content: 'Poderia fazer um tutorial mais detalhado?',
    date: new Date('2024-05-24'),
    approved: false
  }
]

export const blogTagsData: BlogTag[] = [
  { id: '1', name: 'Web Development', postCount: 8 },
  { id: '2', name: 'UI/UX', postCount: 5 },
  { id: '3', name: 'SEO', postCount: 12 }
]

export const featuredPostsData: FeaturedPost[] = [
  {
    id: '1',
    title: 'O Futuro da Inteligência Artificial',
    excerpt: 'Como a IA está transformando a indústria tecnológica...',
    featureDate: new Date('2024-05-25'),
    category: 'Tecnologia',
    views: 3541,
    featuredImage: post1
  }
];

