// frontend/src/pages/DashboardAdmin.jsx

import { useState } from "react";
import api from "../api";

const DashboardAdmin = () => {
  const [mensaje, setMensaje] = useState("");

  const handleGenerarClases = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/admin/generar-clases",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensaje(res.data.mensaje || "Clases generadas con éxito.");
    } catch (err) {
      setMensaje("Error al generar clases.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <p className="mb-6">
        Desde aquí puedes generar clases automáticamente para el mes actual y el siguiente según la plantilla configurada.
      </p>

      <button
        onClick={handleGenerarClases}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generar clases automáticamente
      </button>

      {mensaje && <p className="mt-4 text-green-600 font-medium">{mensaje}</p>}
    </div>
  );
};

export default DashboardAdmin;
