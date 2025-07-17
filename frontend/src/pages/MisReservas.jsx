// frontend/src/pages/MisReservas.jsx

import React, { useEffect, useState } from "react";

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const fetchReservas = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8000/reservas/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Reservas recibidas:", data);
        setReservas(data);
      } else {
        console.error(data.detail || "Error al obtener reservas.");
      }
    } catch (err) {
      console.error("Error de red:", err);
    }
  };

  const cancelarReserva = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8000/reservas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje(data.mensaje);
        fetchReservas();
        setTimeout(() => setMensaje(""), 3000);
      } else {
        alert(data.detail || "Error al cancelar.");
      }
    } catch (err) {
      console.error("Error al cancelar reserva:", err);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Mis Reservas</h2>

      {mensaje && (
        <div className="bg-green-100 text-green-800 p-2 rounded mb-4">
          {mensaje}
        </div>
      )}

      {reservas.length === 0 ? (
        <p>No tienes reservas activas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservas.map((r) =>
            r.clase ? (
              <div
                key={r.id}
                className="border rounded-xl shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold mb-1">{r.clase.titulo}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {new Date(r.clase.fecha).toLocaleString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {r.clase.instructor && (
                    <p className="text-sm text-gray-500 mb-1">
                      Instructor: {r.clase.instructor}
                    </p>
                  )}
                  {r.clase.sala && (
                    <p className="text-sm text-gray-500 mb-2">
                      Sala: {r.clase.sala}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => cancelarReserva(r.id)}
                  className="mt-2 self-start text-red-600 hover:underline"
                >
                  Cancelar reserva
                </button>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default MisReservas;
