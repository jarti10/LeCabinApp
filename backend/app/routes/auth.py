from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from database import get_db
from models import User, Consentimiento, PacienteInfo
from schemas import UserCreate, Token, UserOut
from utils.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
)
from utils.validators import validar_dni_nie

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserOut)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    if not user_data.acepta_terminos:
        raise HTTPException(status_code=400, detail="Debes aceptar los términos y condiciones")
    if not validar_dni_nie(user_data.info.dni):
        raise HTTPException(status_code=400, detail="DNI/NIE no válido")

    new_user = User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        role="user",
        acepta_terminos=1,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    info = PacienteInfo(
        user_id=new_user.id,
        nombre=user_data.info.nombre,
        apellido1=user_data.info.apellido1,
        apellido2=user_data.info.apellido2,
        telefono=user_data.info.telefono,
        dni=user_data.info.dni,
        codigo_postal=user_data.info.codigo_postal,
    )
    db.add(info)

    consentimiento = Consentimiento(
        user_id=new_user.id,
        fecha_aceptacion=datetime.utcnow(),
        version="v1.0",
    )
    db.add(consentimiento)

    with open("consentimientos.txt", "a", encoding="utf-8") as f:
        f.write(f"{datetime.now().isoformat()} - {new_user.email} aceptó los términos.\n")

    db.commit()
    return new_user

@router.post("/login", response_model=Token)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.username).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")
    token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "rol": user.role
    })
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    """
    Devuelve los datos del usuario autenticado.
    """
    return current_user
