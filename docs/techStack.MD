### A. Frontend: React.js (con Vite)

- **¿Por qué?**: Vite ofrece tiempos de compilación e Hot Module Replacement (HMR) casi instantáneos, fundamentales para iterar rápido. React permite construir interfaces de usuario modulares y reactivas (perfecto para renderizar las llaves o el *leaderboard* dinámico).

- **Estilado**: **Tailwind CSS**. Evita escribir hojas de estilos CSS personalizadas. Permite diseñar interfaces totalmente responsivas mediante clases utilitarias directamente en el código HTML/JSX.

- **Librerías Clave**:

  - Peticiones HTTP a través de fetch API JS vanilla


  - `lucide-react` para iconos modernos y ligeros.

  - `react-router-dom` para el manejo de rutas en el cliente (Login, Dashboard, Pronósticos, Posiciones).

### B. Backend: NestJS (Node.js framework)

- **¿Por qué?**: NestJS provee una arquitectura modular lista para usar (controladores, servicios, módulos). Elimina la necesidad de tomar decisiones de diseño estructural, lo que ahorra valiosas horas al inicio del proyecto.

- **Características**:

  - **TypeScript nativo**: Detección de errores en tiempo de compilación y autocompletado excelente.

  - **Mecanismos integrados**: Validaciones automáticas de peticiones entrantes usando `class-validator` y `class-transformer`.

  - **Autenticación**: `Passport.js` integrado con estrategia JWT (`@nestjs/jwt`) para sesiones stateless seguras.

### C. Base de Datos y ORM: SQLite + Prisma ORM

- **¿Por qué?**: Configurar un motor de base de datos como PostgreSQL o MySQL consume tiempo de aprovisionamiento. SQLite almacena todo en un único archivo local (`dev.db`), ideal para el desarrollo rápido y entornos dockerizados simples.

- **Prisma ORM**: Actúa como puente entre NestJS y SQLite.

  - Ofrece autogeneración del cliente TypeScript basado en el esquema.

  - Facilita las migraciones de base de datos en una sola línea de comando (`npx prisma migrate dev`).

  - Evita la escritura manual de consultas SQL complejas previniendo inyecciones SQL de forma nativa.

### D. Infraestructura y Despliegue: Docker & Docker Compose

- **¿Por qué?**: Asegura que la aplicación se compile y ejecute exactamente igual en tu entorno local que en cualquier servidor de producción.

- **Uso**: Orquesta el frontend (servido con un contenedor ultraligero de Nginx) y el backend en Node.js, configurando la persistencia física del archivo SQLite de manera sencilla mediante volúmenes de Docker.