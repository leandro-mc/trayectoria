#!/usr/bin/env node
// ================================================================
//  TrayectorIA — demo data seed (part 1/2: through the REST API)
//
//  Creates fictional companies, candidates (with full profiles), job
//  offers, applications in every status and saved offers.
//  Requires Node 18+ (global fetch) and no npm packages.
//
//    Docker:  runs automatically as the `seed` service in docker-compose.yml
//    Local:   node seed/seed.mjs         (API_URL defaults to http://localhost:8080/api)
//
//  Safe to run more than once: users are reused, offers are matched by
//  title, and profile data is only added when missing.
//  Part 2/2 (pre-written AI content) lives in seed/ai-demo.sql.
//
//  Env: API_URL, FRONTEND_URL (only for the final hint),
//       SEED_DEMO_DATA=false to skip.
//
//  All demo accounts share the password:  Demo1234!
// ================================================================

const API = (process.env.API_URL || 'http://localhost:8080/api').replace(/\/$/, '')
const FRONTEND = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '')
const PASSWORD = 'Demo1234!'

if (process.env.SEED_DEMO_DATA === 'false') {
  console.log('[seed] SEED_DEMO_DATA=false → skipping demo data.')
  process.exit(0)
}

// ── helpers ──────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const list = (d) => (Array.isArray(d) ? d : d?.content ?? [])
const inDays = (days) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 19)

async function call(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  return { ok: res.ok, status: res.status, data }
}

async function must(method, path, body, token) {
  const r = await call(method, path, body, token)
  if (!r.ok) throw new Error(`${method} ${path} → HTTP ${r.status}: ${JSON.stringify(r.data)}`)
  return r.data
}

async function waitForApi(retries = 90, delayMs = 2000) {
  console.log(`[seed] Waiting for the API at ${API} ...`)
  for (let i = 1; i <= retries; i++) {
    try {
      const r = await fetch(`${API}/actuator/health`)
      if (r.ok) { console.log('[seed] API is up.'); return }
    } catch { /* not up yet */ }
    if (i % 5 === 0) console.log(`[seed]   still waiting (${i}/${retries})...`)
    await sleep(delayMs)
  }
  throw new Error(`API not reachable at ${API} after ${retries} attempts`)
}

/** Register the user; if the email already exists, log in instead. Returns the access token. */
async function ensureUser(kind, payload) {
  const reg = await call('POST', `/v1/auth/register/${kind}`, { password: PASSWORD, ...payload })
  if (reg.ok) return reg.data.accessToken
  const login = await call('POST', '/v1/auth/login', { email: payload.email, password: PASSWORD })
  if (login.ok) return login.data.accessToken
  throw new Error(`Could not register or log in ${payload.email}: HTTP ${reg.status} ${JSON.stringify(reg.data)}`)
}

// ── demo data ────────────────────────────────────────────────────
const COMPANIES = [
  {
    key: 'nimbus', email: 'nimbus@demo.trayectoria.dev', companyName: 'Nimbus Labs',
    profile: {
      industry: 'Software y servicios cloud',
      about: 'Construimos plataformas cloud para equipos de producto. Equipo distribuido, cultura de ingeniería abierta y foco en calidad.',
      website: 'https://nimbus-labs.example.com', location: 'Ciudad de México, México',
    },
  },
  {
    key: 'verde', email: 'verde@demo.trayectoria.dev', companyName: 'Verde Analytics',
    profile: {
      industry: 'Datos e inteligencia artificial',
      about: 'Ayudamos a empresas a tomar decisiones con datos y a incorporar IA generativa en sus procesos.',
      website: 'https://verde-analytics.example.com', location: 'Bogotá, Colombia',
    },
  },
  {
    key: 'cordillera', email: 'cordillera@demo.trayectoria.dev', companyName: 'Cordillera Fintech',
    profile: {
      industry: 'Tecnología financiera',
      about: 'Plataforma de pagos y servicios financieros digitales para pymes de Latinoamérica.',
      website: 'https://cordillera-fintech.example.com', location: 'Santiago, Chile',
    },
  },
]

const OFFERS = [
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
    expiresInDays: 45,
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
    expiresInDays: 30,
  },
  {
    key: 'devops-intern', company: 'nimbus', title: 'Pasante de DevOps',
    workMode: 'ON_SITE', jobType: 'INTERNSHIP', location: 'Ciudad de México, México',
    description: 'Programa de pasantía de 6 meses con mentoría. Aprenderás a automatizar despliegues y a operar servicios en la nube.',
    responsibilities: 'Apoyar pipelines de CI/CD\nMonitorear servicios\nDocumentar procedimientos operativos',
    requirements: 'Estudiante de últimos años de Ingeniería\nNociones de Linux y Git\nGanas de aprender',
    benefits: 'Mentoría 1:1\nPosibilidad de contratación\nAyuda de transporte',
    skills: ['Linux', 'Docker', 'GitHub Actions', 'Git'],
    requiresInterview: false, expiresInDays: 20,
  },
  {
    key: 'data-eng', company: 'verde', title: 'Ingeniero/a de Datos Python',
    workMode: 'REMOTE', jobType: 'FULL_TIME', location: 'Remoto (LATAM)',
    description: 'Diseña y mantén los pipelines de datos que alimentan los tableros y modelos de nuestros clientes.',
    responsibilities: 'Construir pipelines ETL en Python\nModelar datos en PostgreSQL\nAsegurar la calidad y trazabilidad de los datos',
    requirements: 'Python y SQL avanzados\nExperiencia con PostgreSQL\nConocimientos de Docker',
    benefits: 'Remoto\nBono por desempeño\nCapacitaciones y certificaciones',
    skills: ['Python', 'SQL', 'PostgreSQL', 'Docker'],
    requiresInterview: false, expiresInDays: 40,
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
    expiresInDays: 35,
  },
  {
    key: 'qa-auto', company: 'verde', title: 'QA Automation Engineer',
    workMode: 'REMOTE', jobType: 'PART_TIME', location: 'Remoto (LATAM)',
    description: 'Medio tiempo para automatizar pruebas de extremo a extremo y de API de nuestros productos de datos.',
    responsibilities: 'Escribir pruebas E2E con Selenium\nAutomatizar colecciones de Postman\nReportar y dar seguimiento a defectos',
    requirements: 'Experiencia con Selenium y Postman\nJavaScript\nAtención al detalle',
    benefits: 'Horario flexible\nRemoto',
    skills: ['Selenium', 'Postman', 'Jest', 'JavaScript'],
    requiresInterview: false, expiresInDays: 25,
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
    expiresInDays: 50,
  },
  {
    key: 'ux-ui', company: 'cordillera', title: 'Diseñador/a UX/UI',
    workMode: 'HYBRID', jobType: 'FULL_TIME', location: 'Santiago, Chile',
    description: 'Diseña experiencias financieras simples y accesibles para pequeños negocios.',
    responsibilities: 'Investigación con usuarios\nPrototipos en Figma\nTrabajo conjunto con ingeniería y producto',
    requirements: 'Portafolio con casos reales\nDominio de Figma\nTrabajo con metodologías ágiles',
    benefits: 'Híbrido\nEquipo de trabajo a elección\nDías de bienestar',
    skills: ['Figma', 'Scrum', 'Comunicación efectiva'],
    requiresInterview: false, expiresInDays: 28,
  },
  {
    key: 'node-closed', company: 'cordillera', title: 'Full Stack Node.js (proceso finalizado)',
    workMode: 'REMOTE', jobType: 'FULL_TIME', location: 'Remoto (LATAM)',
    description: 'Búsqueda ya cubierta. Se mantiene como ejemplo de oferta cerrada.',
    responsibilities: 'Desarrollo full stack con Node.js y React',
    requirements: 'Node.js, React y SQL', benefits: 'Remoto',
    skills: ['Node.js', 'React', 'SQL'],
    requiresInterview: false, expiresInDays: 10, finalStatus: 'CLOSED',
  },
  {
    key: 'mobile-draft', company: 'nimbus', title: 'Tech Lead Mobile (borrador)',
    workMode: 'REMOTE', jobType: 'FULL_TIME', location: 'Remoto (LATAM)',
    description: 'Borrador de una oferta aún no publicada.',
    responsibilities: 'Liderar el equipo de aplicaciones Android',
    requirements: 'Kotlin y Jetpack Compose', benefits: 'Por definir',
    skills: ['Android', 'Kotlin', 'Jetpack Compose'],
    requiresInterview: false, expiresInDays: 60, finalStatus: 'DRAFT',
  },
]

const CANDIDATES = [
  {
    key: 'sofia', email: 'sofia@demo.trayectoria.dev', firstName: 'Sofía', lastName: 'Ramírez',
    profile: {
      phone: '+52 55 5555 0101', location: 'Ciudad de México, México', birthdate: '1996-04-12',
      bio: 'Desarrolladora full stack con 4 años de experiencia construyendo productos web con React, Next.js y Node.js. Me gusta trabajar cerca de diseño y cuidar la experiencia de usuario.',
      linkedinUrl: 'https://linkedin.com/in/demo-sofia-ramirez', githubUrl: 'https://github.com/demo-sofia',
      portfolioUrl: 'https://sofia-ramirez.example.com',
    },
    experience: [
      { company: 'Pixelforge Studio', position: 'Desarrolladora Full Stack', startDate: '2022-03-01', isCurrent: true,
        description: 'Desarrollo de aplicaciones web con React, Next.js y Node.js. Migración de un monolito a servicios y mejora del rendimiento del frontend en un 35%.' },
      { company: 'Tienda Aurora', position: 'Desarrolladora Frontend Jr.', startDate: '2020-02-01', endDate: '2022-02-28', isCurrent: false,
        description: 'Implementación de interfaces responsivas y de la pasarela de pagos del e-commerce.' },
    ],
    education: [
      { institution: 'Universidad Tecnológica del Pacífico', degree: 'Ingeniería en Sistemas', fieldOfStudy: 'Ingeniería de Software', startDate: '2014-02-01', endDate: '2019-12-15' },
      { institution: 'Academia Código Norte', degree: 'Especialización en Cloud y DevOps', fieldOfStudy: 'Cloud', startDate: '2021-03-01', endDate: '2021-09-30' },
    ],
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Git', 'Docker', 'PostgreSQL', 'Scrum', 'Trabajo en equipo', 'Comunicación efectiva'],
    languages: [{ language: 'Español', level: 'Native' }, { language: 'Inglés', level: 'B2' }],
    saved: ['devops-intern', 'data-eng', 'ux-ui'],
  },
  {
    key: 'mateo', email: 'mateo@demo.trayectoria.dev', firstName: 'Mateo', lastName: 'Vargas',
    profile: {
      phone: '+57 300 555 0102', location: 'Medellín, Colombia', birthdate: '2000-09-03',
      bio: 'Desarrollador backend junior apasionado por las APIs bien diseñadas y las pruebas automatizadas. Busco un equipo donde seguir creciendo con Java y Spring Boot.',
      linkedinUrl: 'https://linkedin.com/in/demo-mateo-vargas', githubUrl: 'https://github.com/demo-mateo',
    },
    experience: [
      { company: 'Soluciones Andinas', position: 'Pasante de Desarrollo Backend', startDate: '2023-06-01', endDate: '2024-03-31', isCurrent: false,
        description: 'Desarrollo de endpoints REST con Spring Boot, pruebas unitarias con JUnit y soporte a producción.' },
    ],
    education: [
      { institution: 'Universidad del Valle Central', degree: 'Ingeniería de Sistemas', fieldOfStudy: 'Ingeniería de Sistemas', startDate: '2018-02-01', endDate: '2023-11-30' },
    ],
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Git', 'JUnit', 'REST APIs', 'Resolución de problemas'],
    languages: [{ language: 'Español', level: 'Native' }, { language: 'Inglés', level: 'B1' }],
    saved: ['backend-kotlin', 'ai-dev'],
  },
  {
    key: 'camila', email: 'camila@demo.trayectoria.dev', firstName: 'Camila', lastName: 'Solís',
    profile: {
      phone: '+56 9 5555 0103', location: 'Santiago, Chile', birthdate: '1994-11-21',
      bio: 'Ingeniera de calidad y datos con foco en automatización. Me interesa que los equipos entreguen con confianza y que los datos cuenten una historia clara.',
      linkedinUrl: 'https://linkedin.com/in/demo-camila-solis', githubUrl: 'https://github.com/demo-camila',
    },
    experience: [
      { company: 'Datavía', position: 'QA Automation Engineer', startDate: '2021-05-01', isCurrent: true,
        description: 'Automatización de pruebas E2E y de API; reducción del tiempo de regresión de 2 días a 3 horas.' },
    ],
    education: [
      { institution: 'Universidad Austral del Sur', degree: 'Ingeniería Civil Informática', fieldOfStudy: 'Informática', startDate: '2012-03-01', endDate: '2018-07-15' },
    ],
    skills: ['Python', 'SQL', 'Selenium', 'Postman', 'Jest', 'Scrum', 'Trabajo en equipo'],
    languages: [{ language: 'Español', level: 'Native' }, { language: 'Inglés', level: 'C1' }],
    saved: ['data-eng'],
  },
]

// candidate key → [offer key, final status set by the company]
const APPLICATIONS = {
  sofia: [['frontend-react', 'IN_REVIEW'], ['backend-kotlin', 'ACCEPTED'], ['ai-dev', 'VIEWED'], ['qa-auto', 'PENDING']],
  mateo: [['backend-kotlin', 'REJECTED'], ['java-senior', 'IN_REVIEW'], ['devops-intern', 'PENDING']],
  camila: [['data-eng', 'VIEWED'], ['qa-auto', 'ACCEPTED'], ['ai-dev', 'PENDING']],
}

// ── main ─────────────────────────────────────────────────────────
async function main() {
  await waitForApi()

  // Skills catalogue (created by the Flyway migration)
  const skillList = list(await must('GET', '/v1/skills'))
  const skillId = Object.fromEntries(skillList.map((s) => [s.name, s.id]))
  const ids = (names) =>
    names.map((n) => {
      if (!skillId[n]) throw new Error(`Skill "${n}" not found in the catalogue`)
      return skillId[n]
    })

  // Already seeded? (first demo company exists and has offers)
  const probe = await call('POST', '/v1/auth/login', { email: COMPANIES[0].email, password: PASSWORD })
  if (probe.ok) {
    const mine = await call('GET', '/v1/job-offers/mine?size=100', undefined, probe.data.accessToken)
    if (mine.ok && list(mine.data).length >= OFFERS.filter((o) => o.company === COMPANIES[0].key).length) {
      console.log('[seed] Demo data already present → nothing to do.')
      return
    }
  }

  console.log('[seed] Loading demo data...')

  // 1) Companies + profiles
  const companyToken = {}
  for (const c of COMPANIES) {
    companyToken[c.key] = await ensureUser('company', { email: c.email, companyName: c.companyName })
    await must('PUT', '/v1/companies/me', { companyName: c.companyName, ...c.profile }, companyToken[c.key])
    console.log(`[seed]   ✓ company  ${c.companyName}  <${c.email}>`)
  }

  // 2) Job offers (matched by title so re-runs don't duplicate)
  const offerId = {}
  const offerCompany = {}
  for (const o of OFFERS) {
    const token = companyToken[o.company]
    const existing = list(await must('GET', '/v1/job-offers/mine?size=100', undefined, token))
    let found = existing.find((e) => e.title === o.title)
    if (!found) {
      found = await must('POST', '/v1/job-offers', {
        title: o.title, description: o.description, responsibilities: o.responsibilities,
        requirements: o.requirements, benefits: o.benefits, workMode: o.workMode, jobType: o.jobType,
        location: o.location, requiresInterview: o.requiresInterview,
        interviewInstructions: o.interviewInstructions ?? null,
        expiresAt: inDays(o.expiresInDays), skillIds: ids(o.skills),
      }, token)
      if (o.finalStatus) await must('PATCH', `/v1/job-offers/${found.id}/status`, { status: o.finalStatus }, token)
    }
    offerId[o.key] = found.id
    offerCompany[o.key] = o.company
  }
  console.log(`[seed]   ✓ ${OFFERS.length} job offers`)

  // 3) Candidates: profile, experience, education, skills, languages, saved offers
  const candToken = {}
  for (const c of CANDIDATES) {
    const token = (candToken[c.key] = await ensureUser('candidate', {
      email: c.email, firstName: c.firstName, lastName: c.lastName,
    }))
    await must('PUT', '/v1/candidates/me', { firstName: c.firstName, lastName: c.lastName, ...c.profile }, token)

    if (list(await must('GET', '/v1/candidates/me/experience', undefined, token)).length === 0)
      for (const e of c.experience) await must('POST', '/v1/candidates/me/experience', e, token)

    if (list(await must('GET', '/v1/candidates/me/education', undefined, token)).length === 0)
      for (const e of c.education) await must('POST', '/v1/candidates/me/education', e, token)

    if (list(await must('GET', '/v1/candidates/me/skills', undefined, token)).length === 0)
      await must('POST', '/v1/candidates/me/skills', { skillIds: ids(c.skills) }, token)

    if (list(await must('GET', '/v1/candidates/me/languages', undefined, token)).length === 0)
      for (const l of c.languages) await must('POST', '/v1/candidates/me/languages', l, token)

    for (const key of c.saved) await call('POST', `/v1/saved-offers/${offerId[key]}`, undefined, token) // duplicates tolerated

    console.log(`[seed]   ✓ candidate ${c.firstName} ${c.lastName}  <${c.email}>`)
  }

  // 4) Applications, then the company moves them through the pipeline
  for (const c of CANDIDATES) {
    for (const [offerKey] of APPLICATIONS[c.key]) {
      await call('POST', `/v1/job-offers/${offerId[offerKey]}/apply`, {}, candToken[c.key]) // 409 if already applied → fine
    }
  }
  for (const c of CANDIDATES) {
    for (const [offerKey, status] of APPLICATIONS[c.key]) {
      if (status === 'PENDING') continue
      const token = companyToken[offerCompany[offerKey]]
      const apps = list(await must('GET', `/v1/job-offers/${offerId[offerKey]}/applications?size=100`, undefined, token))
      const app = apps.find((a) => a.candidateEmail === c.email)
      if (app && app.status !== status) {
        await must('PATCH', `/v1/applications/${app.id}/status`, { status }, token)
      }
    }
  }
  const total = Object.values(APPLICATIONS).reduce((n, a) => n + a.length, 0)
  console.log(`[seed]   ✓ ${total} applications (PENDING, VIEWED, IN_REVIEW, ACCEPTED, REJECTED)`)

  console.log(`
[seed] Done. Open ${FRONTEND} and log in (password for every account: ${PASSWORD})

         Candidate:  sofia@demo.trayectoria.dev     (full profile, applications, saved offers)
                     mateo@demo.trayectoria.dev
                     camila@demo.trayectoria.dev
         Company:    nimbus@demo.trayectoria.dev    (4 offers, applicants to review)
                     verde@demo.trayectoria.dev
                     cordillera@demo.trayectoria.dev
`)
}

main().catch((err) => {
  console.error(`[seed] ERROR: ${err.message}`)
  process.exit(1)
})
