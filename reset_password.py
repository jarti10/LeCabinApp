"""
reset_password.py

📌 Este script permite cambiar manualmente la contraseña de cualquier usuario
a partir de su email. Ideal para soporte, recuperación de acceso o testeo.

💡 Puedes modificar los valores de `email_objetivo` y `nueva_password` antes de ejecutar.
"""

from app.database import SessionLocal
from app.models import User
from app.utils.security import hash_password

# Configura aquí los datos deseados
email_objetivo = "user@lecabin.com"
nueva_password = "nuevo1234"

db = SessionLocal()

usuario = db.query(User).filter(User.email == email_objetivo).first()

if usuario:
    usuario.hashed_password = hash_password(nueva_password)
    db.commit()
    print(f"✅ Contraseña actualizada para {email_objetivo}")
else:
    print("❌ Usuario no encontrado")

db.close()
