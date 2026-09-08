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
    id: 'yuhrum-villas',
    name: 'Yuhrum Villas',
    category: 'HOSPITALITY / VILLA WEBSITE',
    description:
      'Designed and developed a responsive hospitality website for Yuhrum Villas, combining structured property presentation, responsive layouts, and subtle interactions to create a refined and engaging guest experience.',
    url: 'https://yuh-rum.vercel.app/',
    featured: false,
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    id: 'timeless-resort',
    name: 'Timeless Resort',
    category: 'Hospitality Website',
    description:
      'A resort website built around fast search and clear availability, designed to present accommodations and booking options in a clean, accessible format.',
    url: 'https://timelessresort.vercel.app/',
    featured: false,
  },
  {
    id: 'saling-cafe',
    name: 'Saling Café',
    category: 'Business / Café Website',
    description:
      'A digital ordering and menu experience for a boutique café, focusing on clear menu presentation and an intuitive ordering flow.',
    url: 'https://salingcafe.vercel.app/',
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
  { name: 'Yuhrum Villas', year: '2025', src: 'https://picsum.photos/seed/yuhrum/360/480' },
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

/* ═══════════════════════════════════════
   CERTIFICATIONS — credential archive
   One entry per certificate scan in /public; titles are derived from
   the image filenames. `description` carries the recruiter-facing
   one-liner for each credential. issuer / issuedDate / year / category
   are left blank, and credentialId / credentialUrl omitted, wherever a
   "// TODO: confirm" marker appears — fill in real values as each
   credential is verified. The section renders gracefully with or
   without images.
   ═══════════════════════════════════════ */

export type Certification = {
  id: string
  number: string
  title: string
  issuer: string
  issuedDate: string
  year: string
  category: string
  /** Recruiter-facing one-liner — what the credential demonstrates */
  description: string
  credentialId?: string
  credentialUrl?: string
  image?: string
}

export const certifications: Certification[] = [
  {
    id: 'cert-01',
    number: '01',
    title: 'Computer Hardware Basics',
    issuer: '', // TODO: confirm
    issuedDate: '', // TODO: confirm
    year: '', // TODO: confirm
    category: '', // TODO: confirm
    description:
      'Core hardware knowledge for diagnosing and assembling systems — the foundation for reliable technical support.',
    // TODO: confirm — add credentialId / credentialUrl
    image: '/Computer Hardware Basics.png',
  },
  {
    id: 'cert-02',
    number: '02',
    title: 'Computer Systems Servicing (NC II)',
    issuer: '', // TODO: confirm
    issuedDate: '', // TODO: confirm
    year: '', // TODO: confirm
    category: '', // TODO: confirm
    description:
      'Government-certified competency in installing, configuring, and maintaining computer systems and networks, validated to a national skills standard.',
    // TODO: confirm — add credentialId / credentialUrl
    image: '/Computer Systems Servicing.png',
  },
  {
    id: 'cert-03',
    number: '03',
    title: 'Data Analytics Essentials',
    issuer: '', // TODO: confirm
    issuedDate: '', // TODO: confirm
    year: '', // TODO: confirm
    category: '', // TODO: confirm
    description:
      'Data collection, analysis, and visualization fundamentals — supports building data-informed features like booking trends or occupancy reports.',
    // TODO: confirm — add credentialId / credentialUrl
    image: '/Data Analytics Essentials.png',
  },
  {
    id: 'cert-04',
    number: '04',
    title: 'Batang Techno: Hackathon Seminar and Orientation',
    issuer: '', // TODO: confirm
    issuedDate: '', // TODO: confirm
    year: '', // TODO: confirm
    category: '', // TODO: confirm
    description:
      'Hands-on exposure to collaborative, time-boxed problem-solving in a university hackathon setting.',
    // TODO: confirm — add credentialId / credentialUrl
    image: '/Hackton.png',
  },
  {
    id: 'cert-05',
    number: '05',
    title: 'HTML Essentials',
    issuer: '', // TODO: confirm
    issuedDate: '', // TODO: confirm
    year: '', // TODO: confirm
    category: '', // TODO: confirm
    description:
      'Core web markup fundamentals underpinning all frontend work, from this portfolio to client booking platforms.',
    // TODO: confirm — add credentialId / credentialUrl
    image: '/Html essentials.png',
  },
  {
    id: 'cert-06',
    number: '06',
    title: 'Introduction to Data Science',
    issuer: '', // TODO: confirm
    issuedDate: '', // TODO: confirm
    year: '', // TODO: confirm
    category: '', // TODO: confirm
    description:
      'Foundational data science workflow — groundwork for analytics-driven features in future projects.',
    // TODO: confirm — add credentialId / credentialUrl
    image: '/Introduction to Data Science.png',
  },
  {
    id: 'cert-07',
    number: '07',
    title: 'Network Addressing and Basic Troubleshooting',
    issuer: '', // TODO: confirm
    issuedDate: '', // TODO: confirm
    year: '', // TODO: confirm
    category: '', // TODO: confirm
    description:
      'IP addressing and troubleshooting methodology, directly useful for diagnosing connectivity issues in deployed apps.',
    // TODO: confirm — add credentialId / credentialUrl
    image: '/Network Addressing and Basic Troubleshooting.png',
  },
  {
    id: 'cert-08',
    number: '08',
    title: 'Networking Basics',
    issuer: '', // TODO: confirm
    issuedDate: '', // TODO: confirm
    year: '', // TODO: confirm
    category: '', // TODO: confirm
    description:
      'Core networking concepts — topologies, protocols, devices — essential for building and maintaining connected, real-time systems.',
    // TODO: confirm — add credentialId / credentialUrl
    image: '/Networking Basics.png',
  },
  {
    id: 'cert-09',
    number: '09',
    title: 'Networking Devices and Initial Configuration',
    issuer: '', // TODO: confirm
    issuedDate: '', // TODO: confirm
    year: '', // TODO: confirm
    category: '', // TODO: confirm
    description:
      'Practical router/switch configuration, demonstrating the ability to set up and secure network infrastructure.',
    // TODO: confirm — add credentialId / credentialUrl
    image: '/Networking Devices and Initial Configuration.png',
  },
  {
    id: 'cert-10',
    number: '10',
    title: 'Operating Systems Basics',
    issuer: '', // TODO: confirm
    issuedDate: '', // TODO: confirm
    year: '', // TODO: confirm
    category: '', // TODO: confirm
    description:
      'OS installation, configuration, and management skills, relevant to deploying and supporting apps across environments.',
    // TODO: confirm — add credentialId / credentialUrl
    image: '/Operating Systems Basics.png',
  },
  {
    id: 'cert-11',
    number: '11',
    title: 'Using Computer and Mobile Devices',
    issuer: '', // TODO: confirm
    issuedDate: '', // TODO: confirm
    year: '', // TODO: confirm
    category: '', // TODO: confirm
    description:
      'Digital literacy fundamentals across computers and mobile platforms — the baseline expected of any technical hire.',
    // TODO: confirm — add credentialId / credentialUrl
    image: '/Using Computer and Mobile Devices.png',
  },
  {
    id: 'web-development-fundamentals',
    number: '12', // slotted last to match the array's image-filename order — revisit once issuedDate is confirmed
    title: 'Web Development Fundamentals',
    issuer: 'IBM SkillsBuild',
    issuedDate: '', // TODO: confirm exact completion date
    year: '', // TODO: confirm issued year — only have the badge graphic, not the dated certificate
    category: 'Web Development',
    description:
      'Foundational web development concepts covering structure, styling, and client-side interactivity as part of IBM\'s SkillsBuild program.',
    credentialId: '', // TODO: fill in if shown on the actual certificate/credential page
    image: '/Web Development Fundamentals.png',
  },
]

/* ═══════════════════════════════════════
   GITHUB ACTIVITY — data layer
   Live data comes from the backend service
   (GET {VITE_API_URL}/api/github-contributions),
   which computes counts, levels and streaks.
   ═══════════════════════════════════════ */

export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export type ContributionDay = {
  /** ISO date, yyyy-mm-dd */
  date: string
  /** Real contribution count */
  count: number
  /** Discrete intensity step driving dot size + color */
  level: ContributionLevel
}

export type ContributionWeek = {
  /** Always 7 entries, Sunday → Saturday */
  days: ContributionDay[]
}

/** number once live data has loaded, "—" while placeholders are shown */
export type GitHubStats = {
  totalContributions: number | string
  currentStreak: number | string
  longestStreak: number | string
}

/** Shown before the backend responds and on error */
export const githubStatsPlaceholder: GitHubStats = {
  totalContributions: '—',
  currentStreak: '—',
  longestStreak: '—',
}

/** Payload shape returned by the backend */
export type GitHubActivityResponse = GitHubStats & {
  days: ContributionDay[]
}

/** Chunks the backend's flat day list into Sun–Sat weeks for the grid */
export function groupDaysIntoWeeks(days: ContributionDay[]): ContributionWeek[] {
  const weeks: ContributionWeek[] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push({ days: days.slice(i, i + 7) })
  }
  return weeks
}

/**
 * Builds a full 53-week (Sun–Sat) calendar ending with the current week,
 * with every day at level 0 — used as the loading skeleton so the grid
 * layout (and month/day labels) hold their place while the backend wakes up.
 */
export function generateSkeletonActivity(totalWeeks = 53): ContributionWeek[] {
  const today = new Date()
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  end.setDate(end.getDate() + (6 - end.getDay())) // Saturday of current week

  const totalDays = totalWeeks * 7
  const start = new Date(end)
  start.setDate(start.getDate() - (totalDays - 1)) // lands on a Sunday

  const weeks: ContributionWeek[] = []
  let days: ContributionDay[] = []

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate(),
    ).padStart(2, '0')}`
    days.push({ date: iso, count: 0, level: 0 })
    if (days.length === 7) {
      weeks.push({ days })
      days = []
    }
  }

  return weeks
}
