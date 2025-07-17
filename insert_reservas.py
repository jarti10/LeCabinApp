"""
insert_reservas.py

📌 Este script crea una reserva activa en la base de datos para el usuario 'user@lecabin.com'
en la primera clase disponible. Es útil para poblar datos de ejemplo y probar visualización
de reservas en el Dashboard o en AdminReservas.

💡 Asegúrate de haber ejecutado primero:
- insert_users.py
- insert_clases_reales.py
"""

from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User, Clase, ReservaClase

db: Session = SessionLocal()

# Buscar usuario por email
usuario = db.query(User).filter(User.email == "user@lecabin.com").first()

# Buscar la primera clase disponible en orden cronológico
clase = db.query(Clase).order_by(Clase.fecha).first()

# Crear la reserva si no existe ya
if usuario and clase:
    ya_reservada = db.query(ReservaClase).filter_by(user_id=usuario.id, clase_id=clase.id).first()
    if not ya_reservada:
        reserva = ReservaClase(
            user_id=usuario.id,
            clase_id=clase.id,
            estado="activa"
        )
        db.add(reserva)
        db.commit()
        print(f"✅ Reserva creada: {usuario.email} → {clase.titulo} en {clase.fecha}")
    else:
        print("⚠️ Ya existe una reserva para este usuario y clase.")
else:
    print("❌ No se encontraron usuario o clase.")

db.close()
