// frontend/src/pages/Register.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones para registrarte.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          acepta_terminos: aceptaTerminos,
          info: {
            nombre,
            apellido1,
            apellido2,
            dni,
            telefono,
            codigo_postal: codigoPostal,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Error registrando usuario.");
      } else {
        setMensaje("✅ Registro exitoso. Ya puedes iniciar sesión.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error(err);
      setError("Error de red al registrarse.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Registro de Usuario</h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">{error}</div>
      )}
      {mensaje && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{mensaje}</div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          required
        />
        <input
          type="text"
          placeholder="Primer apellido"
          value={apellido1}
          onChange={(e) => setApellido1(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          required
        />
        <input
          type="text"
          placeholder="Segundo apellido"
          value={apellido2}
          onChange={(e) => setApellido2(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />
        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          required
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          required
        />
        <input
          type="text"
          placeholder="Código postal"
          value={codigoPostal}
          onChange={(e) => setCodigoPostal(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          required
        />

        {/* -- Aquí agregamos el texto de términos y condiciones: -- */}
        <div className="mb-4 p-3 bg-gray-50 border rounded text-sm text-gray-700">
          <p>
            Estos son los términos y condiciones genéricos. Por favor, lee con
            atención este texto antes de continuar. Al marcar la casilla, aceptas
            cumplir con todas las cláusulas aquí descritas y te comprometes a
            respetar los protocolos y normas de uso de la plataforma.
          </p>
        </div>

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
            className="mr-2"
            required
          />
          Acepto los términos y condiciones
        </label>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Registrarme
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
};

export default Register;
