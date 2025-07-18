import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import { useNavigate } from "react-router-dom";

function NuevaReserva() {
  const { token } = useContext(AuthContext);
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const res = await api.get("/clases", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClases(res.data);
      } catch (err) {
        console.error("Error al cargar clases:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchClases();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!claseSeleccionada) return alert("Selecciona una clase");

    try {
      await api.post(
        "/reservas-clase/",
        { clase_id: parseInt(claseSeleccionada) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Reserva realizada con éxito");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error al reservar:", err);
      alert(err.response?.data?.detail || "Error al reservar");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Reservar una clase</h1>

      {loading ? (
        <p>Cargando clases disponibles...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Selecciona una clase:</label>
          <select
            value={claseSeleccionada}
            onChange={(e) => setClaseSeleccionada(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">-- Elige una clase --</option>
            {clases.map((clase) => (
              <option key={clase.id} value={clase.id}>
                {clase.titulo} – {new Date(clase.fecha).toLocaleString()}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reservar
          </button>
        </form>
      )}
    </div>
  );
}

export default NuevaReserva;
