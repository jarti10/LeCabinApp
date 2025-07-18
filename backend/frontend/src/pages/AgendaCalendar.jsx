// frontend/src/pages/AgendaCalendar.jsx

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";

function AgendaCalendar() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [festivos, setFestivos] = useState([]);
  const [clases, setClases] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const hoy = dayjs();
  const limite = hoy.add(5, "day");

  const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");

  const isFestivo = (date) => {
    const iso = formatDate(date);
    return festivos.includes(iso);
  };

  const isValido = (date) => {
    return date >= hoy.toDate() && date <= limite.toDate();
  };

  const fetchClases = (fechaISO) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMensaje("⚠️ Debes iniciar sesión para ver las clases.");
      setClases([]);
      return;
    }

    fetch(`http://localhost:8000/clases?fecha=${fechaISO}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const ahora = new Date();
        const futuras = data.filter((c) => new Date(c.fecha) > ahora);
        setClases(futuras);
        setMensaje("");
      })
      .catch((err) => {
        console.error("Error al cargar clases:", err);
        setMensaje("❌ Error al cargar clases.");
        setClases([]);
      });
  };

  const handleChange = (date) => {
    if (!isValido(date)) {
      alert("Solo puedes reservar hasta 5 días desde hoy.");
      return;
    }
    if (isFestivo(date)) {
      alert("Este día es festivo. No se puede reservar.");
      return;
    }

    setFechaSeleccionada(date);
    fetchClases(formatDate(date));
  };

  const reservarClase = (claseId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMensaje("⚠️ Debes iniciar sesión para reservar.");
      return;
    }

    fetch("http://localhost:8000/reservas/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ clase_id: claseId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setMensaje("✅ Reserva realizada con éxito.");
          fetchClases(formatDate(fechaSeleccionada));
        } else {
          setMensaje("❌ " + (data.detail || "Error al reservar."));
        }
      })
      .catch((err) => {
        console.error("Error al reservar:", err);
        setMensaje("❌ Error de red al reservar.");
      });
  };

  useEffect(() => {
    fetch("/festivos.json")
      .then((res) => res.json())
      .then((data) => setFestivos(data))
      .catch((err) => {
        console.error("Error al cargar festivos:", err);
        setFestivos([]);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Calendario de Agenda</h2>

      <Calendar
        onChange={handleChange}
        value={fechaSeleccionada}
        tileClassName={({ date, view }) => {
          if (view === "month") {
            const iso = formatDate(date);
            if (festivos.includes(iso)) return "bg-red-200";
            if (date.getDay() === 0 || date.getDay() === 6) return "text-gray-300";
          }
        }}
        tileContent={({ date, view }) => {
          if (view === "month" && fechaSeleccionada) {
            const sel = formatDate(fechaSeleccionada);
            if (formatDate(date) === sel) {
              return (
                <div
                  className="bg-yellow-200 w-full h-full absolute inset-0 pointer-events-none"
                ></div>
              );
            }
          }
        }}
        calendarType="ISO 8601"
      />

      {fechaSeleccionada && (
        <>
          <p className="mt-6 text-center text-sm">
            Fecha seleccionada:{" "}
            <span className="font-medium">
              {fechaSeleccionada.toLocaleDateString()}
            </span>
          </p>

          {mensaje && (
            <div
              className={`my-4 p-2 rounded text-center ${
                mensaje.startsWith("✅")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {mensaje}
            </div>
          )}

          <div className="mt-6 space-y-4">
            {clases.length === 0 ? (
              <p className="text-center text-gray-500">
                No hay clases disponibles para este día.
              </p>
            ) : (
              clases.map((clase) => (
                <div
                  key={clase.id}
                  className="border rounded p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">{clase.titulo}</h3>
                    <p>
                      {new Date(clase.fecha).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      – Cupo disponible: {clase.cupo_disponible}
                    </p>
                  </div>
                  <button
                    onClick={() => reservarClase(clase.id)}
                    disabled={clase.cupo_disponible <= 0}
                    className={`px-4 py-2 rounded text-white pointer-events-auto ${
                      clase.cupo_disponible > 0
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Reservar
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AgendaCalendar;
