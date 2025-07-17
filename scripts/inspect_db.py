import os
import sqlite3

DB_PATH = "../backend/app/le_cabin.db"

def imprimir_contenido(tabla):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {tabla}")
    filas = cursor.fetchall()
    for fila in filas:
        print(fila)
    conn.close()

if __name__ == "__main__":
    tablas = ["users", "pacientes_info", "reservas", "clases", "reservas_clase", "inscripciones_fijas"]
    for t in tablas:
        print(f"Contenido de la tabla '{t}':")
        imprimir_contenido(t)
        print("-" * 40)
