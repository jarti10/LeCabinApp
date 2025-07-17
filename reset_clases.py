# reset_clases.py

import os
import shutil
from datetime import datetime
from app.database import SessionLocal
from app.models import Clase, ReservaClase

# Ruta de la base de datos SQLite
DB_PATH = "le_cabin.db"

# Carpeta de backups
BACKUP_FOLDER = "backups"
os.makedirs(BACKUP_FOLDER, exist_ok=True)

# Nombre del archivo de backup con timestamp
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
backup_path = os.path.join(BACKUP_FOLDER, f"backup_clases_{timestamp}.db")

# Copiar base de datos como respaldo
shutil.copy(DB_PATH, backup_path)
print(f"✅ Backup creado en: {backup_path}")

# Limpiar clases y reservas
db = SessionLocal()

num_reservas = db.query(ReservaClase).delete()
num_clases = db.query(Clase).delete()

db.commit()
db.close()

print(f"🧹 Eliminadas {num_reservas} reservas y {num_clases} clases.")
