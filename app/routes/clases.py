# backend/app/routes/clases.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime, time
from typing import List
from app.database import get_db
from app.models import Clase, ReservaClase
from app.schemas import ClaseConCupoOut

router = APIRouter()

@router.get("/", response_model=List[ClaseConCupoOut])
def listar_clases_por_fecha(
    fecha: date = Query(..., description="Fecha en formato YYYY-MM-DD"),
    db: Session = Depends(get_db)
):
    """
    Devuelve todas las clases de un día concreto con el cupo disponible
    recalculado en tiempo real (cupo_maximo - reservas activas).
    """
    # Rango completo de ese día
    inicio = datetime.combine(fecha, time.min)
    fin = datetime.combine(fecha, time.max)

    clases = db.query(Clase).filter(
        Clase.fecha >= inicio,
        Clase.fecha <= fin
    ).all()

    resultado = []
    for clase in clases:
        # Contar reservas activas
        total_activas = db.query(func.count(ReservaClase.id)).filter(
            ReservaClase.clase_id == clase.id,
            ReservaClase.estado == "activa"
        ).scalar() or 0

        # Calcular disponible
        disponible = clase.cupo_maximo - total_activas

        # Construir el esquema pydantic
        esquema = ClaseConCupoOut(
            id=clase.id,
            titulo=clase.titulo,
            fecha=clase.fecha,
            cupo_maximo=clase.cupo_maximo,
            sala=clase.sala,
            instructor=clase.instructor,
            cupo_disponible=disponible,
        )
        resultado.append(esquema)

    return resultado
