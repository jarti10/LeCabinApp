// frontend/src/components/Navbar.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8000/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("No autorizado");
        const data = await res.json();
        // data.info.nombre viene de UserOut.info
        setNombre(data.info?.nombre || data.email);
      })
      .catch((err) => {
        console.error("Error al cargar usuario:", err);
        setNombre("");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/" className="font-bold text-xl">
          Le Cabin App
        </Link>
        <Link to="/agenda" className="hover:underline">
          Agenda
        </Link>
        <Link to="/reservar" className="hover:underline">
          Reservar
        </Link>
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/mis-reservas" className="hover:underline">
          Mis Reservas
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {nombre ? (
          <span>Hola, <strong>{nombre}</strong></span>
        ) : (
          <Link to="/login" className="hover:underline">
            Iniciar sesión
          </Link>
        )}
        {nombre && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
