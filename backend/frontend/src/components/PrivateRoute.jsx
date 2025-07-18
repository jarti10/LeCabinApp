import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children, onlyAdmin = false }) {
  const { token, role } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (onlyAdmin && role !== "admin") {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}

export default PrivateRoute;
