from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./le_cabin.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

def create_db():
    from models import *
    Base.metadata.create_all(bind=engine)

# ✅ Esta es la función que usan los routers para acceder a la DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
