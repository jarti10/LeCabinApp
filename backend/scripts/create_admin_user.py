import sqlite3
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def crear_admin():
    conn = sqlite3.connect("../backend/app/le_cabin.db")
    cursor = conn.cursor()

    email = "admin@lecabin.com"
    password = "admin123"
    hashed = pwd_context.hash(password)

    try:
        cursor.execute("INSERT INTO users (email, hashed_password, role) VALUES (?, ?, ?)", (email, hashed, "admin"))
        conn.commit()
        print("Admin creado exitosamente.")
    except sqlite3.IntegrityError:
        print("Ya existe un admin con ese correo.")
    finally:
        conn.close()

if __name__ == "__main__":
    crear_admin()
