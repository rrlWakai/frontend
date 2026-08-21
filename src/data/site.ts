export const site = {
  name: 'Rhen-Rhen Lumbo',
  initials: 'RL',
  role: 'SOFTWARE ENGINEER & WEBSITE BUSINESS DEVELOPER',
  location: 'San Pablo City, Laguna, Philippines',
  email: 'lumborhenrhen@gmail.com',
  github: 'https://github.com/rrlWakai',
  summary:
    'Software engineer and website business developer focused on building modern websites and practical digital solutions for businesses. I work across UI/UX, frontend development, and full-stack implementation to create digital experiences that are clear, responsive, and built around real business needs.',
} as const

export type SkillCategory = {
  category: string
  items: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    category: 'Frontend',
    items: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express.js'],
  },
  {
    category: 'Database',
    items: ['Supabase', 'MongoDB', 'MySQL', 'PostgreSQL'],
  },
  {
    category: 'Mobile',
    items: ['Flutter', 'Dart'],
  },
  {
    category: 'Design',
    items: ['UI/UX', 'Responsive Design', 'Product Design'],
  },
]

export const focusAreas = [
  'Software Engineering',
  'Website Development',
  'Reservation Systems',
  'UI/UX',
  'Full-Stack Development',
]

export const toolsStack = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Express',
  'Supabase',
  'MongoDB',
  'MySQL',
  'PostgreSQL',
  'Tailwind CSS',
  'Flutter',
  'Dart',
  'Git',
  'Vite',
  'Figma',
  'Postman',
  'Vercel',
]

export type Project = {
  id: string
  name: string
  category: string
  type?: string
  description: string
  url: string
  featured: boolean
  date?: string
  technologies?: string[]
  features?: string[]
}

export const projects: Project[] = [
  {
    id: 'krib',
    name: 'KRiB',
    category: 'RESERVATION SYSTEM',
    type: 'Hospitality / Villa Reservation System',
    description:
      'Built a hospitality reservation system that allows guests to submit bookings online while automatically notifying the property owner through Semaphore SMS when a new reservation is received.',
    url: 'https://krib-tau.vercel.app/',
    featured: true,
    date: 'July 6, 2026',
    technologies: ['React', 'TypeScript', 'Supabase', 'Semaphore SMS'],
    features: [
      '21-Hour Booking Model',
      'Villa Availability',
      'Guest Capacity',
      'Reservation Workflow',
    ],
  },
  {
    id: 'premier-rentals',
    name: 'Premier Rentals',
    category: 'RESERVATION SYSTEM',
    type: 'Property Rental Reservation System',
    description:
      'Built a reservation system for two rental properties, integrating property selection, booking details, and PayMongo payments for the required 50% down payment.',
    url: 'https://premier-rentalss-7x33.vercel.app/',
    featured: false,
    date: 'March 10, 2026',
    technologies: ['React', 'TypeScript', 'PayMongo'],
  },
  {
    id: 'owlie',
    name: 'Owlie',
    category: 'Education / Study Application',
    description:
      'An education mobile application helping students track learning progress and build consistent study habits through structured progress monitoring.',
    url: 'https://github.com/rrlWakai',
    featured: false,
  },
  {
    id: 'timeless-resort',
    name: 'Timeless Resort',
    category: 'Hospitality Website',
    description:
      'A resort website built around fast search and clear availability, designed to present accommodations and booking options in a clean, accessible format.',
    url: 'https://github.com/rrlWakai',
    featured: false,
  },
  {
    id: 'saling-cafe',
    name: 'Saling Café',
    category: 'Business / Café Website',
    description:
      'A digital ordering and menu experience for a boutique café, focusing on clear menu presentation and an intuitive ordering flow.',
    url: 'https://github.com/rrlWakai',
    featured: false,
  },
]

export type Photo = {
  name: string
  year: string
  src: string
}

export const photos: Photo[] = [
  { name: 'KRiB Launch', year: '2026', src: 'https://picsum.photos/seed/krib/360/480' },
  { name: 'Premier Rentals', year: '2026', src: 'https://picsum.photos/seed/premier/360/480' },
  { name: 'Owlie App', year: '2025', src: 'https://picsum.photos/seed/owlie/360/480' },
  { name: 'Timeless Resort', year: '2025', src: 'https://picsum.photos/seed/resort/360/480' },
  { name: 'Saling Café', year: '2025', src: 'https://picsum.photos/seed/cafe/360/480' },
  { name: 'Campus Project', year: '2024', src: 'https://picsum.photos/seed/campus/360/480' },
  { name: 'UI Study', year: '2024', src: 'https://picsum.photos/seed/uistudy/360/480' },
  { name: 'Hackathon', year: '2024', src: 'https://picsum.photos/seed/hackathon/360/480' },
]

export type Education = {
  degree: string
  major: string
  institution: string
  location: string
  status: string
}

export const education: Education = {
  degree: 'Bachelor of Science in Information Technology',
  major: 'Web and Mobile Application Development (WMAD)',
  institution: 'Laguna State Polytechnic University',
  location: 'San Pablo City, Laguna, Philippines',
  status: '3rd Year — Currently Enrolled',
}
