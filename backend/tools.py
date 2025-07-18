# tools.py – herramientas de mantenimiento backend

from app.database import SessionLocal
from app.models import Clase
from collections import defaultdict

def eliminar_duplicados_clases():
    db = SessionLocal()
    clases = db.query(Clase).order_by(Clase.fecha).all()
    duplicados = defaultdict(list)
    for clase in clases:
        clave = (clase.titulo, clase.fecha)
        duplicados[clave].append(clase)

    eliminadas = 0
    for lista in duplicados.values():
        for clase in lista[1:]:
            db.delete(clase)
            eliminadas += 1

    db.commit()
    db.close()
    print(f"✅ Clases duplicadas eliminadas: {eliminadas}")

if __name__ == "__main__":
    print("Herramientas de mantenimiento disponibles:")
    print("1. Eliminar duplicados de clases")
    opcion = input("Selecciona una opción (número): ")

    if opcion == "1":
        eliminar_duplicados_clases()
    else:
        print("❌ Opción no válida.")
