import sqlite3
from passlib.context import CryptContext

# Configuración
DB_PATH = "../backend/le_cabin.db"
email = "usuario@lecabin.com"
password = "usuario123"
role = "user"

# Encriptar contraseña
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed_password = pwd_context.hash(password)

# Insertar usuario
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
if cursor.fetchone():
    print(f"⚠️ El usuario '{email}' ya existe.")
else:
    cursor.execute(
        "INSERT INTO users (email, hashed_password, role) VALUES (?, ?, ?)",
        (email, hashed_password, role)
    )
    conn.commit()
    print(f"✅ Usuario creado: {email} / {password} (rol: {role})")

conn.close()
