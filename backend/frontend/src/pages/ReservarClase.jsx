// frontend/src/pages/ReservarClase.jsx

import React, { useEffect, useState } from "react";
import api from "../api";
import dayjs from "dayjs";

const ReservarClase = () => {
  const [fecha, setFecha] = useState(dayjs().format("YYYY-MM-DD"));
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState("");
  const [mensaje, setMensaje] = useState("");

  const minDate = dayjs().format("YYYY-MM-DD");
  const maxDate = dayjs().add(5, "day").format("YYYY-MM-DD");

  const token = localStorage.getItem("token");

  const cargarClases = async (fechaISO) => {
    if (!token) {
      setMensaje("⚠️ Necesitas iniciar sesión para ver las clases.");
      setClases([]);
      return;
    }
    try {
      const res = await api.get(`/clases?fecha=${fechaISO}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClases(res.data);
      setMensaje("");
      setClaseSeleccionada("");
    } catch (err) {
      console.error("Error al cargar clases:", err);
      setMensaje("❌ Error al cargar clases.");
      setClases([]);
    }
  };

  useEffect(() => {
    cargarClases(fecha);
  }, [fecha]);

  const handleDateChange = (e) => {
    setFecha(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!claseSeleccionada) {
      setMensaje("⚠️ Selecciona una clase antes de reservar.");
      return;
    }
    try {
      await api.post(
        "/reservas/",
        { clase_id: parseInt(claseSeleccionada, 10) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMensaje("✅ Reserva realizada con éxito.");
      cargarClases(fecha);
    } catch (err) {
      console.error("Error al reservar:", err);
      const detalle = err.response?.data?.detail || err.message;
      setMensaje("❌ Error al reservar: " + detalle);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Reservar una Clase
      </h2>

      {mensaje && (
        <div
          className={`mb-4 p-2 rounded ${
            mensaje.startsWith("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Elige la fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={handleDateChange}
          min={minDate}
          max={maxDate}
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block mb-2 font-medium">Elige una clase:</label>
        <select
          value={claseSeleccionada}
          onChange={(e) => setClaseSeleccionada(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">-- Selecciona una clase --</option>
          {clases.map((clase) => (
            <option key={clase.id} value={clase.id}>
              {dayjs(clase.fecha).format("DD/MM/YYYY HH:mm")} – {clase.titulo} (cupo: {clase.cupo_disponible})
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!claseSeleccionada}
          className={`w-full py-2 rounded text-white ${
            !claseSeleccionada
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Reservar
        </button>
      </form>
    </div>
  );
};

export default ReservarClase;
