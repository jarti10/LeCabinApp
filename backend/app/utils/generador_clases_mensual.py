#!/usr/bin/env python3
# backend/app/utils/generador_clases_mensual.py

import os
import sys
import json
from pathlib import Path
from datetime import date, datetime, timedelta
from calendar import monthrange

# ─── 1. Forzar cwd y PYTHONPATH al root del backend ─────────────────────────────
BACKEND_ROOT = Path(__file__).resolve().parents[2]
os.chdir(BACKEND_ROOT)
sys.path.insert(0, str(BACKEND_ROOT))

# ─── 2. Importar SQLAlchemy, tablas y funciones ─────────────────────────────────
from database import engine, SessionLocal, Base
from models import Clase
from utils.generador_clases import generar_clases_semana

# ─── 3. Crear tablas si no existen ───────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

def cargar_festivos(ruta: str = "festivos.json"):
    """
    Carga la lista de fechas festivas desde un JSON en BACKEND_ROOT.
    Devuelve set de strings "YYYY-MM-DD".
    """
    p = BACKEND_ROOT / ruta
    try:
        with open(p, encoding="utf-8") as f:
            return set(json.load(f))
    except Exception as e:
        print(f"⚠️ No se pudieron cargar festivos: {e}")
        return set()

def generar_clases_mes(db, anyo: int, mes: int):
    """
    Genera todas las clases del mes indicado (solo de lunes a viernes),
    saltando los festivos definidos en festivos.json.
    """
    festivos = cargar_festivos()
    primer_dia = date(anyo, mes, 1)
    total_dias = monthrange(anyo, mes)[1]

    # Calcula el lunes de la primera semana que toca
    primer_lunes = primer_dia - timedelta(days=primer_dia.weekday())

    semana = primer_lunes
    while semana.month <= mes:
        iso_lunes = semana.isoformat()
        # Saltar la semana completa si el lunes es festivo
        if iso_lunes not in festivos:
            print(f"▶️ Generando semana que comienza el {iso_lunes}")
            generar_clases_semana(db, datetime.combine(semana, datetime.min.time()))
        else:
            print(f"⏭️ Semana del {iso_lunes} saltada por ser festivo")
        semana += timedelta(days=7)

    db.commit()

if __name__ == "__main__":
    db = SessionLocal()
    hoy = date.today()
    # Por defecto, genera este mes en curso
    generar_clases_mes(db, hoy.year, hoy.month)
    db.close()
