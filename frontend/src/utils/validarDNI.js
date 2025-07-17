// frontend/src/utils/validarDNI.js

export function validarDNIoNIE(dni) {
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  dni = dni.toUpperCase().trim();

  if (/^[XYZ]\d{7}[A-Z]$/.test(dni)) {
    const nieNum = dni
      .replace("X", "0")
      .replace("Y", "1")
      .replace("Z", "2");
    const numero = nieNum.slice(0, 8);
    const letraEsperada = letras[numero % 23];
    return dni[8] === letraEsperada;
  }

  if (/^\d{8}[A-Z]$/.test(dni)) {
    const numero = dni.slice(0, 8);
    const letraEsperada = letras[numero % 23];
    return dni[8] === letraEsperada;
  }

  return false;
}
