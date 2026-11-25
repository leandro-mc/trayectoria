import type { CurriculumContent } from '@/features/ai/curricula/types/curricula.types'
import type { InterviewFeedback } from '@/features/ai/interviews/types/interviews.types'
import type { MessageRole } from '@/types/global.types'
import type { CandidateKey } from './accounts'
import type { OfferKey } from './offers'

/**
 * Pre-written "AI" output, ported from seed/ai-demo.sql: tailored CVs attached to the
 * matching applications, plus one finished and one in-progress interview.
 */

export interface CurriculumFixture {
  candidate: CandidateKey
  offer: OfferKey
  daysAgo: number
  content: CurriculumContent
}

const SOFIA_EDUCATION = [
  { institution: 'Universidad Tecnológica del Pacífico', degree: 'Ingeniería en Sistemas', period: '2014 – 2019' },
  { institution: 'Academia Código Norte', degree: 'Especialización en Cloud y DevOps', period: '2021' },
]
const SOFIA_LANGUAGES = [{ language: 'Español', level: 'Nativo' }, { language: 'Inglés', level: 'B2' }]

export const CURRICULA: readonly CurriculumFixture[] = [
  {
    candidate: 'sofia', offer: 'frontend-react', daysAgo: 6,
    content: {
      summary: 'Desarrolladora full stack con 6 años de experiencia creando interfaces rápidas y accesibles con React, Next.js y TypeScript. Lideró la mejora del rendimiento del frontend en Pixelforge Studio (-35% en tiempo de carga) y disfruta colaborar de cerca con diseño en sistemas de componentes reutilizables.',
      experience: [
        { company: 'Pixelforge Studio', position: 'Desarrolladora Full Stack', period: 'Mar 2022 – Presente',
          description: 'Desarrollo de aplicaciones web con React, Next.js y Node.js. Reducción del 35% en el tiempo de carga mediante renderizado en servidor y división de código. Mantenimiento de una biblioteca de componentes compartida con diseño.' },
        { company: 'Tienda Aurora', position: 'Desarrolladora Frontend Jr.', period: 'Feb 2020 – Feb 2022',
          description: 'Implementación de interfaces responsivas y de la pasarela de pagos del e-commerce, con foco en accesibilidad.' },
      ],
      education: SOFIA_EDUCATION,
      skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Git', 'Docker', 'Trabajo en equipo'],
      languages: SOFIA_LANGUAGES,
      highlights: [
        '-35% en tiempo de carga del frontend',
        'Sistema de componentes compartido con diseño',
        'Experiencia end-to-end: de la interfaz a la API',
      ],
    },
  },
  {
    candidate: 'sofia', offer: 'backend-kotlin', daysAgo: 8,
    content: {
      summary: 'Desarrolladora full stack con sólida base en Node.js y bases de datos relacionales, en transición activa hacia el backend con Kotlin y Spring Boot. Ha diseñado APIs REST, migrado un monolito a servicios y trabaja con Docker y PostgreSQL a diario.',
      experience: [
        { company: 'Pixelforge Studio', position: 'Desarrolladora Full Stack', period: 'Mar 2022 – Presente',
          description: 'Diseño de APIs REST con Node.js y PostgreSQL. Migración de un monolito a servicios independientes, contenedorizados con Docker y desplegados con integración continua.' },
        { company: 'Tienda Aurora', position: 'Desarrolladora Frontend Jr.', period: 'Feb 2020 – Feb 2022',
          description: 'Integración con servicios backend y pasarela de pagos; apoyo en pruebas de la API.' },
      ],
      education: SOFIA_EDUCATION,
      skills: ['Node.js', 'PostgreSQL', 'Docker', 'Git', 'TypeScript', 'Scrum', 'Comunicación efectiva'],
      languages: SOFIA_LANGUAGES,
      highlights: [
        'Migración de monolito a servicios',
        'Cursó la especialización en Cloud y DevOps',
        'Aprendizaje continuo: proyecto personal en Kotlin + Spring Boot',
      ],
    },
  },
  {
    candidate: 'mateo', offer: 'java-senior', daysAgo: 5,
    content: {
      summary: 'Desarrollador backend junior con experiencia práctica en Java y Spring Boot adquirida durante una pasantía, con foco en APIs REST bien diseñadas y pruebas automatizadas con JUnit.',
      experience: [
        { company: 'Soluciones Andinas', position: 'Pasante de Desarrollo Backend', period: 'Jun 2023 – Mar 2024',
          description: 'Desarrollo de endpoints REST con Spring Boot, pruebas unitarias con JUnit y soporte a producción.' },
      ],
      education: [{ institution: 'Universidad del Valle Central', degree: 'Ingeniería de Sistemas', period: '2018 – 2023' }],
      skills: ['Java', 'Spring Boot', 'PostgreSQL', 'JUnit', 'Docker', 'REST APIs', 'Git'],
      languages: [{ language: 'Español', level: 'Nativo' }, { language: 'Inglés', level: 'B1' }],
      highlights: [
        'Pruebas unitarias desde el primer día',
        'Buena base en arquitectura por capas',
        'Alta motivación para crecer hacia roles senior',
      ],
    },
  },
]

export interface InterviewFixture {
  candidate: CandidateKey
  offer: OfferKey
  status: 'COMPLETED' | 'IN_PROGRESS'
  daysAgo: number
  /** Seconds after the interview started. */
  messages: ReadonlyArray<{ role: MessageRole; at: number; content: string }>
  /** The real seed has none (the API only returns feedback on /complete); the demo adds one. */
  feedback?: InterviewFeedback
  /** Minutes the finished interview lasted. */
  durationMinutes?: number
}

export const INTERVIEWS: readonly InterviewFixture[] = [
  {
    candidate: 'sofia', offer: 'frontend-react', status: 'COMPLETED', daysAgo: 7, durationMinutes: 22,
    messages: [
      { role: 'ASSISTANT', at: 10, content: '¡Hola, Sofía! Gracias por tu interés en el puesto de Frontend Developer en Nimbus Labs. Para empezar, cuéntame brevemente sobre ti y por qué te interesa esta posición.' },
      { role: 'USER', at: 60, content: 'Hola, gracias. Soy desarrolladora full stack con 6 años de experiencia, sobre todo en React, Next.js y TypeScript. Me interesa el puesto porque trabajan con una consola usada por muchos desarrolladores y valoro mucho la accesibilidad y el rendimiento.' },
      { role: 'ASSISTANT', at: 90, content: 'Muy bien. En Next.js, ¿cuándo elegirías renderizado en servidor frente a renderizado en cliente, y cómo lo has aplicado en un proyecto real?' },
      { role: 'USER', at: 240, content: 'Uso renderizado en servidor para páginas con contenido público o que dependen de SEO y para reducir el tiempo hasta el primer contenido útil. En Pixelforge migré el catálogo a renderizado en servidor y, junto con la división de código, bajamos el tiempo de carga un 35%. Dejo el cliente para partes muy interactivas o dependientes de la sesión.' },
      { role: 'ASSISTANT', at: 300, content: 'Excelente ejemplo con métrica. Cambiando de tema: ¿cómo abordas la accesibilidad al construir un componente reutilizable, por ejemplo un menú desplegable?' },
      { role: 'USER', at: 480, content: 'Parto de HTML semántico y gestiono el foco y la navegación por teclado. Añado roles y atributos ARIA solo cuando hace falta, pruebo con un lector de pantalla y con herramientas automáticas, y documento el comportamiento esperado en la biblioteca de componentes.' },
      { role: 'ASSISTANT', at: 1320, content: 'Gracias, Sofía. Eso es todo por mi parte. Respondiste con claridad, con ejemplos concretos y buenas métricas. ¡Mucho éxito en tu proceso!' },
    ],
    feedback: {
      overallScore: 8,
      summary: 'Entrevista sólida: respuestas claras, ordenadas y respaldadas con ejemplos y métricas reales de tu experiencia en Pixelforge Studio.',
      strengths: [
        'Justificaste cuándo usar renderizado en servidor y cuándo en cliente, con un resultado medible (-35% en tiempo de carga).',
        'Abordaste la accesibilidad desde el HTML semántico, el foco y las pruebas con lector de pantalla.',
        'Conectaste tu experiencia con lo que valora el puesto: accesibilidad y rendimiento.',
      ],
      areasForImprovement: [
        'Explicar cómo mides el rendimiento en producción (métricas y herramientas concretas).',
        'Añadir un ejemplo de colaboración con diseño al hablar de componentes reutilizables.',
      ],
      recommendation: 'YES',
      details: 'Tus respuestas siguieron una estructura clara: contexto, decisión y resultado. Eso hace fácil seguir tu razonamiento. Para llegar a una valoración destacada, suma en cada respuesta el siguiente nivel de detalle: qué alternativas descartaste y cómo verificaste el impacto. Prepara también un caso de trabajo conjunto con diseño, porque el puesto lo menciona explícitamente.',
    },
  },
  {
    candidate: 'sofia', offer: 'ai-dev', status: 'IN_PROGRESS', daysAgo: 1,
    messages: [
      { role: 'ASSISTANT', at: 10, content: '¡Hola, Sofía! Bienvenida a la entrevista para Prompt Engineer / AI Developer en Verde Analytics. ¿Has trabajado antes con modelos de lenguaje o con la API de OpenAI? Cuéntame tu experiencia.' },
      { role: 'USER', at: 120, content: 'Sí, he integrado la API de OpenAI en un asistente de soporte interno. Definí instrucciones de sistema, probé varias versiones del prompt y medí la calidad con un conjunto de casos de prueba.' },
      { role: 'ASSISTANT', at: 150, content: 'Interesante. ¿Cómo detectas y reduces las respuestas incorrectas o inventadas (alucinaciones) en ese tipo de asistente?' },
    ],
  },
]
