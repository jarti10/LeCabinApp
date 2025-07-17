# backend/init_db.py

import os
import shutil
from datetime import datetime
from app.database import Base, engine
from app.models import User, Clase, ReservaClase  # importa tus modelos

DB_FILE = "le_cabin.db"
BACKUP_DIR = "backups"

def backup_database():
    if not os.path.exists(DB_FILE):
        print("ℹ️ No se encontró una base de datos previa para respaldar.")
        return

    os.makedirs(BACKUP_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = os.path.join(BACKUP_DIR, f"le_cabin_backup_{timestamp}.db")
    shutil.copy2(DB_FILE, backup_path)
    print(f"✅ Copia de seguridad creada: {backup_path}")

if __name__ == "__main__":
    print("🔄 Iniciando respaldo de base de datos...")
    backup_database()
    print("📦 Creando las tablas...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas con éxito.")
