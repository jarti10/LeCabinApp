import { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

export default function MisReservasClase() {
  const { token } = useContext(AuthContext);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    api.get("/reservas-clase", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setReservas(res.data))
    .catch(err => console.error("Error al cargar reservas:", err));
  }, [token]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mis reservas de clase</h2>
      {reservas.length === 0 ? (
        <p>No tienes reservas activas.</p>
      ) : (
        <ul className="space-y-4">
          {reservas.map(reserva => (
            <li key={reserva.id} className="p-4 border rounded bg-white shadow">
              <p><strong>ID clase:</strong> {reserva.clase_id}</p>
              <p><strong>Estado:</strong> {reserva.estado}</p>
              <p><strong>Fecha de creación:</strong> {new Date(reserva.creada_en).toLocaleString()}</p>
              {reserva.cancelada_en && (
                <p><strong>Cancelada en:</strong> {new Date(reserva.cancelada_en).toLocaleString()}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
