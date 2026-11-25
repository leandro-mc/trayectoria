import type { EducationResponse, LanguageResponse, WorkExperienceResponse } from '@/types/api.types'

/**
 * Fictional accounts. Ported from seed/seed.mjs (the backend's demo seed) so the demo and a
 * seeded backend tell the same story; all emails use the reserved demo.trayectoria.dev domain.
 */

export const DEMO_PASSWORD = 'Demo1234!'

export type CompanyKey   = 'nimbus' | 'verde' | 'cordillera'
export type CandidateKey = 'sofia' | 'mateo' | 'camila'

export interface CompanyFixture {
  key: CompanyKey
  email: string
  companyName: string
  industry: string
  about: string
  website: string
  location: string
}

export interface CandidateFixture {
  key: CandidateKey
  email: string
  firstName: string
  lastName: string
  phone: string
  location: string
  birthdate: string
  bio: string
  linkedinUrl: string
  githubUrl: string
  portfolioUrl: string | null
  /** Catalogue names. */
  skills: string[]
  languages: LanguageResponse[]
  experience: Array<Omit<WorkExperienceResponse, 'id'>>
  education: Array<Omit<EducationResponse, 'id'>>
}

/** The two accounts the login page offers as one-click shortcuts. */
export const SHORTCUT_EMAILS = { candidate: 'sofia@demo.trayectoria.dev', company: 'nimbus@demo.trayectoria.dev' } as const

// Companies are registered first in the real seed, so they take user ids 1-3 and candidates 4-6.
export const COMPANIES: readonly CompanyFixture[] = [
  {
    key: 'nimbus', email: 'nimbus@demo.trayectoria.dev', companyName: 'Nimbus Labs',
    industry: 'Software y servicios cloud',
    about: 'Construimos plataformas cloud para equipos de producto. Equipo distribuido, cultura de ingeniería abierta y foco en calidad.',
    website: 'https://nimbus-labs.example.com', location: 'Ciudad de México, México',
  },
  {
    key: 'verde', email: 'verde@demo.trayectoria.dev', companyName: 'Verde Analytics',
    industry: 'Datos e inteligencia artificial',
    about: 'Ayudamos a empresas a tomar decisiones con datos y a incorporar IA generativa en sus procesos.',
    website: 'https://verde-analytics.example.com', location: 'Bogotá, Colombia',
  },
  {
    key: 'cordillera', email: 'cordillera@demo.trayectoria.dev', companyName: 'Cordillera Fintech',
    industry: 'Tecnología financiera',
    about: 'Plataforma de pagos y servicios financieros digitales para pymes de Latinoamérica.',
    website: 'https://cordillera-fintech.example.com', location: 'Santiago, Chile',
  },
]

const exp = (
  company: string, position: string, startDate: string, endDate: string | null, description: string,
): Omit<WorkExperienceResponse, 'id'> => ({ company, position, description, startDate, endDate, isCurrent: endDate === null })

export const CANDIDATES: readonly CandidateFixture[] = [
  {
    key: 'sofia', email: 'sofia@demo.trayectoria.dev', firstName: 'Sofía', lastName: 'Ramírez',
    phone: '+52 55 5555 0101', location: 'Ciudad de México, México', birthdate: '1996-04-12',
    bio: 'Desarrolladora full stack con 4 años de experiencia construyendo productos web con React, Next.js y Node.js. Me gusta trabajar cerca de diseño y cuidar la experiencia de usuario.',
    linkedinUrl: 'https://linkedin.com/in/demo-sofia-ramirez', githubUrl: 'https://github.com/demo-sofia',
    portfolioUrl: 'https://sofia-ramirez.example.com',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Git', 'Docker', 'PostgreSQL', 'Scrum', 'Trabajo en equipo', 'Comunicación efectiva'],
    languages: [{ language: 'Español', level: 'Native' }, { language: 'Inglés', level: 'B2' }],
    experience: [
      exp('Pixelforge Studio', 'Desarrolladora Full Stack', '2022-03-01', null,
        'Desarrollo de aplicaciones web con React, Next.js y Node.js. Migración de un monolito a servicios y mejora del rendimiento del frontend en un 35%.'),
      exp('Tienda Aurora', 'Desarrolladora Frontend Jr.', '2020-02-01', '2022-02-28',
        'Implementación de interfaces responsivas y de la pasarela de pagos del e-commerce.'),
    ],
    education: [
      { institution: 'Universidad Tecnológica del Pacífico', degree: 'Ingeniería en Sistemas', fieldOfStudy: 'Ingeniería de Software', startDate: '2014-02-01', endDate: '2019-12-15' },
      { institution: 'Academia Código Norte', degree: 'Especialización en Cloud y DevOps', fieldOfStudy: 'Cloud', startDate: '2021-03-01', endDate: '2021-09-30' },
    ],
  },
  {
    key: 'mateo', email: 'mateo@demo.trayectoria.dev', firstName: 'Mateo', lastName: 'Vargas',
    phone: '+57 300 555 0102', location: 'Medellín, Colombia', birthdate: '2000-09-03',
    bio: 'Desarrollador backend junior apasionado por las APIs bien diseñadas y las pruebas automatizadas. Busco un equipo donde seguir creciendo con Java y Spring Boot.',
    linkedinUrl: 'https://linkedin.com/in/demo-mateo-vargas', githubUrl: 'https://github.com/demo-mateo',
    portfolioUrl: null,
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Git', 'JUnit', 'REST APIs', 'Resolución de problemas'],
    languages: [{ language: 'Español', level: 'Native' }, { language: 'Inglés', level: 'B1' }],
    experience: [
      { ...exp('Soluciones Andinas', 'Pasante de Desarrollo Backend', '2023-06-01', '2024-03-31',
        'Desarrollo de endpoints REST con Spring Boot, pruebas unitarias con JUnit y soporte a producción.'), isCurrent: false },
    ],
    education: [
      { institution: 'Universidad del Valle Central', degree: 'Ingeniería de Sistemas', fieldOfStudy: 'Ingeniería de Sistemas', startDate: '2018-02-01', endDate: '2023-11-30' },
    ],
  },
  {
    key: 'camila', email: 'camila@demo.trayectoria.dev', firstName: 'Camila', lastName: 'Solís',
    phone: '+56 9 5555 0103', location: 'Santiago, Chile', birthdate: '1994-11-21',
    bio: 'Ingeniera de calidad y datos con foco en automatización. Me interesa que los equipos entreguen con confianza y que los datos cuenten una historia clara.',
    linkedinUrl: 'https://linkedin.com/in/demo-camila-solis', githubUrl: 'https://github.com/demo-camila',
    portfolioUrl: null,
    skills: ['Python', 'SQL', 'Selenium', 'Postman', 'Jest', 'Scrum', 'Trabajo en equipo'],
    languages: [{ language: 'Español', level: 'Native' }, { language: 'Inglés', level: 'C1' }],
    experience: [
      exp('Datavía', 'QA Automation Engineer', '2021-05-01', null,
        'Automatización de pruebas E2E y de API; reducción del tiempo de regresión de 2 días a 3 horas.'),
    ],
    education: [
      { institution: 'Universidad Austral del Sur', degree: 'Ingeniería Civil Informática', fieldOfStudy: 'Informática', startDate: '2012-03-01', endDate: '2018-07-15' },
    ],
  },
]
