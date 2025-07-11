import json
from datetime import datetime, date
import os

FESTIVOS_PATH = os.path.join(os.path.dirname(__file__), "../data/festivos.json")

def cargar_festivos():
    try:
        with open(FESTIVOS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return [datetime.strptime(d, "%Y-%m-%d").date() for d in data]
    except Exception as e:
        print(f"⚠️ Error cargando festivos.json: {e}")
        return []

# Carga una sola vez al importar
FESTIVOS = cargar_festivos()

def es_festivo(fecha: date) -> bool:
    return fecha in FESTIVOS
