# backend/app/routes/reservas.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import Clase, ReservaClase, User
from app.schemas import ReservaClaseCreate, ReservaClaseOut, Mensaje
from app.utils.security import get_current_user
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=ReservaClaseOut)
def crear_reserva(reserva: ReservaClaseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    clase = db.query(Clase).filter(Clase.id == reserva.clase_id).first()
    if not clase:
        raise HTTPException(status_code=404, detail="Clase no encontrada")

    if clase.fecha < datetime.now():
        raise HTTPException(status_code=400, detail="No se puede reservar una clase pasada")

    reservas_activas = db.query(ReservaClase).filter(
        ReservaClase.clase_id == clase.id,
        ReservaClase.estado == "activa"
    ).count()

    if reservas_activas >= clase.cupo_maximo:
        raise HTTPException(status_code=400, detail="Clase sin cupo disponible")

    ya_reservado = db.query(ReservaClase).filter(
        ReservaClase.user_id == current_user.id,
        ReservaClase.clase_id == clase.id,
        ReservaClase.estado == "activa"
    ).first()

    if ya_reservado:
        raise HTTPException(status_code=400, detail="Ya tienes una reserva para esta clase")

    nueva = ReservaClase(
        clase_id=clase.id,
        user_id=current_user.id,
        estado="activa",
        creada_en=datetime.utcnow()
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)

    # Cargar clase explícitamente para devolver con joinedload
    reserva_completa = db.query(ReservaClase).options(joinedload(ReservaClase.clase)).get(nueva.id)
    return reserva_completa

@router.get("/", response_model=list[ReservaClaseOut])
def obtener_mis_reservas(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(ReservaClase).options(joinedload(ReservaClase.clase)).filter(
        ReservaClase.user_id == current_user.id,
        ReservaClase.estado == "activa"
    ).order_by(ReservaClase.creada_en.desc()).all()

@router.delete("/{id}", response_model=Mensaje)
def cancelar_reserva(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reserva = db.query(ReservaClase).filter(ReservaClase.id == id).first()

    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")

    if reserva.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="No autorizado para cancelar esta reserva")

    if reserva.estado == "cancelada":
        raise HTTPException(status_code=400, detail="La reserva ya está cancelada")

    reserva.estado = "cancelada"
    reserva.cancelada_en = datetime.utcnow()
    db.commit()

    return {"mensaje": "Reserva cancelada correctamente"}

@router.get("/clase/{clase_id}/admin:{admin_id}", response_model=list[ReservaClaseOut])
def listar_reservas_clase_para_admin(clase_id: int, admin_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.id != admin_id or current_user.role != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")

    return db.query(ReservaClase).options(joinedload(ReservaClase.clase)).filter(
        ReservaClase.clase_id == clase_id
    ).order_by(ReservaClase.creada_en).all()
