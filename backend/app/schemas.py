# backend/app/schemas.py

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# -------------------- PacienteInfo --------------------

class PacienteInfoBase(BaseModel):
    nombre: str
    apellido1: str
    apellido2: str
    telefono: str
    dni: str
    codigo_postal: str

class PacienteInfoCreate(PacienteInfoBase):
    pass

class PacienteInfoOut(PacienteInfoBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True

# -------------------- Consentimiento --------------------

class ConsentimientoOut(BaseModel):
    id: int
    fecha_aceptacion: datetime
    version: str

    class Config:
        orm_mode = True
        from_attributes = True

# -------------------- Usuario --------------------

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    acepta_terminos: bool
    info: PacienteInfoCreate

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    info: Optional[PacienteInfoOut]
    consentimientos: Optional[List[ConsentimientoOut]] = []

    class Config:
        orm_mode = True
        from_attributes = True

# -------------------- Token --------------------

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# -------------------- Clase --------------------

class ClaseBase(BaseModel):
    titulo: str
    fecha: datetime
    cupo_maximo: int

class ClaseCreate(ClaseBase):
    pass

class ClaseOut(ClaseBase):
    id: int
    sala: Optional[str] = None
    instructor: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True

class ClaseConCupoOut(ClaseOut):
    cupo_disponible: int

# -------------------- ReservaClase --------------------

class ReservaClaseCreate(BaseModel):
    clase_id: int

class ReservaClaseOut(BaseModel):
    id: int
    clase_id: int
    user_id: int
    estado: str
    creada_en: datetime
    clase: ClaseOut  # ✅ necesario para MisReservas.jsx

    class Config:
        orm_mode = True
        from_attributes = True

# -------------------- Mensaje --------------------

class Mensaje(BaseModel):
    mensaje: str
