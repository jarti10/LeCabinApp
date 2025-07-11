# backend/insert_clase_futura.py

from datetime import datetime, timedelta
from app.database import SessionLocal
from app.models import Clase

# Crear sesión
db = SessionLocal()

# Fecha de clase: mañana a las 10:00
fecha_hora = datetime.now() + timedelta(days=1)
fecha_hora = fecha_hora.replace(hour=10, minute=0, second=0, microsecond=0)

# Crear clase
nueva_clase = Clase(
    titulo="CLASE DEMO",
    fecha=fecha_hora,
    sala="Sala Test",
    instructor="Instructor Demo",
    cupo_maximo=15,
    estado="activa"
)

db.add(nueva_clase)
db.commit()
db.close()

print(f"✅ Clase creada para {fecha_hora.strftime('%Y-%m-%d %H:%M')}")
