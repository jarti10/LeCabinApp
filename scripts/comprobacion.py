import sqlite3
import os

# Ruta relativa correcta desde scripts/
DB_PATH = "../backend/le_cabin.db"

# Mostrar ruta completa para depuración
print("Buscando base de datos en:", os.path.abspath(DB_PATH))

# Conexión
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Mostrar usuarios
cursor.execute("SELECT id, email, role FROM users")
rows = cursor.fetchall()

if rows:
    print("📋 Usuarios registrados:")
    for row in rows:
        print(f"ID: {row[0]}, Email: {row[1]}, Rol: {row[2]}")
else:
    print("⚠️ No hay usuarios en la base de datos.")

conn.close()
