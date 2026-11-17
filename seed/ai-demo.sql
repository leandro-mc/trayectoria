-- ================================================================
--  TrayectorIA — demo data seed (part 2/2: pre-written AI content)
--
--  Inserts what the AI features would normally generate with OpenAI:
--    • tailored CVs (generated_curriculum), attached to the matching applications
--    • simulated interviews with their chat history (completed + in progress)
--  so those screens have content even when no OPENAI_API_KEY is configured.
--
--  Run AFTER seed/seed.mjs (it needs the demo users, offers and applications):
--    docker: runs automatically as the `seed-ai` service
--    local:  psql -h localhost -p 5434 -U trayectoria -d trayectoria -f seed/ai-demo.sql
--
--  Idempotent: does nothing if the content already exists or if the
--  demo users are missing.
-- ================================================================

DO $seed$
DECLARE
    v_sofia        BIGINT;
    v_mateo        BIGINT;
    v_offer_front  BIGINT;
    v_offer_back   BIGINT;
    v_offer_ai     BIGINT;
    v_offer_java   BIGINT;
    v_cv_front     BIGINT;
    v_cv_back      BIGINT;
    v_cv_java      BIGINT;
    v_int_done     BIGINT;
    v_int_live     BIGINT;
BEGIN
    SELECT id INTO v_sofia FROM users WHERE email = 'sofia@demo.trayectoria.dev';
    SELECT id INTO v_mateo FROM users WHERE email = 'mateo@demo.trayectoria.dev';

    IF v_sofia IS NULL OR v_mateo IS NULL THEN
        RAISE NOTICE '[seed-ai] demo users not found → run seed/seed.mjs first. Nothing done.';
        RETURN;
    END IF;

    IF EXISTS (SELECT 1 FROM generated_curriculum WHERE candidate_id IN (v_sofia, v_mateo))
       OR EXISTS (SELECT 1 FROM simulated_interview WHERE candidate_id IN (v_sofia, v_mateo)) THEN
        RAISE NOTICE '[seed-ai] AI demo content already present → nothing to do.';
        RETURN;
    END IF;

    SELECT id INTO v_offer_front FROM job_offer WHERE title = 'Frontend Developer React / Next.js'  LIMIT 1;
    SELECT id INTO v_offer_back  FROM job_offer WHERE title = 'Desarrollador/a Backend Kotlin'       LIMIT 1;
    SELECT id INTO v_offer_ai    FROM job_offer WHERE title = 'Prompt Engineer / AI Developer'       LIMIT 1;
    SELECT id INTO v_offer_java  FROM job_offer WHERE title = 'Desarrollador/a Java Senior'          LIMIT 1;

    -- ── Tailored CVs ─────────────────────────────────────────────
    INSERT INTO generated_curriculum (candidate_id, job_offer_id, content, is_ai_generated, created_at)
    VALUES (v_sofia, v_offer_front, $json$
    {
      "summary": "Desarrolladora full stack con 4 años de experiencia creando interfaces rápidas y accesibles con React, Next.js y TypeScript. Lideró la mejora del rendimiento del frontend en Pixelforge Studio (-35% en tiempo de carga) y disfruta colaborar de cerca con diseño en sistemas de componentes reutilizables.",
      "experience": [
        {"company": "Pixelforge Studio", "position": "Desarrolladora Full Stack", "period": "Mar 2022 – Presente",
         "description": "Desarrollo de aplicaciones web con React, Next.js y Node.js. Reducción del 35% en el tiempo de carga mediante renderizado en servidor y división de código. Mantenimiento de una biblioteca de componentes compartida con diseño."},
        {"company": "Tienda Aurora", "position": "Desarrolladora Frontend Jr.", "period": "Feb 2020 – Feb 2022",
         "description": "Implementación de interfaces responsivas y de la pasarela de pagos del e-commerce, con foco en accesibilidad."}
      ],
      "education": [
        {"institution": "Universidad Tecnológica del Pacífico", "degree": "Ingeniería en Sistemas", "period": "2014 – 2019"},
        {"institution": "Academia Código Norte", "degree": "Especialización en Cloud y DevOps", "period": "2021"}
      ],
      "skills": ["React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Git", "Docker", "Trabajo en equipo"],
      "languages": [{"language": "Español", "level": "Nativo"}, {"language": "Inglés", "level": "B2"}],
      "highlights": [
        "-35% en tiempo de carga del frontend",
        "Sistema de componentes compartido con diseño",
        "Experiencia end-to-end: de la interfaz a la API"
      ]
    }
    $json$::jsonb, TRUE, NOW() - INTERVAL '6 days')
    RETURNING id INTO v_cv_front;

    INSERT INTO generated_curriculum (candidate_id, job_offer_id, content, is_ai_generated, created_at)
    VALUES (v_sofia, v_offer_back, $json$
    {
      "summary": "Desarrolladora full stack con sólida base en Node.js y bases de datos relacionales, en transición activa hacia el backend con Kotlin y Spring Boot. Ha diseñado APIs REST, migrado un monolito a servicios y trabaja con Docker y PostgreSQL a diario.",
      "experience": [
        {"company": "Pixelforge Studio", "position": "Desarrolladora Full Stack", "period": "Mar 2022 – Presente",
         "description": "Diseño de APIs REST con Node.js y PostgreSQL. Migración de un monolito a servicios independientes, contenedorizados con Docker y desplegados con integración continua."},
        {"company": "Tienda Aurora", "position": "Desarrolladora Frontend Jr.", "period": "Feb 2020 – Feb 2022",
         "description": "Integración con servicios backend y pasarela de pagos; apoyo en pruebas de la API."}
      ],
      "education": [
        {"institution": "Universidad Tecnológica del Pacífico", "degree": "Ingeniería en Sistemas", "period": "2014 – 2019"},
        {"institution": "Academia Código Norte", "degree": "Especialización en Cloud y DevOps", "period": "2021"}
      ],
      "skills": ["Node.js", "PostgreSQL", "Docker", "Git", "TypeScript", "Scrum", "Comunicación efectiva"],
      "languages": [{"language": "Español", "level": "Nativo"}, {"language": "Inglés", "level": "B2"}],
      "highlights": [
        "Migración de monolito a servicios",
        "Cursó la especialización en Cloud y DevOps",
        "Aprendizaje continuo: proyecto personal en Kotlin + Spring Boot"
      ]
    }
    $json$::jsonb, TRUE, NOW() - INTERVAL '8 days')
    RETURNING id INTO v_cv_back;

    INSERT INTO generated_curriculum (candidate_id, job_offer_id, content, is_ai_generated, created_at)
    VALUES (v_mateo, v_offer_java, $json$
    {
      "summary": "Desarrollador backend junior con experiencia práctica en Java y Spring Boot adquirida durante una pasantía, con foco en APIs REST bien diseñadas y pruebas automatizadas con JUnit.",
      "experience": [
        {"company": "Soluciones Andinas", "position": "Pasante de Desarrollo Backend", "period": "Jun 2023 – Mar 2024",
         "description": "Desarrollo de endpoints REST con Spring Boot, pruebas unitarias con JUnit y soporte a producción."}
      ],
      "education": [
        {"institution": "Universidad del Valle Central", "degree": "Ingeniería de Sistemas", "period": "2018 – 2023"}
      ],
      "skills": ["Java", "Spring Boot", "PostgreSQL", "JUnit", "Docker", "REST APIs", "Git"],
      "languages": [{"language": "Español", "level": "Nativo"}, {"language": "Inglés", "level": "B1"}],
      "highlights": [
        "Pruebas unitarias desde el primer día",
        "Buena base en arquitectura por capas",
        "Alta motivación para crecer hacia roles senior"
      ]
    }
    $json$::jsonb, TRUE, NOW() - INTERVAL '5 days')
    RETURNING id INTO v_cv_java;

    -- Attach each CV to the application it was generated for
    UPDATE job_application SET curriculum_id = v_cv_front
     WHERE candidate_id = v_sofia AND job_offer_id = v_offer_front;
    UPDATE job_application SET curriculum_id = v_cv_back
     WHERE candidate_id = v_sofia AND job_offer_id = v_offer_back;
    UPDATE job_application SET curriculum_id = v_cv_java
     WHERE candidate_id = v_mateo AND job_offer_id = v_offer_java;

    -- ── Simulated interview 1: completed ─────────────────────────
    INSERT INTO simulated_interview (candidate_id, job_offer_id, status, created_at, completed_at)
    VALUES (v_sofia, v_offer_front, 'COMPLETED', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days' + INTERVAL '22 minutes')
    RETURNING id INTO v_int_done;

    INSERT INTO interview_message (interview_id, role, content, sent_at) VALUES
    (v_int_done, 'SYSTEM',    'Simulación de entrevista para la oferta "Frontend Developer React / Next.js" de Nimbus Labs.', NOW() - INTERVAL '7 days'),
    (v_int_done, 'ASSISTANT', '¡Hola, Sofía! Gracias por tu interés en el puesto de Frontend Developer en Nimbus Labs. Para empezar, cuéntame brevemente sobre ti y por qué te interesa esta posición.', NOW() - INTERVAL '7 days' + INTERVAL '10 seconds'),
    (v_int_done, 'USER',      'Hola, gracias. Soy desarrolladora full stack con 4 años de experiencia, sobre todo en React, Next.js y TypeScript. Me interesa el puesto porque trabajan con una consola usada por muchos desarrolladores y valoro mucho la accesibilidad y el rendimiento.', NOW() - INTERVAL '7 days' + INTERVAL '1 minute'),
    (v_int_done, 'ASSISTANT', 'Muy bien. En Next.js, ¿cuándo elegirías renderizado en servidor frente a renderizado en cliente, y cómo lo has aplicado en un proyecto real?', NOW() - INTERVAL '7 days' + INTERVAL '90 seconds'),
    (v_int_done, 'USER',      'Uso renderizado en servidor para páginas con contenido público o que dependen de SEO y para reducir el tiempo hasta el primer contenido útil. En Pixelforge migré el catálogo a renderizado en servidor y, junto con la división de código, bajamos el tiempo de carga un 35%. Dejo el cliente para partes muy interactivas o dependientes de la sesión.', NOW() - INTERVAL '7 days' + INTERVAL '4 minutes'),
    (v_int_done, 'ASSISTANT', 'Excelente ejemplo con métrica. Cambiando de tema: ¿cómo abordas la accesibilidad al construir un componente reutilizable, por ejemplo un menú desplegable?', NOW() - INTERVAL '7 days' + INTERVAL '5 minutes'),
    (v_int_done, 'USER',      'Parto de HTML semántico y gestiono el foco y la navegación por teclado. Añado roles y atributos ARIA solo cuando hace falta, pruebo con un lector de pantalla y con herramientas automáticas, y documento el comportamiento esperado en la biblioteca de componentes.', NOW() - INTERVAL '7 days' + INTERVAL '8 minutes'),
    (v_int_done, 'ASSISTANT', 'Gracias, Sofía. Eso es todo por mi parte. Respondiste con claridad, con ejemplos concretos y buenas métricas. ¡Mucho éxito en tu proceso!', NOW() - INTERVAL '7 days' + INTERVAL '22 minutes');

    -- ── Simulated interview 2: in progress ───────────────────────
    INSERT INTO simulated_interview (candidate_id, job_offer_id, status, created_at)
    VALUES (v_sofia, v_offer_ai, 'IN_PROGRESS', NOW() - INTERVAL '1 day')
    RETURNING id INTO v_int_live;

    INSERT INTO interview_message (interview_id, role, content, sent_at) VALUES
    (v_int_live, 'SYSTEM',    'Simulación de entrevista para la oferta "Prompt Engineer / AI Developer" de Verde Analytics.', NOW() - INTERVAL '1 day'),
    (v_int_live, 'ASSISTANT', '¡Hola, Sofía! Bienvenida a la entrevista para Prompt Engineer / AI Developer en Verde Analytics. ¿Has trabajado antes con modelos de lenguaje o con la API de OpenAI? Cuéntame tu experiencia.', NOW() - INTERVAL '1 day' + INTERVAL '10 seconds'),
    (v_int_live, 'USER',      'Sí, he integrado la API de OpenAI en un asistente de soporte interno. Definí instrucciones de sistema, probé varias versiones del prompt y medí la calidad con un conjunto de casos de prueba.', NOW() - INTERVAL '1 day' + INTERVAL '2 minutes'),
    (v_int_live, 'ASSISTANT', 'Interesante. ¿Cómo detectas y reduces las respuestas incorrectas o inventadas (alucinaciones) en ese tipo de asistente?', NOW() - INTERVAL '1 day' + INTERVAL '2 minutes 30 seconds');

    RAISE NOTICE '[seed-ai] inserted 3 tailored CVs and 2 simulated interviews.';
END
$seed$;
