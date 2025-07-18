from app.database import SessionLocal
from app.models import Clase

def actualizar_cupo_maximo():
    db = SessionLocal()
    try:
        clases_actualizadas = 0
        clases = db.query(Clase).all()
        for clase in clases:
            if clase.cupo_maximo != 7:
                clase.cupo_maximo = 7
                clases_actualizadas += 1
        db.commit()
        print(f"✅ Clases actualizadas: {clases_actualizadas}")
    except Exception as e:
        print(f"❌ Error actualizando cupos: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    actualizar_cupo_maximo()
