#!/usr/bin/env python3
# backend/app/utils/generador_clases.py

import os
import sys
from pathlib import Path
from datetime import datetime, timedelta

# ─── 1. Forzar cwd y PYTHONPATH al root del backend ─────────────────────────────
# Partimos de backend/app/utils ⇒ dos niveles arriba está el root “backend”
BACKEND_ROOT = Path(__file__).resolve().parents[2]
os.chdir(BACKEND_ROOT)                # ⇒ cwd en backend
sys.path.insert(0, str(BACKEND_ROOT)) # ⇒ para que “import *” funcione

# ─── 2. Importar SQLAlchemy, Base y modelos ──────────────────────────────────────
from database import engine, SessionLocal, Base
from models import Clase

# ─── 3. Crear tablas si no existen ───────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ─── 4. Horario semanal (lunes=0 … viernes=4) ────────────────────────────────────
HORARIO_SEMANAL = [
    # LUNES
    {"dia": 0, "hora": "13:00", "titulo": "STRETCHING GLOBAL ACTIVO"},
    {"dia": 0, "hora": "17:00", "titulo": "STRETCHING GLOBAL ACTIVO"},
    {"dia": 0, "hora": "18:00", "titulo": "STRETCHING GLOBAL ACTIVO"},
    {"dia": 0, "hora": "19:00", "titulo": "STRETCHING GLOBAL ACTIVO"},
    {"dia": 0, "hora": "20:00", "titulo": "CALISTENIA"},

    # MARTES
    {"dia": 1, "hora": "11:00", "titulo": "EMBARAZO"},
    {"dia": 1, "hora": "12:00", "titulo": "MOVILIDAD"},
    {"dia": 1, "hora": "17:00", "titulo": "BARRE"},
    {"dia": 1, "hora": "18:00", "titulo": "BARRE"},
    {"dia": 1, "hora": "19:00", "titulo": "BARRE"},
    {"dia": 1, "hora": "20:00", "titulo": "BARRE"},

    # MIÉRCOLES
    {"dia": 2, "hora": "12:00", "titulo": "CALISTENIA"},
    {"dia": 2, "hora": "17:00", "titulo": "SUELO PÉLVICO"},
    {"dia": 2, "hora": "18:00", "titulo": "EMBARAZO"},
    {"dia": 2, "hora": "19:00", "titulo": "SUELO PÉLVICO"},
    {"dia": 2, "hora": "20:00", "titulo": "CALISTENIA"},

    # JUEVES
    {"dia": 3, "hora": "10:00", "titulo": "BARRE"},
    {"dia": 3, "hora": "11:00", "titulo": "EMBARAZO"},
    {"dia": 3, "hora": "12:00", "titulo": "MOVILIDAD"},
    {"dia": 3, "hora": "17:00", "titulo": "BARRE"},
    {"dia": 3, "hora": "18:00", "titulo": "BARRE"},
    {"dia": 3, "hora": "19:00", "titulo": "BARRE"},
    {"dia": 3, "hora": "20:00", "titulo": "BARRE"},

    # VIERNES
    {"dia": 4, "hora": "12:00", "titulo": "CALISTENIA"},
    {"dia": 4, "hora": "17:00", "titulo": "BARRE"},
    {"dia": 4, "hora": "18:00", "titulo": "BARRE"},
    {"dia": 4, "hora": "19:00", "titulo": "BARRE"},
    {"dia": 4, "hora": "20:00", "titulo": "BARRE"},
]

# ─── 5. Constantes ──────────────────────────────────────────────────────────────
INSTRUCTOR_POR_DEFECTO = "Nora"
SALA_POR_DEFECTO       = "Sala Principal"
CUPO_MAXIMO            = 7

def generar_clases_semana(db, lunes: datetime):
    """
    Genera en la BD todas las clases de la semana que empieza en `lunes`
    (fecha con hora=00:00), según HORARIO_SEMANAL.
    """
    for item in HORARIO_SEMANAL:
        dia_offset = item["dia"]          # ← aquí YA está en 0–4, sin restas
        hora_str   = item["hora"]
        titulo     = item["titulo"]

        # Fecha y hora exacta de la clase
        fecha_base  = lunes + timedelta(days=dia_offset)
        h, m        = map(int, hora_str.split(":"))
        fecha_clase = fecha_base.replace(hour=h, minute=m, second=0, microsecond=0)

        # Si ya existe, lo saltamos
        if db.query(Clase).filter(Clase.titulo == titulo, Clase.fecha == fecha_clase).first():
            print(f"⏭️ Ya existe: {titulo} – {fecha_clase}")
            continue

        # Crear la clase
        nueva = Clase(
            titulo       = titulo,
            fecha        = fecha_clase,
            sala         = SALA_POR_DEFECTO,
            instructor   = INSTRUCTOR_POR_DEFECTO,
            cupo_maximo  = CUPO_MAXIMO,
            estado       = "activa"
        )
        db.add(nueva)
        print(f"✅ Creada: {titulo} – {fecha_clase}")

    db.commit()

if __name__ == "__main__":
    db    = SessionLocal()
    hoy   = datetime.today()
    lunes = (hoy - timedelta(days=hoy.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
    generar_clases_semana(db, lunes)
    db.close()
