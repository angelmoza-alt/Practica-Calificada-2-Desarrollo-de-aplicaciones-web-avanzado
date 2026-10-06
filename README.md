# 💊 Farmacia FullStack: Evaluación 02 (Semana 08)

**Alumno:** Angel Moza Cabanillas · **Curso:** Desarrollo de Aplicaciones Web Avanzado · **Grupo:** A · **Ciclo:** V

Aplicación web fullstack con **Node.js + Express + Sequelize (MySQL) + JWT** en el backend y **React (Vite) + Bootstrap 5** en el frontend.

---

## ✅ Requisitos del laboratorio y dónde se cumplen

| Requisito | Dónde está |
|---|---|
| JWT Authentication en Node.js | `backend/app/controllers/auth.controller.js`, `backend/app/middlewares/authJwt.js` |
| Crear la BD `bd_farmacia` con Sequelize | `backend/app/database/init.js` → `crearBaseDeDatos()` |
| 2 tablas relacionadas con Sequelize | `backend/app/models/laboratorio.model.js`, `medicamento.model.js` |
| Relaciones con Sequelize | `backend/app/models/index.js` → `hasMany` / `belongsTo` (Laboratorio 1:N Medicamento) |
| CRUD con Sequelize | `backend/app/controllers/laboratorio.controller.js`, `medicamento.controller.js` |
| Insertar registros con Sequelize | `backend/app/database/init.js` → `insertarDatosIniciales()` (`bulkCreate`) |
| Login, logout y registro | `frontend/src/pages/Login.jsx`, `Register.jsx`, menú de usuario de la navbar |
| Validación en el front antes de enviar | `frontend/src/utils/validators.js` (se usa en todos los formularios) |
| Navbar que cambia según el rol | `frontend/src/components/Navbar.jsx` |
| Menú principal al iniciar sesión | `frontend/src/pages/Home.jsx` (ruta `/menu`) |
| Diseño de las 2 tablas relacionadas | `frontend/src/pages/Laboratorios.jsx`, `Medicamentos.jsx` + `docs/diagrama_bd.png` |
| Despliegue | Ver la sección **Despliegue** (Render + Vercel + Aiven) |

### Buenas prácticas aplicadas
- Arquitectura por capas: `config / models / controllers / routes / middlewares`.
- Variables de entorno (`.env`): no hay contraseñas ni claves dentro del código.
- Contraseñas cifradas con **bcrypt**. El JWT se firma con HS256 y expira en 24 h.
- Validación **doble**: en el frontend (experiencia de usuario) y en el backend (seguridad).
- Manejo centralizado de errores (`errorHandler.js`), cabeceras seguras con `helmet` y CORS restringido.
- Permisos en el backend por rol (no solo se ocultan botones en el front).
- Integridad referencial: no se puede eliminar un laboratorio que tiene medicamentos.

---

## 📁 Estructura

```
farmacia-fullstack/
├── docker-compose.yml        # MySQL 8 + Adminer con Docker
├── backend/                  # API REST (puerto 8080)
│   ├── server.js
│   └── app/
│       ├── config/           # db.config.js, auth.config.js
│       ├── models/           # user, role, laboratorio, medicamento + relaciones
│       ├── database/         # init.js (crea BD, tablas e inserta datos), reset.js
│       ├── middlewares/      # authJwt, validators, errorHandler
│       ├── controllers/
│       └── routes/
├── frontend/                 # React + Vite (puerto 5173)
│   └── src/
│       ├── components/       # Navbar, ProtectedRoute, Modal, Field...
│       ├── context/          # AuthContext (sesión y roles)
│       ├── pages/            # Login, Register, Home, Medicamentos, Laboratorios...
│       ├── services/         # axios + interceptor JWT
│       └── utils/            # validaciones del front
└── docs/
    ├── diagrama_bd.png       # diagrama entidad-relación
    └── capturas/             # capturas de referencia de cada pantalla
```

---

## ▶️ Ejecutar en tu PC

### 1. Requisitos
- **Node.js 18 o superior** (`node -v`)
- **MySQL**: con **Docker Desktop** (recomendado) o con XAMPP

### 2. Levantar MySQL
**Opción A: Docker (recomendado)**
```bash
docker compose up -d
```
Así queda MySQL en `localhost:3306` (usuario `root`, contraseña `root`). Para ver las tablas, abre **Adminer** en http://localhost:8081 (Servidor `mysql`, usuario `root`, contraseña `root`).
> Si XAMPP está abierto con MySQL encendido, apágalo primero porque los dos usan el puerto 3306.

**Opción B: XAMPP**: enciende MySQL y, después de crear `backend/.env` en el paso 3, cambia `DB_PASSWORD=` (vacío, porque XAMPP no trae contraseña).

### 3. Backend
```bash
cd backend
copy .env.example .env
npm install
npm run dev
```
Si ves esto, todo está bien:
```
✔ Base de datos "bd_farmacia" lista
✔ Tablas sincronizadas
✔ Roles insertados
✔ Usuarios de prueba insertados (contraseña: 123456)
✔ Laboratorios insertados
✔ Medicamentos insertados
🚀 Servidor en http://localhost:8080
```
> `npm run db:reset` borra y vuelve a crear todas las tablas con los datos iniciales.

### 4. Frontend (en otra terminal)
```bash
cd frontend
npm install
npm run dev
```
Abre http://localhost:5173

---

## 👥 Usuarios de prueba y permisos

Todos usan la contraseña **`123456`**.

| Usuario | Rol | Navbar | Puede |
|---|---|---|---|
| `usuario` | user | Inicio · Medicamentos · Laboratorios | Solo consultar |
| `moderador` | moderator | Inicio · **Almacén ▾** · **Panel Moderador** | Consultar, crear y editar |
| `admin` | admin | Inicio · Almacén ▾ · Panel Moderador · **Administración ▾** | Todo, incluido eliminar y gestionar roles |

Los usuarios que se registran reciben el rol `user`. El admin puede darles más roles desde **Administración → Usuarios y roles**.

---

## 🔌 Endpoints de la API

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/auth/signup` | Público |
| POST | `/api/auth/signin` | Público (devuelve `accessToken`) |
| GET | `/api/users/me` · `/api/users/stats` | Logueado |
| GET · PUT · DELETE | `/api/users` · `/api/users/:id/roles` · `/api/users/:id` | Admin |
| GET | `/api/laboratorios` · `/api/laboratorios/:id` | Logueado |
| POST · PUT | `/api/laboratorios` · `/api/laboratorios/:id` | Moderador / Admin |
| DELETE | `/api/laboratorios/:id` | Admin |
| GET | `/api/medicamentos?q=&codLab=` · `/api/medicamentos/:id` | Logueado |
| POST · PUT | `/api/medicamentos` · `/api/medicamentos/:id` | Moderador / Admin |
| DELETE | `/api/medicamentos/:id` | Admin |

El token se envía en el header `Authorization: Bearer <token>`.

---

## 🚀 Despliegue (gratis)

Usamos 3 servicios: **Aiven** (MySQL), **Render** (backend) y **Vercel** (frontend).

### Paso 0: Subir el proyecto a GitHub
```bash
cd farmacia-fullstack
git init
git add .
git commit -m "Farmacia fullstack - EC02"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/farmacia-fullstack.git
git push -u origin main
```
(Los archivos `.env` y `node_modules` no se suben, porque están en `.gitignore`.)

### Paso 1: Base de datos MySQL en Aiven
1. Entra a https://aiven.io y crea una cuenta gratis.
2. **Create service → MySQL → Free plan**.
3. Cuando esté *Running*, copia **Host, Port, User y Password**.

### Paso 2: Backend en Render
1. Entra a https://render.com → **New → Web Service** → conecta tu repo.
2. Configura:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** Free
3. En **Environment** agrega estas variables:
   ```
   DB_HOST=<host de Aiven>
   DB_PORT=<puerto de Aiven>
   DB_USER=avnadmin
   DB_PASSWORD=<password de Aiven>
   DB_NAME=bd_farmacia
   DB_SSL=true
   JWT_SECRET=<una frase larga y secreta>
   CORS_ORIGIN=http://localhost:5173
   ```
4. Dale a Deploy. En los logs debe salir `🚀 Servidor...`. Copia la URL (ej. `https://farmacia-api.onrender.com`).

### Paso 3: Frontend en Vercel
1. Entra a https://vercel.com → **Add New → Project** → importa el mismo repo.
2. **Root Directory:** `frontend` (Vercel detecta Vite solo).
3. En **Environment Variables** agrega:
   ```
   VITE_API_URL=https://farmacia-api.onrender.com/api
   ```
4. Dale a Deploy y copia la URL (ej. `https://farmacia-angel.vercel.app`).

### Paso 4: Permitir el frontend en el backend
En Render cambia `CORS_ORIGIN` por la URL de Vercel y guarda (se redeploya solo):
```
CORS_ORIGIN=https://farmacia-angel.vercel.app,http://localhost:5173
```

✅ **Ese link de Vercel es el que compartes con el profesor.**

> En el plan gratis, Render "duerme" el backend después de 15 minutos sin uso, y la primera petición tarda unos 50 segundos. Antes de presentar, abre el link una vez para despertarlo.
