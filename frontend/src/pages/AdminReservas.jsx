import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminReservas = () => {
  const { token, userId, role } = useContext(AuthContext);
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState(null);
  const [claseId, setClaseId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") {
      navigate("/access-denied");
    }
  }, [role, navigate]);

  const obtenerReservasAdmin = async () => {
    try {
      const res = await api.get(
        `/reservas-clase/clase/${claseId}/admin:${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReservas(res.data);
      setError(null);
    } catch (err) {
      console.error("Error al obtener reservas:", err);
      setError("❌ Error al obtener reservas de clase");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Reservas por Clase (Admin)</h2>

      <div className="mb-4">
        <label className="block mb-1">ID de la clase:</label>
        <input
          type="number"
          value={claseId}
          onChange={(e) => setClaseId(e.target.value)}
          className="border px-2 py-1 w-full"
        />
        <button
          onClick={obtenerReservasAdmin}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          disabled={!claseId}
        >
          Ver reservas
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-2">
        {reservas.map((reserva) => (
          <li key={reserva.id} className="p-2 bg-white rounded shadow">
            {reserva.usuario?.email || "Usuario"} - {reserva.clase?.titulo || "Clase"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminReservas;
