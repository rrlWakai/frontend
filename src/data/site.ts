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
   Entries below are placeholders showing the intended shape.
   To finalize:
   - replace title / issuer / issuedDate / year / category with real credentials
   - optionally add credentialId + credentialUrl (verification link)
   - optionally add image (drop the file in /public, e.g. "/certs/rwd.png")
   The section renders gracefully with or without images.
   ═══════════════════════════════════════ */

export type Certification = {
  id: string
  number: string
  title: string
  issuer: string
  issuedDate: string
  year: string
  category: string
  credentialId?: string
  credentialUrl?: string
  image?: string
}

export const certifications: Certification[] = [
  {
    id: 'cert-01',
    number: '01',
    title: 'Responsive Web Design',
    issuer: 'freeCodeCamp',
    issuedDate: 'May 20, 2026',
    year: '2026',
    category: 'WEB DEVELOPMENT',
  },
  {
    id: 'cert-02',
    number: '02',
    title: 'Back End Development and APIs',
    issuer: 'freeCodeCamp',
    issuedDate: 'January 15, 2026',
    year: '2026',
    category: 'WEB DEVELOPMENT',
  },
  {
    id: 'cert-03',
    number: '03',
    title: 'Foundations of UX Design',
    issuer: 'Google',
    issuedDate: 'September 3, 2025',
    year: '2025',
    category: 'UI/UX',
  },
  {
    id: 'cert-04',
    number: '04',
    title: 'SQL (Intermediate)',
    issuer: 'HackerRank',
    issuedDate: 'November 21, 2024',
    year: '2024',
    category: 'DATABASE',
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
