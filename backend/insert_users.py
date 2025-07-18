# backend/scripts/insert_users.py

from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User, PacienteInfo, Consentimiento, InscripcionFija
from app.utils.security import get_password_hash
from datetime import datetime

def crear_usuario(db: Session, email, password, role, nombre, apellido1, apellido2, dni, telefono, cp, fija=False, clases_fijas=None):
    # Verificar si ya existe
    if db.query(User).filter_by(email=email).first():
        print(f"⚠️ Usuario {email} ya existe, omitido.")
        return

    # Crear usuario
    hashed = get_password_hash(password)
    user = User(email=email, hashed_password=hashed, role=role, acepta_terminos=1)
    db.add(user)
    db.commit()
    db.refresh(user)

    # Añadir info personal
    info = PacienteInfo(
        user_id=user.id,
        nombre=nombre,
        apellido1=apellido1,
        apellido2=apellido2,
        dni=dni,
        telefono=telefono,
        codigo_postal=cp
    )
    db.add(info)

    # Añadir consentimiento
    consentimiento = Consentimiento(
        user_id=user.id,
        fecha_aceptacion=datetime.utcnow(),
        version="v1.0"
    )
    db.add(consentimiento)

    # Si tiene clases fijas, añadirlas
    if fija and clases_fijas:
        for titulo, hora in clases_fijas:
            inscripcion = InscripcionFija(
                user_id=user.id,
                titulo_clase=titulo,
                hora=hora
            )
            db.add(inscripcion)

    db.commit()
    print(f"✅ Usuario {email} creado con éxito")


if __name__ == "__main__":
    db = SessionLocal()

    # Usuario estándar (sin clases fijas)
    crear_usuario(
        db,
        email="usuario1@demo.com",
        password="1234",
        role="user",
        nombre="Laura",
        apellido1="García",
        apellido2="Sánchez",
        dni="12345678Z",
        telefono="612345678",
        cp="28001",
        fija=False
    )

    # Usuario con clases fijas
    crear_usuario(
        db,
        email="usuario2@demo.com",
        password="1234",
        role="user",
        nombre="Pedro",
        apellido1="Martínez",
        apellido2="López",
        dni="87654321T",
        telefono="678901234",
        cp="28002",
        fija=True,
        clases_fijas=[
            ("Yoga", "10:00"),
            ("Pilates", "18:00"),
        ]
    )

    # Admin
    crear_usuario(
        db,
        email="admin@demo.com",
        password="admin123",
        role="admin",
        nombre="Admin",
        apellido1="Cabina",
        apellido2="Central",
        dni="11111111H",
        telefono="600000000",
        cp="28003",
        fija=False
    )

    db.close()
