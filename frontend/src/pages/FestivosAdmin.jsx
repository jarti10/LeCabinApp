import { useEffect, useState } from "react";
import api from "../api";

function FestivosAdmin() {
  const [festivos, setFestivos] = useState([]);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargarFestivos = async () => {
    try {
      const res = await api.get("/admin/festivos");
      setFestivos(res.data);
    } catch (err) {
      console.error("Error al cargar festivos:", err);
    }
  };

  const agregarFestivo = (fecha) => {
    setMensaje("");
    setError("");

    if (!fecha || festivos.includes(fecha)) return;

    setFestivos([...festivos, fecha]);
    setNuevaFecha(""); // limpia el input
  };

  const eliminarFestivo = (fecha) => {
    setFestivos(festivos.filter((f) => f !== fecha));
  };

  const guardarCambios = async () => {
    try {
      await api.post("/admin/festivos", festivos);
      setMensaje("Cambios guardados correctamente ✅");
      setError("");
      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      console.error("Error al guardar:", err);
      setMensaje("");
      setError("Error al guardar los cambios.");
    }
  };

  useEffect(() => {
    cargarFestivos();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Días Festivos</h2>

      {mensaje && <p className="mb-4 text-center text-green-600">{mensaje}</p>}
      {error && <p className="mb-4 text-center text-red-600">{error}</p>}

      <div className="mb-6">
        <label className="block mb-1 font-medium text-sm text-gray-700">Selecciona una fecha para añadir</label>
        <input
          type="date"
          value={nuevaFecha}
          onChange={(e) => {
            const fecha = e.target.value;
            setNuevaFecha(fecha);
            agregarFestivo(fecha);
          }}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <ul className="space-y-2">
        {festivos.sort().map((fecha) => (
          <li
            key={fecha}
            className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
          >
            <span>{fecha}</span>
            <button
              onClick={() => eliminarFestivo(fecha)}
              className="text-red-600 hover:underline text-sm"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-center">
        <button
          onClick={guardarCambios}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

export default FestivosAdmin;
