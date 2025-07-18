from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.database import get_db
from app.models import ReservaClase, Clase, User
from app.schemas import ReservaClaseCreate, ReservaClaseOut
from app.utils.security import get_current_user
from app.utils.festivos import es_festivo

router = APIRouter()

@router.post("/reservas", response_model=ReservaClaseOut)
def crear_reserva(
    reserva_data: ReservaClaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    clase = db.query(Clase).filter(Clase.id == reserva_data.clase_id).first()

    if not clase:
        raise HTTPException(status_code=404, detail="Clase no encontrada")

    hoy = datetime.utcnow().date()
    fecha_clase = clase.fecha.date()

    # Validar que sea dentro de los próximos 5 días
    if not (hoy <= fecha_clase <= hoy + timedelta(days=5)):
        raise HTTPException(status_code=400, detail="Solo puedes reservar clases en los próximos 5 días")

    # Validar que no sea día festivo
    if es_festivo(fecha_clase):
        raise HTTPException(status_code=400, detail="No se puede reservar en días festivos")

    # Verificar si ya tiene reserva en esa clase
    existe = db.query(ReservaClase).filter_by(user_id=current_user.id, clase_id=clase.id, estado="activa").first()
    if existe:
        raise HTTPException(status_code=400, detail="Ya tienes una reserva activa para esta clase")

    reserva = ReservaClase(
        user_id=current_user.id,
        clase_id=clase.id,
    )

    db.add(reserva)
    db.commit()
    db.refresh(reserva)

    return reserva
