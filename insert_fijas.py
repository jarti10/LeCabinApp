# backend/scripts/insert_fijas.py

from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User, InscripcionFija

# Lista de inscripciones fijas a crear
# Formato: (email_usuario, titulo_clase, hora_clase)
inscripciones = [
    ("usuario2@demo.com", "Yoga", "10:00"),
    ("usuario2@demo.com", "Pilates", "18:00"),
    ("usuario1@demo.com", "Zumba", "09:00"),
]

def insertar_fijas(db: Session):
    for email, titulo, hora in inscripciones:
        user = db.query(User).filter_by(email=email).first()
        if not user:
            print(f"⚠️ Usuario no encontrado: {email}")
            continue

        ya_existe = db.query(InscripcionFija).filter_by(
            user_id=user.id, titulo_clase=titulo, hora=hora
        ).first()
        if ya_existe:
            print(f"⏭️ Ya existe inscripción fija para {email}: {titulo} a las {hora}")
            continue

        nueva = InscripcionFija(
            user_id=user.id,
            titulo_clase=titulo,
            hora=hora
        )
        db.add(nueva)
        print(f"✅ Inscripción fija añadida: {email} → {titulo} a las {hora}")

    db.commit()

if __name__ == "__main__":
    db = SessionLocal()
    insertar_fijas(db)
    db.close()
