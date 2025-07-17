import sqlite3
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def resetear_admin():
    conn = sqlite3.connect("../backend/app/le_cabin.db")
    cursor = conn.cursor()

    email = "admin@lecabin.com"
    password = "admin123"
    hashed = pwd_context.hash(password)

    cursor.execute("DELETE FROM users WHERE email = ?", (email,))
    cursor.execute("INSERT INTO users (email, hashed_password, role) VALUES (?, ?, ?)", (email, hashed, "admin"))
    conn.commit()
    print("Admin reseteado exitosamente.")
    conn.close()

if __name__ == "__main__":
    resetear_admin()
