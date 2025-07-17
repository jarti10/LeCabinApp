from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, clases, reservas, admin  # importa tus routers

app = FastAPI()

# CORS (ajusta orígenes permitidos según tu front)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(clases.router, prefix="/clases", tags=["clases"])
app.include_router(reservas.router, prefix="/reservas", tags=["reservas"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])

# Página raíz opcional
@app.get("/")
def read_root():
    return {"message": "Le Cabin App API"}
