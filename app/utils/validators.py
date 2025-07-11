# backend/app/utils/validators.py

def validar_dni_nie(dni: str) -> bool:
    dni = dni.upper().strip()
    letras = "TRWAGMYFPDXBNJZSQVHLCKE"

    if len(dni) != 9:
        return False

    if dni[0] in "XYZ" and dni[1:8].isdigit():
        reemplazo = {"X": "0", "Y": "1", "Z": "2"}
        numero = reemplazo[dni[0]] + dni[1:8]
        letra = letras[int(numero) % 23]
        return dni[8] == letra

    elif dni[:8].isdigit():
        letra = letras[int(dni[:8]) % 23]
        return dni[8] == letra

    return False
