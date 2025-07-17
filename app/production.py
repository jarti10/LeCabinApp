from fastapi import FastAPI
from app.routes import auth, clases, reservas, admin

app = FastAPI()

# Registra todos los routers (no recrea base de datos en producción)
app.include_router(auth.router, prefix="/auth")
app.include_router(clases.router, prefix="/clases")
app.include_router(reservas.router, prefix="/reservas")
app.include_router(admin.router, prefix="/admin")
