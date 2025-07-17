# Le Cabin App – Digitalización del Centro de Fisioterapia

Este proyecto es una plataforma web en desarrollo para Le Cabinet Osasun Gunea, un centro de fisioterapia ubicado en Getxo, Bizkaia. La aplicación permitirá a los pacientes registrarse, gestionar reservas y acceder a planes mensuales, todo desde una interfaz moderna y escalable.

---

## ✅ Progreso hasta ahora

### 1. Estructura del proyecto
- `backend/`: API en FastAPI con base de datos SQLite
- `frontend/`: React SPA (por construir en la próxima sesión)

### 2. Backend terminado (hasta login funcional)
- `main.py`: inicio de FastAPI y conexión de rutas
- `database.py`: configuración SQLite + SQLAlchemy
- `models.py`: tabla `users`
- `schemas.py`: validaciones con Pydantic
- `utils/security.py`: hash de contraseñas y JWT
- `routes/auth.py`: rutas para `/auth/register` y `/auth/login`
- `.env`: secreto de desarrollo

### 3. Estado del servidor
- Servidor FastAPI funcionando en `http://127.0.0.1:8000`
- Swagger UI en `http://127.0.0.1:8000/docs`
- Registro y login funcionando, devuelve JWT

---

## 🔜 Próximos pasos

### Fase 1 – Frontend con React
- Crear estructura de componentes y páginas
- Formularios de login y registro
- Conexión al backend con axios

### Fase 2 – Rutas protegidas + dashboard
- Guardar token JWT en localStorage
- Proteger rutas con autenticación

### Fase 3 – Sistema de reservas
- Modelo y API de reservas
- Calendario en frontend
- Reglas de cancelación

### Fase 4 – Agente inteligente de agenda
- Integración con IA para gestionar disponibilidad
- Recordatorios automáticos y recomendaciones

---

## Autor
- Desarrollador: jarti10
- Proyecto basado en el centro de fisioterapia [Le Cabinet Osasun Gunea](https://lecabinetosasungunea.com/)