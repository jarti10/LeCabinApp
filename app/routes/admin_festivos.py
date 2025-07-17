from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import List
import os
import json

router = APIRouter()

# Ruta absoluta al archivo festivos.json
FESTIVOS_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "festivos.json"))

@router.get("/admin/festivos", response_model=List[str])
def get_festivos():
    try:
        with open(FESTIVOS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al leer festivos.json: {e}")

@router.post("/admin/festivos")
def set_festivos(fechas: List[str]):
    try:
        with open(FESTIVOS_FILE, "w", encoding="utf-8") as f:
            json.dump(fechas, f, indent=2, ensure_ascii=False)
        return JSONResponse(content={"mensaje": "Festivos actualizados"}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar festivos.json: {e}")
