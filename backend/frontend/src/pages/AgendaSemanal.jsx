import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api";

function AgendaSemanal() {
  const { token } = useContext(AuthContext);
  const [clases, setClases] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const res = await api.get("/clases", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const limite = new Date();
        limite.setDate(hoy.getDate() + 5);
        limite.setHours(23, 59, 59, 999);

        const enRango = res.data.filter((clase) => {
          const fecha = new Date(clase.fecha);
          return fecha >= hoy && fecha <= limite;
        });

        setClases(enRango);
      } catch (err) {
        console.error("Error al obtener clases:", err);
      }
    };

    if (token) {
      fetchClases();
    }
  }, [token]);

  const handleReservar = async (claseId) => {
    const confirmar = window.confirm("¿Reservar esta clase?");
    if (!confirmar) return;

    try {
      await api.post(
        "/reservas-clase/",
        { clase_id: claseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensaje("✅ Reserva realizada con éxito.");
    } catch (err) {
      const detalle = err.response?.data?.detail;
      if (detalle === "Ya estás inscrito en esta clase") {
        setMensaje("⚠️ Ya tenés una reserva en esta clase.");
      } else if (detalle === "Clase llena") {
        setMensaje("❌ Clase llena, no se pudo reservar.");
      } else {
        setMensaje("❌ Error inesperado al reservar.");
      }
    }

    setTimeout(() => setMensaje(""), 4000);
  };

  const clasesAgrupadas = {};
  clases.forEach((clase) => {
    const fecha = new Date(clase.fecha);
    const clave = fecha.toISOString().split("T")[0];
    if (!clasesAgrupadas[clave]) clasesAgrupadas[clave] = [];
    clasesAgrupadas[clave].push(clase);
  });

  const diasOrdenados = Object.keys(clasesAgrupadas)
    .sort()
    .map((fechaStr) => {
      const fechaObj = new Date(fechaStr);
      return {
        fecha: fechaObj,
        clases: clasesAgrupadas[fechaStr],
      };
    });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Agenda Semanal</h1>

      {mensaje && (
        <div className="mb-4 p-3 rounded text-sm font-medium bg-blue-100 border border-blue-300 text-blue-700">
          {mensaje}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {diasOrdenados.map(({ fecha, clases }) => (
          <div key={fecha.toISOString()} className="bg-white rounded shadow p-2">
            <h2 className="text-center font-semibold text-lg mb-2">
              {fecha.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}
            </h2>
            {clases.length === 0 ? (
              <p className="text-sm text-gray-400 text-center">Sin clases</p>
            ) : (
              <ul className="space-y-2">
                {clases.map((clase) => (
                  <li
                    key={clase.id}
                    className="border border-blue-200 rounded p-2 text-sm bg-blue-50 cursor-pointer hover:bg-blue-100"
                    onClick={() => handleReservar(clase.id)}
                  >
                    <div className="font-medium">{clase.titulo}</div>
                    <div>
                      {new Date(clase.fecha).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      hs
                    </div>
                    <div>Duración: {clase.duracion_min} min</div>
                    <div>
                      Cupo: {clase.cupo_ocupado}/{clase.cupo_maximo}
                    </div>
                    {clase.sala && <div>Sala: {clase.sala}</div>}
                    {clase.coach && <div>Coach: {clase.coach}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgendaSemanal;
