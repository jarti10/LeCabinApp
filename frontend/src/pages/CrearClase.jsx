import { useState, useContext, useEffect } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function CrearClase() {
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    fecha: "",
    sala: "",
    instructor: "",
    cupo_maximo: 7,
  });

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (role !== "admin") {
      navigate("/access-denied");
    }
  }, [role, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titulo || !form.fecha || !form.cupo_maximo) {
      setMensaje("⚠️ Por favor, completa los campos obligatorios");
      return;
    }

    try {
      await api.post("/clases/", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMensaje("✅ Clase creada correctamente");
      setForm({
        titulo: "",
        fecha: "",
        sala: "",
        instructor: "",
        cupo_maximo: 7,
      });
    } catch (err) {
      console.error("Error al crear clase:", err);
      setMensaje("❌ Error al crear clase");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Crear Nueva Clase</h2>
      {mensaje && <p className="mb-2 text-center">{mensaje}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={form.titulo}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="sala"
          placeholder="Sala"
          value={form.sala}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="instructor"
          placeholder="Instructor"
          value={form.instructor}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="cupo_maximo"
          placeholder="Cupo máximo"
          value={form.cupo_maximo}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Crear Clase
        </button>
      </form>
    </div>
  );
}

export default CrearClase;
