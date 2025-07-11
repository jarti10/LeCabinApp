# backend/backup_db.py

import os
import shutil
from datetime import datetime

DB_FILE = "le_cabin.db"
BACKUP_DIR = "backups"

def backup_database():
    if not os.path.exists(DB_FILE):
        print("ℹ️ No se encontró una base de datos para respaldar.")
        return

    os.makedirs(BACKUP_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = os.path.join(BACKUP_DIR, f"le_cabin_backup_{timestamp}.db")
    shutil.copy2(DB_FILE, backup_path)
    print(f"✅ Backup creado en: {backup_path}")

if __name__ == "__main__":
    backup_database()
