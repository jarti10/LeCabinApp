from app.database import SessionLocal
from app.models import User

def listar_usuarios():
    db = SessionLocal()
    usuarios = db.query(User).all()
    for usuario in usuarios:
        print(f"ID: {usuario.id} | Email: {usuario.email} | Password (hash): {usuario.hashed_password}")
    db.close()

if __name__ == "__main__":
    listar_usuarios()
