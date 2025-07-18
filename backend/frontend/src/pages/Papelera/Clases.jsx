import { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

function Clases() {
  const { token } = useContext(AuthContext);
  const [clases, setClases] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchClases = async () => {
    try {
      const res = await api.get("/clases/");
      setClases(res.data);
    } catch (err) {
      console.error("Error al cargar clases");
    }
  };

  const reservar = async (claseId) => {
    try {
      await api.post(
        "/reservas-clase/",
        { clase_id: claseId },
        config
      );
      setMensaje("Reserva realizada correctamente");
    } catch (err) {
      setMensaje(
        err.response?.data?.detail || "No se pudo realizar la reserva"
      );
    }
  };

  useEffect(() => {
    fetchClases();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Clases Disponibles</h2>
      {mensaje && <p className="mb-4 text-blue-600">{mensaje}</p>}

      {clases.length === 0 ? (
        <p>No hay clases disponibles.</p>
      ) : (
        <ul className="space-y-4">
          {clases.map((clase) => (
            <li
              key={clase.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{clase.titulo}</p>
                <p>{new Date(clase.fecha).toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  Coach: {clase.coach || "Sin asignar"} | Duración: {clase.duracion_min} min
                </p>
              </div>
              <button
                onClick={() => reservar(clase.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Reservar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Clases;
