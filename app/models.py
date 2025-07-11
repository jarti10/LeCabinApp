from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

# ------------------------ MODELO: Usuario ------------------------

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")
    acepta_terminos = Column(Boolean, default=False)

    reservas = relationship("Reserva", back_populates="user")
    reservas_clase = relationship("ReservaClase", back_populates="user")
    inscripciones_fijas = relationship("InscripcionFija", back_populates="user")
    info = relationship("PacienteInfo", uselist=False, back_populates="user")
    consentimientos = relationship("Consentimiento", back_populates="user")


# ------------------------ MODELO: Consentimiento ------------------------

class Consentimiento(Base):
    __tablename__ = "consentimientos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    fecha_aceptacion = Column(DateTime, default=datetime.utcnow)
    version = Column(String, default="v1.0")

    user = relationship("User", back_populates="consentimientos")


# ------------------------ MODELO: Información del paciente ------------------------

class PacienteInfo(Base):
    __tablename__ = "pacientes_info"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    nombre = Column(String, nullable=False)
    apellido1 = Column(String, nullable=False)
    apellido2 = Column(String, nullable=False)
    dni = Column(String, nullable=False)
    telefono = Column(String, nullable=False)
    codigo_postal = Column(String, nullable=False)

    user = relationship("User", back_populates="info")


# ------------------------ MODELO: Reserva general ------------------------

class Reserva(Base):
    __tablename__ = "reservas"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    fecha = Column(DateTime, nullable=False)
    tipo = Column(String, nullable=False)
    estado = Column(String, default="activa")
    creada_en = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reservas")


# ------------------------ MODELO: Clase grupal ------------------------

class Clase(Base):
    __tablename__ = "clases"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    fecha = Column(DateTime, nullable=False)
    sala = Column(String, nullable=True)
    instructor = Column(String, nullable=True)
    cupo_maximo = Column(Integer, nullable=False, default=7)
    estado = Column(String, default="activa")

    reservas = relationship("ReservaClase", back_populates="clase")


# ------------------------ MODELO: Reserva de clase grupal ------------------------

class ReservaClase(Base):
    __tablename__ = "reservas_clase"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    clase_id = Column(Integer, ForeignKey("clases.id"))

    estado = Column(String, default="activa")
    creada_en = Column(DateTime, default=datetime.utcnow)
    cancelada_en = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="reservas_clase")
    clase = relationship("Clase", back_populates="reservas")


# ------------------------ MODELO: Inscripción fija ------------------------

class InscripcionFija(Base):
    __tablename__ = "inscripciones_fijas"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    titulo_clase = Column(String, nullable=False)
    hora = Column(String, nullable=False)

    user = relationship("User", back_populates="inscripciones_fijas")
