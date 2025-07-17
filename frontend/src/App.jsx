// frontend/src/App.jsx

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReservarClase from "./pages/ReservarClase";
import CrearClase from "./pages/CrearClase";
import AdminReservas from "./pages/AdminReservas";
import AgendaCalendar from "./pages/AgendaCalendar";
import MisReservas from "./pages/MisReservas";
import Dashboard from "./pages/Dashboard";
import TerminosCondiciones from "./pages/TerminosCondiciones";
import FestivosAdmin from "./pages/FestivosAdmin";
import DashboardAdmin from "./pages/DashboardAdmin";
import AccessDenied from "./pages/AccessDenied";
import PrivateRoute from "./components/PrivateRoute";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { token, role, logout, userName } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="font-bold text-lg">Le Cabin App</h1>
          <div className="space-x-4 flex items-center">
            {/* Greeting first */}
            {token && userName && (
              <span className="text-gray-700 text-sm">Hola, {userName}</span>
            )}
            {/* Then Home button */}
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>

            {token ? (
              <>
                <Link to="/agenda" className="text-blue-600 hover:underline">
                  Agenda
                </Link>
                <Link to="/reservar" className="text-blue-600 hover:underline">
                  Reservar
                </Link>
                {role === "admin" && (
                  <>
                    <Link
                      to="/crear-clase"
                      className="text-blue-600 hover:underline"
                    >
                      Crear Clase
                    </Link>
                    <Link
                      to="/admin/reservas"
                      className="text-blue-600 hover:underline"
                    >
                      Ver reservas
                    </Link>
                    <Link
                      to="/admin/festivos"
                      className="text-blue-600 hover:underline"
                    >
                      Festivos
                    </Link>
                    <Link
                      to="/admin/dashboard"
                      className="text-blue-600 hover:underline"
                    >
                      Admin
                    </Link>
                  </>
                )}
                <Link to="/dashboard" className="text-blue-600 hover:underline">
                  Dashboard
                </Link>
                <Link
                  to="/mis-reservas"
                  className="text-blue-600 hover:underline"
                >
                  Mis Reservas
                </Link>
                <button
                  onClick={logout}
                  className="text-red-600 hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
                <Link to="/register" className="text-blue-600 hover:underline">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terminos" element={<TerminosCondiciones />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route
              path="/agenda"
              element={
                <PrivateRoute>
                  <AgendaCalendar />
                </PrivateRoute>
              }
            />
            <Route
              path="/reservar"
              element={
                <PrivateRoute>
                  <ReservarClase />
                </PrivateRoute>
              }
            />
            <Route
              path="/crear-clase"
              element={
                <PrivateRoute onlyAdmin={true}>
                  <CrearClase />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/reservas"
              element={
                <PrivateRoute onlyAdmin={true}>
                  <AdminReservas />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/festivos"
              element={
                <PrivateRoute onlyAdmin={true}>
                  <FestivosAdmin />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute onlyAdmin={true}>
                  <DashboardAdmin />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/mis-reservas"
              element={
                <PrivateRoute>
                  <MisReservas />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
