# Polla Mundial 2026 ⚽🏆

Este proyecto consiste en una aplicación web tipo polla (quiniela) para la Copa Mundial de la FIFA 2026. Permite a los usuarios realizar predicciones de partidos, acumular puntos según los resultados reales y ver su posición en un ranking global.

## 🚀 Arquitectura y Tecnologías

El proyecto está estructurado como un monorepo dividido en dos componentes principales:

1. **Backend (`/backend`)**:
   - **Framework**: [NestJS](https://nestjs.com/) (Node.js con TypeScript).
   - **Base de Datos**: SQLite (almacenada localmente en `dev.db`).
   - **ORM**: [Prisma](https://www.prisma.io/) para la definición del esquema y las consultas.
   - **Autenticación**: Autenticación JWT utilizando Passport.

2. **Frontend (`/frontend`)**:
   - **Framework**: [React](https://react.dev/) inicializado con **Vite** y TypeScript.
   - **Estilado**: [Tailwind CSS v4](https://tailwindcss.com/) para una estilización rápida y responsiva.
   - **Iconografía**: Lucide React.
   - **Enrutamiento**: React Router DOM.

## 📂 Estructura del Proyecto

```text
pollaMundial/
├── docker-compose.yml        # Orquestación de contenedores
├── README.md                 # Este archivo
├── backend/                  # API en NestJS
│   ├── prisma/               # Esquema de Prisma, semilla y base de datos local
│   │   ├── schema.prisma     # Definición de tablas y relaciones
│   │   ├── seed.ts           # Script de semilla para insertar fases y partidos
│   │   └── matches.json      # Datos de los 104 partidos generados
│   ├── src/                  # Código fuente de NestJS (módulos)
│   │   ├── auth/             # Módulo de Autenticación (JWT)
│   │   ├── users/            # Módulo de Perfiles y Tablas de Posiciones
│   │   ├── matches/          # Módulo de Calendario y Fases
│   │   ├── predictions/      # Lógica de cálculo y apuestas de usuarios
│   │   └── prisma/           # Cliente Prisma y base de datos
│   └── Dockerfile            # Dockerfile para la API de NestJS
└── frontend/                 # Aplicación de React (Vite)
    ├── src/                  # Código fuente
    │   ├── components/       # Componentes visuales y reutilizables
    │   ├── views/            # Vistas principales (Dashboard, Pronósticos, Posiciones, Login)
    │   └── services/         # Servicios e integración con la API
    └── Dockerfile            # Dockerfile para la App en React
```

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (v20 o superior recomendado)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)

---

## ⚡ Ejecución del Proyecto

### Opción A: Usando Docker (Recomendado)

Esta opción levanta automáticamente el frontend, backend y realiza la configuración de la base de datos de manera aislada.

1. En la raíz del proyecto, ejecuta:
   ```bash
   docker-compose up --build
   ```
2. El **Frontend** estará disponible en: `http://localhost:5173`
3. El **Backend** estará disponible en: `http://localhost:3000`

---

### Opción B: Ejecución Local en Desarrollo

Si prefieres ejecutar los servicios de forma nativa sin Docker:

#### 1. Configurar y Levantar el Backend
1. Entra a la carpeta de backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz de `/backend` con la siguiente variable:
   ```env
   DATABASE_URL="file:./dev.db"
   ```
4. Sincroniza la base de datos de Prisma y ejecuta el script de semillas (seed) para insertar las fases y los 104 partidos de la Copa Mundial 2026:
   ```bash
   npx prisma db push --force-reset
   npx prisma db seed
   ```
5. Inicia el servidor de desarrollo en NestJS:
   ```bash
   npm run start:dev
   ```

#### 2. Configurar y Levantar el Frontend
1. Entra a la carpeta de frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación de desarrollo en Vite:
   ```bash
   npm run dev
   ```

---

## 🏁 Base de Datos y Datos Iniciales (Seed)

La base de datos cuenta con una inicialización automática basada en el calendario oficial de la Copa Mundial de la FIFA 2026:
- **18 Fases creadas**: 12 grupos individuales (Grupo A al Grupo L), Dieciseisavos de Final, Octavos de Final, Cuartos de Final, Semifinales, Tercer Puesto y Final.
- **104 Partidos insertados**: Contiene la fecha y hora oficial del partido convertida a UTC partiendo de la hora oficial de Colombia (UTC-5).
- Los partidos de fase de grupos e instancias eliminatorias cuentan con sus respectivos placeholders de acuerdo a la documentación oficial.
