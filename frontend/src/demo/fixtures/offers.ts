import type { JobStatus, JobType, WorkMode } from '@/types/global.types'
import type { CompanyKey } from './accounts'

export type OfferKey =
  | 'backend-kotlin' | 'frontend-react' | 'devops-intern' | 'data-eng' | 'ai-dev'
  | 'qa-auto' | 'java-senior' | 'ux-ui' | 'node-closed' | 'mobile-draft'

export interface OfferFixture {
  key: OfferKey
  company: CompanyKey
  title: string
  workMode: WorkMode
  jobType: JobType
  location: string
  description: string
  /** One item per line, as the backend stores them. */
  responsibilities: string
  requirements: string
  benefits: string
  /** Catalogue names. */
  skills: string[]
  requiresInterview: boolean
  interviewInstructions?: string
  /** Spreads the list over a few weeks so "hace X días" looks organic. */
  postedDaysAgo: number
  expiresInDays: number
  /** The real seed moves two offers out of ACTIVE after creating them. */
  status: JobStatus
}

// Ported from seed/seed.mjs. Array order = creation order = ids 1..10.
export const OFFERS: readonly OfferFixture[] = [
  {
    key: 'backend-kotlin', company: 'nimbus', title: 'Desarrollador/a Backend Kotlin',
    workMode: 'REMOTE', jobType: 'FULL_TIME', location: 'Remoto (LATAM)',
    description: 'Súmate al equipo que desarrolla el núcleo de nuestra plataforma de despliegues. Trabajarás con servicios Kotlin + Spring Boot en un entorno con integración continua y revisión de código por pares.',
    responsibilities: 'Diseñar y mantener APIs REST\nEscribir pruebas automatizadas\nParticipar en revisiones de código y decisiones de arquitectura',
    requirements: '2+ años con Kotlin o Java\nExperiencia con Spring Boot y PostgreSQL\nConocimientos de Docker',
    benefits: 'Trabajo 100% remoto\nHorario flexible\nPresupuesto anual de formación',
    skills: ['Kotlin', 'Spring Boot', 'PostgreSQL', 'Docker', 'REST APIs'],
    requiresInterview: true,
    interviewInstructions: 'Entrevista técnica amistosa. Pregunta por experiencia con Kotlin/Spring Boot, diseño de APIs REST, manejo de transacciones en PostgreSQL y cómo prueba su código. Valora la claridad al explicar decisiones.',
    postedDaysAgo: 12, expiresInDays: 45, status: 'ACTIVE',
  },
  {
    key: 'frontend-react', company: 'nimbus', title: 'Frontend Developer React / Next.js',
    workMode: 'HYBRID', jobType: 'FULL_TIME', location: 'Ciudad de México, México',
    description: 'Construye la consola web que usan miles de desarrolladores. Cuidamos la accesibilidad, el rendimiento y la experiencia de usuario.',
    responsibilities: 'Desarrollar interfaces con React y Next.js\nColaborar con diseño en un sistema de componentes\nMejorar el rendimiento y la accesibilidad',
    requirements: 'Experiencia sólida con React y TypeScript\nConocimiento de Next.js\nBuen manejo de Git',
    benefits: 'Modalidad híbrida (2 días en oficina)\nSeguro de gastos médicos\nDías libres adicionales',
    skills: ['React', 'Next.js', 'TypeScript', 'Git'],
    requiresInterview: true,
    interviewInstructions: 'Entrevista enfocada en React y Next.js: manejo de estado, renderizado en servidor, accesibilidad y rendimiento. Pide un ejemplo de un componente reutilizable que haya construido.',
    postedDaysAgo: 9, expiresInDays: 30, status: 'ACTIVE',
  },
  {
    key: 'devops-intern', company: 'nimbus', title: 'Pasante de DevOps',
    workMode: 'ON_SITE', jobType: 'INTERNSHIP', location: 'Ciudad de México, México',
    description: 'Programa de pasantía de 6 meses con mentoría. Aprenderás a automatizar despliegues y a operar servicios en la nube.',
    responsibilities: 'Apoyar pipelines de CI/CD\nMonitorear servicios\nDocumentar procedimientos operativos',
    requirements: 'Estudiante de últimos años de Ingeniería\nNociones de Linux y Git\nGanas de aprender',
    benefits: 'Mentoría 1:1\nPosibilidad de contratación\nAyuda de transporte',
    skills: ['Linux', 'Docker', 'GitHub Actions', 'Git'],
    requiresInterview: false, postedDaysAgo: 3, expiresInDays: 20, status: 'ACTIVE',
  },
  {
    key: 'data-eng', company: 'verde', title: 'Ingeniero/a de Datos Python',
    workMode: 'REMOTE', jobType: 'FULL_TIME', location: 'Remoto (LATAM)',
    description: 'Diseña y mantén los pipelines de datos que alimentan los tableros y modelos de nuestros clientes.',
    responsibilities: 'Construir pipelines ETL en Python\nModelar datos en PostgreSQL\nAsegurar la calidad y trazabilidad de los datos',
    requirements: 'Python y SQL avanzados\nExperiencia con PostgreSQL\nConocimientos de Docker',
    benefits: 'Remoto\nBono por desempeño\nCapacitaciones y certificaciones',
    skills: ['Python', 'SQL', 'PostgreSQL', 'Docker'],
    requiresInterview: false, postedDaysAgo: 7, expiresInDays: 40, status: 'ACTIVE',
  },
  {
    key: 'ai-dev', company: 'verde', title: 'Prompt Engineer / AI Developer',
    workMode: 'HYBRID', jobType: 'FULL_TIME', location: 'Bogotá, Colombia',
    description: 'Diseña asistentes y flujos con modelos de lenguaje para casos de uso reales: soporte, análisis documental y automatización.',
    responsibilities: 'Diseñar y evaluar prompts\nIntegrar la API de OpenAI en servicios internos\nMedir calidad y costos de las soluciones de IA',
    requirements: 'Experiencia práctica con APIs de LLMs\nPython o JavaScript\nCriterio para evaluar respuestas de IA',
    benefits: 'Presupuesto para créditos de IA\nHíbrido\nHorario flexible',
    skills: ['OpenAI API', 'Prompt Engineering', 'Python', 'REST APIs'],
    requiresInterview: true,
    interviewInstructions: 'Entrevista sobre diseño de prompts y uso de la API de OpenAI. Explora cómo evalúa la calidad de las respuestas, maneja alucinaciones y controla costos.',
    postedDaysAgo: 5, expiresInDays: 35, status: 'ACTIVE',
  },
  {
    key: 'qa-auto', company: 'verde', title: 'QA Automation Engineer',
    workMode: 'REMOTE', jobType: 'PART_TIME', location: 'Remoto (LATAM)',
    description: 'Medio tiempo para automatizar pruebas de extremo a extremo y de API de nuestros productos de datos.',
    responsibilities: 'Escribir pruebas E2E con Selenium\nAutomatizar colecciones de Postman\nReportar y dar seguimiento a defectos',
    requirements: 'Experiencia con Selenium y Postman\nJavaScript\nAtención al detalle',
    benefits: 'Horario flexible\nRemoto',
    skills: ['Selenium', 'Postman', 'Jest', 'JavaScript'],
    requiresInterview: false, postedDaysAgo: 2, expiresInDays: 25, status: 'ACTIVE',
  },
  {
    key: 'java-senior', company: 'cordillera', title: 'Desarrollador/a Java Senior',
    workMode: 'ON_SITE', jobType: 'FULL_TIME', location: 'Santiago, Chile',
    description: 'Lidera el diseño de servicios de pagos críticos con alta disponibilidad y cumplimiento regulatorio.',
    responsibilities: 'Diseñar microservicios con Spring Boot\nGarantizar consistencia en transacciones financieras\nMentorizar a desarrolladores junior',
    requirements: '5+ años con Java y Spring Boot\nExperiencia con arquitectura limpia y microservicios\nPruebas con JUnit',
    benefits: 'Seguro complementario de salud\nBono anual\nAyuda de reubicación',
    skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Clean Architecture', 'JUnit'],
    requiresInterview: true,
    interviewInstructions: 'Entrevista senior: arquitectura limpia, microservicios, consistencia de datos en pagos, estrategia de pruebas y liderazgo técnico. Pide ejemplos concretos de decisiones difíciles.',
    postedDaysAgo: 10, expiresInDays: 50, status: 'ACTIVE',
  },
  {
    key: 'ux-ui', company: 'cordillera', title: 'Diseñador/a UX/UI',
    workMode: 'HYBRID', jobType: 'FULL_TIME', location: 'Santiago, Chile',
    description: 'Diseña experiencias financieras simples y accesibles para pequeños negocios.',
    responsibilities: 'Investigación con usuarios\nPrototipos en Figma\nTrabajo conjunto con ingeniería y producto',
    requirements: 'Portafolio con casos reales\nDominio de Figma\nTrabajo con metodologías ágiles',
    benefits: 'Híbrido\nEquipo de trabajo a elección\nDías de bienestar',
    skills: ['Figma', 'Scrum', 'Comunicación efectiva'],
    requiresInterview: false, postedDaysAgo: 1, expiresInDays: 28, status: 'ACTIVE',
  },
  {
    key: 'node-closed', company: 'cordillera', title: 'Full Stack Node.js (proceso finalizado)',
    workMode: 'REMOTE', jobType: 'FULL_TIME', location: 'Remoto (LATAM)',
    description: 'Búsqueda ya cubierta. Se mantiene como ejemplo de oferta cerrada.',
    responsibilities: 'Desarrollo full stack con Node.js y React',
    requirements: 'Node.js, React y SQL', benefits: 'Remoto',
    skills: ['Node.js', 'React', 'SQL'],
    requiresInterview: false, postedDaysAgo: 40, expiresInDays: 10, status: 'CLOSED',
  },
  {
    key: 'mobile-draft', company: 'nimbus', title: 'Tech Lead Mobile (borrador)',
    workMode: 'REMOTE', jobType: 'FULL_TIME', location: 'Remoto (LATAM)',
    description: 'Borrador de una oferta aún no publicada.',
    responsibilities: 'Liderar el equipo de aplicaciones Android',
    requirements: 'Kotlin y Jetpack Compose', benefits: 'Por definir',
    skills: ['Android', 'Kotlin', 'Jetpack Compose'],
    requiresInterview: false, postedDaysAgo: 4, expiresInDays: 60, status: 'DRAFT',
  },
]
