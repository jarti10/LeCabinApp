# backend/app/routes/admin.py

from fastapi import APIRouter, HTTPException, Depends
from typing import Any
from sqlalchemy.orm import Session

from app.database import get_db
from app.utils.generador_clases_mensual import generar_clases_mes, cargar_festivos

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/festivos/cargar")
def ruta_cargar_festivos(ruta: str = "festivos.json") -> Any:
    """
    Ruta para cargar y mostrar los festivos disponibles.
    """
    festivos = cargar_festivos(ruta)
    if not festivos:
        raise HTTPException(status_code=404, detail="No se encontraron festivos")
    return {"festivos": festivos}

@router.post("/clases/generar/{anyo}/{mes}")
def ruta_generar_clases(
    anyo: int,
    mes: int,
    db: Session = Depends(get_db),
):
    """
    Genera todas las clases del mes indicado (saltando fines de semana y festivos).
    """
    try:
        generar_clases_mes(db, anyo, mes)
        return {"mensaje": f"Clases generadas para {anyo}-{mes:02d}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
