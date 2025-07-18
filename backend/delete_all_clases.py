# delete_all_clases.py

from app.database import SessionLocal
from app.models import Clase, ReservaClase

db = SessionLocal()

# Primero eliminamos las reservas asociadas (por si hay restricciones)
db.query(ReservaClase).delete()
db.query(Clase).delete()

db.commit()
db.close()

print("🧹 Todas las clases y reservas eliminadas correctamente.")
