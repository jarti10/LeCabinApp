# LeCabinApp – Monorepo

Este repositorio contiene el código completo de **LeCabinApp**, una aplicación de reservas para clases de bienestar. El monorepo incluye tanto el backend (API con FastAPI) como el frontend (React + Vite).

---

## 📁 Estructura del proyecto

```
LeCabinApp/
├── backend/        # Backend FastAPI (API, modelos, BD)
├── frontend/       # Frontend React + Vite + Tailwind
├── scripts/        # Scripts auxiliares (inserción de datos, backups)
├── .env            # (no incluido) Variables de entorno para producción local
└── README.md       # Este archivo
```

---

## 🚀 Despliegue

### Backend (Render)

1. Subido desde la carpeta `backend/`
2. Base de datos: PostgreSQL
3. Variables necesarias:
   - `SECRET_KEY`
   - `ALGORITHM=HS256`
   - `DATABASE_URL` (formato PostgreSQL)
4. Accesible en: `https://le-cabin-backend.onrender.com`

### Frontend (Vercel)

1. Subido desde la carpeta `frontend/`
2. Framework: `Vite`
3. Variables de entorno:
   ```
   VITE_API_URL=https://le-cabin-backend.onrender.com
   ```
4. Directorio de salida: `dist`

---

## 🧪 Desarrollo local

### Backend

```bash
cd backend
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 Stack Tecnológico

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: FastAPI + SQLAlchemy
- **Base de Datos**: SQLite (dev) / PostgreSQL (prod)
- **Deploy**: Vercel (frontend) + Render (backend)

---

## 🧩 Scripts Útiles

- `init_db.py` → Inicializa la base de datos
- `insert_users.py`, `insert_reservas.py`, etc.
- `backup_db.py` → Crea backups automáticos

---

## 📄 Licencia

MIT - libre para modificar y distribuir con atribución.
