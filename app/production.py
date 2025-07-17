from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, clases, reservas, admin

app = FastAPI()

# Configura CORS para permitir frontend en Vercel y localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://le-cabin-app.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra todos los routers (no recrea base de datos en producción)
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(clases.router, prefix="/clases", tags=["clases"])
app.include_router(reservas.router, prefix="/reservas", tags=["reservas"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])

@app.get("/")
def root():
    return {"message": "Le Cabin App API"}
